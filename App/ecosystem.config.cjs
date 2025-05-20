module.exports = {
    apps: [
      {
        name: 'MSP',
        script: 'npm',
        args: 'start',
        env: {
          NODE_ENV: 'production',
        },
        cwd: './',
        watch: false,
        instances: 1,
        autorestart: true,
        max_restarts: 10,
        restart_delay: 4000,
      },
    ],
  }; 