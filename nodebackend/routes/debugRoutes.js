// nodebackend/routes/debugRoutes.js
const express = require('express');
const { analyzeDesign } = require('../controllers/debugController');
const router = express.Router();

// POST request to /api/debug/analyze
router.post('/analyze', analyzeDesign);

module.exports = router;