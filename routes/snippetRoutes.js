const express = require('express');
const auth = require('../middleware/auth');
const snippetController = require('../controllers/snippetController');

const router = express.Router();

router.get('/:id', snippetController.get);
router.get('/', auth, snippetController.getAll);
router.post('/', auth, snippetController.create);
router.delete('/:id', auth, snippetController.delete);
router.patch('/:id', auth, snippetController.update);

module.exports = router;
