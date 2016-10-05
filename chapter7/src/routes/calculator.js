var express = require('express');
var router = express.Router();
var calculator = require('../controllers/calculator_controller');

router.post('/add', calculator.doAdd);

module.exports = router;
