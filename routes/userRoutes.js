const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users/:userId/snippets', userController.getSnippets);

module.exports = router;
