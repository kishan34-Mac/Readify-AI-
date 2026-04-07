const express = require('express');
const router = express.Router();
const multer = require('multer');
const { optionalAuth } = require('../middleware/auth');
const {
  generateReadme,
  generateReadmeFromRepo,
  generateReadmeFromUser,
} = require('../controllers/redmeController');

// Configure multer to keep files in memory (we just need their names/paths, not the contents for now)
const upload = multer({ storage: multer.memoryStorage() });

// The frontend will send a POST request to /api/generate with the files
router.post('/generate', optionalAuth, upload.array('projectFiles'), generateReadme);
router.post('/generate/repo', optionalAuth, generateReadmeFromRepo);
router.post('/generate/user', optionalAuth, generateReadmeFromUser);

module.exports = router;
