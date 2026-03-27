const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Body parser
app.use(express.json());

// Logger (Morgan)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://*", "blob:"],
            frameSrc: ["'self'", "https://www.google.com"],
            connectSrc: ["'self'"],
        }
    }
}));

app.use(cors());
app.use(cookieParser());

// Serve static files
app.use(express.static('frontend'));

// API Routes
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Route files
const authRoutes = require('./routes/auth');
const placeRoutes = require('./routes/places');
const articleRoutes = require('./routes/articles');

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/articles', articleRoutes);

const errorHandler = require('./middleware/error');

// ... [rest of app setup]

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
