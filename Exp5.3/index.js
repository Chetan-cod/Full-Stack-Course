const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ✅ Add Product
app.post("/product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Products
app.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(products, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add Review
app.post("/product/:id/review", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.reviews.push(req.body);
    product.calculateAvgRating();
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ✅ Update Stock by SKU
app.put("/product/stock/:sku", async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findOneAndUpdate(
      { "variants.sku": req.params.sku },
      { $inc: { "variants.$.stock": quantity } },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Aggregation: Category Average Rating
app.get("/category-ratings", async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          avgCategoryRating: { $avg: "$avgRating" }
        }
      }
    ]);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);