const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriesProductsController');

router.get('/:categoryId', controller.getProductsByCategory);

module.exports = router;
