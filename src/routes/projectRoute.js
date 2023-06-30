const express = require('express');
const router = express.Router();
const { fetchProducts } = require('../controller/products');

router.get('/', fetchProducts);

module.exports = router;
