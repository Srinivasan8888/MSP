import express from 'express';
import {
    createReport, createAlert, SetColorRange, deleteReport,
    updateReport, getColorRangeModel, updateUser, deleteUser, getUserDetails, 
    updateAlert, deleteAlert, createSetAlert, getUserAlertRange, SaveAlertRange, SetAlertFrequency, getAlertFrequency, AlertfreqUsers, alertFrequency, reportUsers, getFrequency, getUsers
} from '../Controller/Admin.Controller.js';

const router = express.Router();

router.post('/createReport', createReport);
router.post('/setFrequency', alertFrequency);
router.post('/createAlert', createAlert);
router.post('/createAlertUsers', createSetAlert);
router.post('/createSetAlertFrequency', SetAlertFrequency);
router.post('/SaveUserAlert', SaveAlertRange);
router.post('/SaveColorRange', SetColorRange);
router.post('/getUserDetails', getUserDetails)

//get request
router.get('/getReportUsers', reportUsers);
router.get('/getAlertFreqUsers', AlertfreqUsers);
router.get('/getFrequency', getFrequency);
router.get('/getAlertFrequency', getAlertFrequency);
router.get('/getUserAlertRange', getUserAlertRange);
router.get('/getColorRange', getColorRangeModel);
router.get('/getUsers', getUsers)


//update request
router.put('/updateReport', updateReport)
router.put('/updateAlertUser/:email', updateAlert)
router.put('/updateUsers/:email', updateUser);

//delete request
router.delete('/deleteReport/:email', deleteReport)
router.delete('/deleteAlertUser/:email', deleteAlert)
router.delete('/deleteUsers/:email', deleteUser)

export default router;