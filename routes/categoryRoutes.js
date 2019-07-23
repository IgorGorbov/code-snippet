const express = require('express');
const auth = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/:id', categoryController.get);
router.get('/', auth, categoryController.getAll);
router.post('/', auth, categoryController.create);
router.delete('/:id', auth, categoryController.delete);
router.patch('/:id', auth, categoryController.update);

module.exports = router;
