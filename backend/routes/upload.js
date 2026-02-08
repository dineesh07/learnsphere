const express = require('express');
const { uploadFile } = require('../controllers/upload');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('instructor', 'admin'), upload.single('file'), uploadFile);

module.exports = router;
