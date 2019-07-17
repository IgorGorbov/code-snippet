const express = require('express');
const snippetController = require('../controllers/snippetController');

const router = express.Router();

router.post('/', snippetController.create);
router.get('/:id', snippetController.get);
router.delete('/:id', snippetController.delete);
router.patch('/:id', snippetController.update);

module.exports = router;
