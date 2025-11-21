const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        sku: {
            type: String,
            required: true,
            default: 'SKU-000', // We will generate real ones later
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            trim: true,
        },
        quantity: {
            type: Number,
            required: [true, 'Please add a quantity'],
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            default: 'No description',
        },
        minStock: {
            type: Number,
            default: 5, // Alert when stock is below 5
        },
    },
    {
        timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
    }
);

const Product = mongoose.model('Product',productSchema);
module.exports = Product;