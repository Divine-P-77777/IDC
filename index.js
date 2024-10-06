// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const studentRoutes = require('./routes/student'); // Student routes
// const db = require('./firebase'); // Import the Firebase DB instance
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Ensure this path exists
// require('dotenv').config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors()); // Enable CORS for all routes
// app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// // Connect to MongoDB with options
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Use student routes
// app.use('/api', studentRoutes);

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Whitelist of allowed origins
const whitelist = [
    'http://localhost:5173',     // Local development
    'https://insanedc.vercel.app' // Production frontend
];

// CORS configuration with dynamic origin checking
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["POST", "GET", "DELETE", "PATCH", "PUT"],
    credentials: true, // Allow cookies/auth to be sent with requests
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for all routes
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Define student schema and model
const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    institution: { type: String, required: true },
    dob: { type: String, required: true },
    parentName: { type: String, required: true },
    address: { type: String, required: true },
    whatsapp: { type: String, required: true },
    phone: { type: String, required: true },
    healthIssues: { type: String, required: false },
    healthDescription: { type: String, required: false },
    academicCentre: { type: String, required: true },
    passportPhoto: { type: String, required: true },
    classes: { type: [String], required: true },  // Array of classes
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// Student registration endpoint
app.post('/api/student', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).send('Student registered successfully');
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
app.get('/', async (req, res) => {
   res.send("ALL IS WELL")
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

