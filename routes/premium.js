const express = require('express');
const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/showleaderboard', premiumController.premium);

module.exports = router;