const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a more secure secret in production

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/tictactoe', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    currentScore: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    pastScores: { type: [Number], default: [] } // New field to store all scores
});


const User = mongoose.model('User', userSchema);

// Utility function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
};

// Register new user
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });

        await newUser.save();
        const token = generateToken(newUser);

        res.status(201).json({ message: 'User registered', token });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
});

// Middleware to authenticate and authorize users
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token expired or invalid' });
        req.user = user;
        next();
    });
};

// Fetch current score and high score for logged-in user
app.get('/scores', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            currentScore: user.currentScore,
            highScore: user.highScore,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching scores', error });
    }
});

// Update player's score after a game
app.post('/update-score', authenticateToken, async (req, res) => {
    const { score } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.currentScore = score;
        user.pastScores.push(score);  // Store the new score

        // Update high score if the new score is greater than all past scores
        user.highScore = Math.max(user.highScore, score);

        await user.save();

        res.status(200).json({ 
            message: 'Score updated', 
            currentScore: user.currentScore, 
            highScore: user.highScore,
            pastScores: user.pastScores  // Returning past scores
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating score', error });
    }
});


// Server listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
