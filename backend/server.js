const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/test-protected', protect, (req, res) => {
    res.json({ message: `Welcome ${req.user.name}, you are authenticated!` });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
