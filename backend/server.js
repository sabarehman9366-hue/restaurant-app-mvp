const dns = require("node:dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Menu Schema
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        default: "General"
    }
});

const Menu = mongoose.model("Menu", menuSchema);

// Test Route
app.get("/", (req, res) => {
    res.send("Restaurant Backend API is running!");
});

// GET Menu Items
app.get("/api/menu", async (req, res) => {
    try {
        const menu = await Menu.find();
        res.json(menu);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching menu",
            error: error.message
        });
    }
});

// ADD Menu Item
app.post("/api/menu", async (req, res) => {
    try {
        const { name, price } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: "A valid name and non-negative price are required."
            });
        }

        const newItem = new Menu({
            ...req.body,
            name: name.trim(),
            price: Number(price)
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({
            message: "Error adding menu item",
            error: error.message
        });
    }
});

app.delete("/api/menu/:id", async (req, res) => {
    try {
        const deletedItem = await Menu.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({
                message: "Menu item not found"
            });
        }

        res.json({
            message: "Menu item deleted successfully",
            item: deletedItem.name
        });
    } catch (error) {
        res.status(400).json({
            message: "Could not delete menu item",
            error: error.message
        });
    }
});



const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from your .env file");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Startup error:", error.message);
        process.exit(1);
    }
}

startServer();


