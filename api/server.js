const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");
const app = express();

const port = process.env.PORT || 5000;

// routes

const categoryRoute = require("./routes/categories.js");
const productRoute = require("./routes/products.js");
const billRoute = require("./routes/bills.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to MongoDB`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/bills", billRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => res.send("Hello World"));

app.listen(port, () => {
    connect();
    console.log(`Example app listening on port ${port}`);
});
