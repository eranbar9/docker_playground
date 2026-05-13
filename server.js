const express = require("express");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "playground";
const MONGO_COLLECTION = process.env.MONGO_COLLECTION || "items";

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

let collection;

async function connectToMongo() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  collection = client.db(MONGO_DB).collection(MONGO_COLLECTION);
  console.log(`Connected to MongoDB at ${MONGO_URL}`);
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", mongoConnected: !!collection });
});

app.get("/items", async (_req, res) => {
  try {
    const items = await collection.find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/items", async (req, res) => {
  try {
    if (!req.body || !req.body.name) {
      return res.status(400).json({ error: "name is required" });
    }
    const result = await collection.insertOne({
      name: req.body.name,
      createdAt: new Date(),
    });
    res.status(201).json({ _id: result.insertedId, name: req.body.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start app:", err);
  process.exit(1);
});
