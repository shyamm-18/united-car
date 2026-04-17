const express = require('express');
const router = express.Router();
const { sendInquiry } = require('../controllers/contactController');

router.post('/', sendInquiry);

module.exports = router;
