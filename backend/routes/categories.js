const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriesController');

router.get('/', controller.getCategories);
router.get('/:id', controller.getCategoryById);

module.exports = router;