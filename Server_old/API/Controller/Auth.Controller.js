import createError from "http-errors";
import User from "../Models/User.model.js";
import { authSchema } from "../../Helpers/validation_schema.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateAccessToken,
  verifyAccessToken,
} from "../../Helpers/jwt_helper.js";
import { client as redisClient, redisPromise } from "../../Helpers/init_redis.js";
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import bcrypt from 'bcrypt';

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByEmail = 5;

export const getRedisClient = async () => {
  await redisPromise;
  if (!client.isOpen) {
    console.error("Redis client is not connected yet.");
    throw new Error("Redis client is not connected yet.");
  }
  return client;
};


// Initialize rate limiters after connection
let limiterConsecutiveFailsByEmail, limiterSlowBruteByIP;

export const withRateLimiters = (fn) => {
  return async (req, res, next) => {
    await redisPromise;
    createLimiters();
    return fn(req, res, next);
  };
};

const createLimiters = () => {
  limiterConsecutiveFailsByEmail = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_consecutive_email',
    points: maxConsecutiveFailsByEmail,
    duration: 60 * 2, // 2 minutes
    blockDuration: 60 * 2, // Block for 2 minutes after 5 attempts
    // duration: 60 * 15, // 15 minutes
    // blockDuration: 60 * 15, // Block for 15 minutes after 5 attempts
    inmemoryBlockOnConsumed: true // Keep tracking even after server restart
  });

  limiterSlowBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24, // 24 hours
    blockDuration: 60 * 60 * 24 // Block for 24 hours after 100 attempts
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw createError.BadRequest()
      
    const result = await authSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict(
        `${result.email} is already been registered`
      );

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

export const login = async (req, res, next) => {
  const ipAddr = req.ip;
  const email = req.body.email;
  const emailKey = `${email}_${ipAddr}`;

  try {
    // Initialize rate limiters first
    await redisPromise;
    createLimiters();

    // Check IP-based limit
    await limiterSlowBruteByIP.consume(ipAddr);
    
    // Check email+IP attempts
    const resEmail = await limiterConsecutiveFailsByEmail.get(emailKey);
    
    if (resEmail?.consumedPoints >= maxConsecutiveFailsByEmail) {
      const retrySecs = Math.round(resEmail.msBeforeNext / 1000) || 1;
      res.set('Retry-After', retrySecs);
      return next(createError.TooManyRequests('Too many failed attempts. Please try again later.'));
    }

    // Validate credentials
    const { email: reqEmail, password } = req.body;
    if (!reqEmail || !password) {
      throw createError.BadRequest("Email and password required");
    }

    // Find user with proper error handling
    const user = await User.findOne({ email: reqEmail }).select('+password');
    if (!user) {
      throw createError.NotFound("User not registered");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError.Unauthorized("Invalid credentials");
    }

    // Reset counters on success
    await limiterConsecutiveFailsByEmail.delete(emailKey);
    await limiterSlowBruteByIP.delete(ipAddr);

    // Remove sensitive data before response
    user.password = undefined;


    // Generate tokens
    const accessToken = await signAccessToken(user._id, user.role);
    const refreshToken = await signRefreshToken(user._id);
    user.role = undefined;
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user
    });

  } catch (error) {
    console.error(`Login error for ${email}:`, error.stack);

    // Handle specific error types first
    if (error.name === 'MongoError' || error.name === 'MongoNetworkError') {
      console.error('Database error:', error.message);
      error = createError.InternalServerError('Database connection issue');
      return next(error);
    }

    // Handle rate limiter errors separately
    if (error instanceof RateLimiterRes) {
      const retrySecs = Math.round(error.msBeforeNext / 1000) || 1;
      res.set('Retry-After', retrySecs);
      return next(createError.TooManyRequests('Too many attempts. Please try again later.'));
    }

    // Only apply rate limits for authentication failures
    if (error.status === 401 || error.status === 404) {
      try {
        await Promise.all([
          limiterConsecutiveFailsByEmail.consume(emailKey),
          limiterSlowBruteByIP.consume(ipAddr)
        ]);
        console.log(`Rate limited ${emailKey}`);
      } catch (rlError) {
        const retrySecs = Math.round(rlError.msBeforeNext / 1000) || 1;
        res.set('Retry-After', retrySecs);
        return next(createError.TooManyRequests('Too many attempts. Please try again later.'));
      }
    }

    // Preserve original error status if available
    const status = error.status || 500;
    const message = status === 500 ? 'Internal server error' : error.message;
    
    next(createError(status, message));
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    res.send({
      success: true,
      message: "Authorized",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest("Refresh token is required");

    const userId = await verifyRefreshToken(refreshToken);
    
    // Delete refresh token from Redis
    await redisClient.del(userId);
    
    // Clear cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    res.sendStatus(204);
  } catch (error) {
    // Even if token is invalid, clear client-side storage
    console.error("Logout error:", error.message);
    res.clearCookie('refreshToken');
    next(createError.Unauthorized("Session terminated"));
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest("Refresh token required");
    
    // Generate new access token using the refresh token
    const accessToken = await generateAccessToken(refreshToken);
    
    // Explicitly send the access token in the response
    res.json({ 
      accessToken,
      message: "New access token generated successfully"
    });
    
  } catch (error) {
    next(error);
  }
};
  
export const getRole = async (req, res) => {
  try {
    const email = req.body.email;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Verify the JWT token
    const decoded = await verifyAccessToken(token);
    
    // Find user in database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if the user has admin access
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.status(200).json({
      success: true,
      role: user.role,
      message: 'Access verified'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}