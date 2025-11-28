const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentsController');

router.get('/:productId', controller.getCommentsByProduct);

module.exports = router;