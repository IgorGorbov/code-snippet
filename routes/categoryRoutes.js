const express = require('express');
const auth = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/', auth, categoryController.create);

module.exports = router;
