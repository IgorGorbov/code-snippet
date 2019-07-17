const express = require('express');
const snippetController = require('../controllers/snippetController');

const router = express.Router();

router.post('/', snippetController.create);

module.exports = router;
