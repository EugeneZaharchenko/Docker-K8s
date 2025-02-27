const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Goal = require('./models/goal');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(express.json()); // Replaces body-parser which is now built into Express
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
})); // Replaces manual CORS setup

// Route handlers
app.get('/goals', async (req, res) => {
  console.log('TRYING TO FETCH GOALS');
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
    console.log('FETCHED GOALS');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load goals.' });
  }
});

app.post('/goals', async (req, res) => {
  console.log('TRYING TO STORE GOAL');
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid goal text.' });
  }

  const goal = new Goal({
    text: goalText,
  });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
    console.log('STORED NEW GOAL');
  } catch (err) {
    console.error('ERROR STORING GOAL');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save goal.' });
  }
});

app.delete('/goals/:id', async (req, res) => {
  console.log('TRYING TO DELETE GOAL');
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted goal!' });
    console.log('DELETED GOAL');
  } catch (err) {
    console.error('ERROR DELETING GOAL');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete goal.' });
  }
});

// MongoDB connection - modern approach with async/await
const startServer = async () => {
  try {
    // Build connection string
    const mongoURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${
      process.env.MONGODB_HOST || 'localhost'
    }:${process.env.MONGODB_PORT || '27017'}/course-goals?authSource=admin`;

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('CONNECTED TO MONGODB!!');

    // Start the server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
    process.exit(1); // Exit with failure
  }
};

// Initialize the server
startServer();