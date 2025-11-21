const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoute = require('./routes/productRoute');
// 1. Load environment variables
dotenv.config();

// 2. Initialize Express & Database
connectDB()
const app = express()
const port = process.env.PORT || 5000;

// 3. Middleware (The Gatekeepers) 
app.use(cors());                 // Allows React (on port 3000) to talk to this API
app.use(express.json());         // Allows us to parse JSON data sent in reqbody
app.use(express.urlencoded({ extended: false }));

//product routes
app.use('/products', productRoute);

// 5. Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});