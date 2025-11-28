const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.get('/category/:categoryId', controller.getProductsByCategory);

module.exports = router;