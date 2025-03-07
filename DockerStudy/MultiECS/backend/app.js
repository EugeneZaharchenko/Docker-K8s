const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Goal = require('./models/goal');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

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
    console.error('ERROR FETCHING GOALS:', err.message);
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

  const goal = new Goal({ text: goalText });

  try {
    await goal.save();
    res.status(201).json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
    console.log('STORED NEW GOAL');
  } catch (err) {
    console.error('ERROR STORING GOAL:', err.message);
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
    console.error('ERROR DELETING GOAL:', err.message);
    res.status(500).json({ message: 'Failed to delete goal.' });
  }
});

// MongoDB connection
const startServer = async () => {
  try {
    // Validate environment variables
    const mongoHost = process.env.MONGO_HOST;
    const mongoUsername = process.env.MONGO_USERNAME;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoDb = process.env.MONGO_DATABASE;

    if (!mongoHost || !mongoUsername || !mongoPassword) {
      throw new Error('Missing required environment variables for MongoDB connection.');
    }

    const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDb}?retryWrites=true&w=majority&appName=DockerAWStudy`;
    // const mongoURI = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:27017/course-goals?authSource=admin`;

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5-second timeout
    });

    console.log('CONNECTED TO MONGODB!!');

    // Start the server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('FAILED TO CONNECT TO MONGODB:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Start the server
startServer().catch(err => {
  console.error('Failed to start the server:', err.message);
  process.exit(1);
});