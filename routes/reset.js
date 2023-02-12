const express = require('express');

const router = express.Router();

const resetController = require('../controllers/reset');

router.get('/resetpassword/:id', resetController.resets);

router.get('/updatepassword/:id', resetController.update)

router.use('/forgotpassword', resetController.forgot);





module.exports = router;