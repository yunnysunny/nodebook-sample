const express = require('express');
const router = express.Router();
const calculator = require('../controllers/calculator_controller');

router.post('/add', calculator.doAdd);

module.exports = router;
