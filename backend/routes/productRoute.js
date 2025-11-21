const express = require('express');
const router = express.Router();
const {createProduct, getProducts, deleteProduct, updateProduct} = require('../controllers/productController')

//Route to createProducts
router.post('/',createProduct);

//Route to getProducts
router.get('/',getProducts);

//Route to deleteProduct
router.delete('/:id',deleteProduct)

//Route to updateProduct
router.put('/:id',updateProduct)

module.exports = router;