import express from 'express'
import {ApiController} from '../Controller/Api.Controller.js';
// import { verifyAccessToken } from '../../Helpers/jwt_helper.js';

const router = express.Router();

router.get('/getDashboard', ApiController.dashboardApi);
router.get('/getChart', ApiController.chartDate);
router.get('/allgetChart', ApiController.allchartDate);
router.get('/getLiveChart', ApiController.chartLive);
router.get('/ids', ApiController.getUniqueIds);
// router.get('/signal', ApiController.signalSeries);
// router.get('/test', (req, res) => res.send("Test"));

export default router;