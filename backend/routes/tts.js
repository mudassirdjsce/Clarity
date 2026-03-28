const express = require('express');
const router = express.Router();
const { speak } = require('../controllers/ttsController');

// POST /api/tts/speak
router.post('/speak', speak);

module.exports = router;
