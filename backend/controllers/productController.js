const Product = require('../models/productModel')

const createProduct = async (req, res) => {
    try {
        const { name, sku, category, quantity, price, description, minStock } = req.body;

        // 1. Validation
        if (!name || !category || !quantity || !price || !description) {
            res.status(400);
            throw new Error('Please fill in all fields');
        }

        // 2. Create Product
        const product = await Product.create({
            name,
            sku,
            category,
            quantity,
            price,
            description,
            minStock,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            res.status(404).json({ message: "Product not found!!!" });
        }
        res.json({ message: "Product is deleted successfully.", deleteProduct })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } 
        );
        if (!updateProduct) {
            res.status(404).json({ message: "Product not found!!!" });
        }
        res.json({ message: "Product updated successfully.", updatedProduct })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createProduct,
    getProducts,
    deleteProduct,
    updateProduct
};