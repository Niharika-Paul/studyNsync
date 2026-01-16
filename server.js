const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.static(path.join(__dirname, 'public')));


// Configure CORS
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Session configuration
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // set to true if using https
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(express.json());
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));
// Serve files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// MongoDB collections
let db = null;
let usersCollection = null;
let resourcesCollection = null;
let projectsCollection = null;

// Initialize MongoDB
async function initializeMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');

    db = client.db('studyNsync');
    usersCollection = db.collection('users');
    resourcesCollection = db.collection('resources');
    projectsCollection = db.collection('projects');

    // Create unique username index if not exists
    const indexes = await usersCollection.listIndexes().toArray();
    const hasUniqueUsernameIndex = indexes.some(index => 
      index.key.username === 1 && index.unique === true
    );
    if (!hasUniqueUsernameIndex) {
      await usersCollection.createIndex({ username: 1 }, { unique: true });
      console.log('Created unique username index');
    }

    return client;
  } catch (error) {
    console.error('MongoDB initialization error:', error);
    process.exit(1);
  }
}

// Initialize MongoDB connection
initializeMongoDB();

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, createdAt: new Date() };
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    req.session.username = username;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Error logging in' });
      }
      res.status(200).json({ message: 'Login successful', username: username, redirectUrl: '/dashboard' });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
});

// Check login status
app.get('/check-auth', (req, res) => {
  if (req.session.username) {
    res.json({ isLoggedIn: true, username: req.session.username });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Static pages
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get('/findabuddy', (req, res) => {
  res.sendFile(path.join(__dirname, 'findabuddy.html'));
});

app.get('/findaProject', (req, res) => {
  res.sendFile(path.join(__dirname, 'findaProject.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// File upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { semester, subject, unit, fileType } = req.body;
    const resource = {
      semester,
      subject,
      unit,
      fileType,
      filename: req.file.originalname,
      filePath: req.file.path,
    };

    await resourcesCollection.insertOne(resource);
    res.status(200).send({ message: "File uploaded successfully!" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send({ message: "File upload failed" });
  }
});

//display profile endpoint
app.get('/user/profile', async (req, res) => {
  try {
    if (!req.session.username) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const user = await usersCollection.findOne({ username: req.session.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name || user.username,
      username: user.username,
      email: user.email,
      contact: user.contact,
      srn: user.srn,
      semester: user.semester,
      resourcesUploadedCount: user.resourcesUploadedCount || 0
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update profile endpoint
app.post('/user/update-profile', async (req, res) => {
  try {
    if (!req.session.username) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const { username, email, contact, srn, semester } = req.body;

    const currentUser = await usersCollection.findOne({ username: req.session.username });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newUsername = username && username.trim() !== '' ? username : currentUser.username;
    const newEmail = email && email.trim() !== '' ? email : 'N/A';
    const newContact = contact && contact.trim() !== '' ? contact : 'N/A';
    const newSrn = srn && srn.trim() !== '' ? srn : 'N/A';

    let newSem = 'N/A';
    if (semester && !isNaN(semester)) {
      const semNum = parseInt(semester, 10);
      if (semNum >= 1 && semNum <= 8) {
        newSem = semNum.toString();
      }
    }

    if (newUsername !== currentUser.username) {
      const existingUser = await usersCollection.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Update user
    await usersCollection.updateOne(
      { username: currentUser.username },
      {
        $set: {
          username: newUsername,
          email: newEmail,
          contact: newContact,
          srn: newSrn,
          semester: newSem
        }
      }
    );

    // If username changed, update session
    req.session.username = newUsername;

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});


app.get("/resources", async (req, res) => {
  try {
    const resources = await resourcesCollection.find().toArray();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resources", error });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    if (!req.session.username) {
      return res.status(401).json({ error: 'You must be logged in to create a project' });
    }

    const projectData = req.body;
    const requiredFields = [
      'projectTitle', 'projectType', 'projectDescription', 'skillsRequired',
      'dateFrom', 'dateTo', 'peopleRequired', 'contactDetails',
    ];

    for (const field of requiredFields) {
      if (!projectData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (projectData.peopleRequired < 1 || projectData.peopleRequired > 10) {
      return res.status(400).json({ error: 'People required must be between 1 and 10' });
    }

    if (!/^[0-9]{10}$/.test(projectData.contactDetails)) {
      return res.status(400).json({ error: 'Contact details must be a 10-digit number' });
    }

    projectData.createdAt = new Date();
    projectData.createdBy = req.session.username;

    const result = await projectsCollection.insertOne(projectData);
    res.status(201).json({ message: 'Project created successfully', projectId: result.insertedId });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await projectsCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Start server with error handling
const server = app.listen(PORT)
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
      app.listen(PORT + 1);
    } else {
      console.error('Server error:', err);
    }
  })
  .on('listening', () => {
    const address = server.address();
    console.log(`Server running on port ${address.port}`);
  });