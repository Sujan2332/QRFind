const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const bcrypt = require('bcryptjs');
const validator = require('validator');
const cors = require("cors")
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const QRCode = require("qrcode");

const app = express();
const PORT = 5000;
const { JWT_SECRET_KEY } = process.env; // Store your secret key in environment variables

// Middleware to verify JWT token and extract userId
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: true, message: "Authentication token required" });
    }

    try {
        // Verify the token and extract userId from the payload
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = decoded.userId; // Attach userId to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: true, message: "Invalid or expired token" });
    }
};


const frontend = process.env.FRONTEND_URL

app.use(cors());
// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/personDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Schema and Model
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    contact: String,
    guardianContact: String,
    qrCode: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});
const Person = mongoose.model("Person", personSchema);

const AdminSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email format');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  });
  
  // Hash the password before saving
  AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });
  
  // Method to compare passwords
  AdminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Method to generate a JWT token
  AdminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, 'your_secret_key', { expiresIn: '1h' });
    return token;
  };
  
  const Admin = mongoose.model('Admin', AdminSchema);
  
  // Admin sign-up route
  app.post('/api/admin/signup', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin already exists' });
      }
  
      const admin = new Admin({ email, password });
      await admin.save();
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error during sign-up', details: error.message });
    }
  });
  
  // Admin login route
  app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
  
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
  
        // Generate JWT token
        const token = admin.generateAuthToken();
  
        // Send response with the message, token, and admin's _id (userId)
        res.json({
            message: 'Login successful',
            token,
            userId: admin._id,  // Include the admin's _id in the response
        });
    } catch (error) {
        res.status(500).json({ error: 'Error during login', details: error.message });
    }
});
  
// Routes
// POST Route to create a new person, store userId (admin _id)
app.post("/api/person", async (req, res) => {
    const { name, age, contact, guardianContact, userId } = req.body; // Get the userId from the request body

    try {
        // Save the person data in the database
        const person = new Person({
            name,
            age,
            contact,
            guardianContact,
            userId, // Save the userId (admin _id) here
        });

        await person.save(); // Save the person data to the database

        // Generate a URL with the person ID for the QR code
        const qrUrl = `${frontend}user-details/${person._id}`;

        // Generate the QR code image as a base64 string, containing the URL
        const qrCode = await QRCode.toDataURL(qrUrl);

        // Update the person with the generated QR code
        person.qrCode = qrCode;
        await person.save(); // Save the updated person data with the QR code

        // Respond with the saved person data and QR code
        res.status(201).json({ person });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while saving data" });
    }
});

// GET Route to fetch only the data created by the logged-in user
app.get("/api/data", async (req, res) => {
    const userId = req.headers['userid']; // Access the userId from headers

    if (!userId) {
        return res.status(400).json({ error: true, message: 'User ID is missing' });
    }

    try {
        // Fetch only the data where the userId matches the logged-in user's ID
        const datas = await Person.find({ userId });

        if (datas.length === 0) {
            return res.status(404).json({ 
                error: true, 
                message: "No data found for this user" 
            });
        }

        // Respond with the user's data
        res.json(datas.map(data => ({
            ...data.toObject() // Convert to plain object
        })));
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Error fetching data",
            details: err.message // Detailed error message
        });
    }
});

  // Fetch individual person data by ID
app.get("/api/user-details/:id", async (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL parameters

    try {
        // Find the person by their ID in the database
        const person = await Person.findById(id);

        // Check if the person exists
        if (!person) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

        // Return the person data
        res.json({
            name: person.name,
            age: person.age,
            contact: person.contact,
            guardianContact: person.guardianContact,
            qrCode: person.qrCode, // Include the QR code if necessary
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Error Fetching user data",
            details: err.message,
        });
    }
});

  
  // This is your DELETE route to handle deletion by ID
app.delete("/api/delete/:id", async (req, res) => {
    try {
        const { id } = req.params; // Get the id from the URL
        const deletedPerson = await Person.findByIdAndDelete(id); // Delete the person by ID

        if (!deletedPerson) {
            return res.status(404).json({
                error: true,
                message: "Person not found",
            });
        }

        res.json({
            message: "Person deleted successfully",
            deletedPerson,
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Error deleting data",
            details: err.message,
        });
    }
});

app.delete("/api/deleteAll", async (req, res) => {
    const userId = req.headers['userid']; // Assuming userId is sent in the headers

    if (!userId) {
        return res.status(400).json({ error: true, message: 'User ID is missing' });
    }

    try {
        // Delete all documents where the creator's userId matches the logged-in user
        const result = await Person.deleteMany({ userId });
        if(result===0){
            return res.status(400).json({
                error:true,
                message:"No data to delete"
            })
        }
        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: true,
                message: "No data found for this user"
            });
        }

        res.json({
            message: "All data deleted successfully",
            deletedCount: result.deletedCount, // Number of documents deleted
        });
    } catch (err) {
        console.error("Error Deleting All Data:", err); // Log the error for debugging
        res.status(500).json({
            error: true,
            message: "Error Deleting All Data",
            details: err.message, // Detailed error message
        });
    }
});


app.patch("/api/update/:id", async (req,res)=>{
    try{
        const { id } = req.params;
        const updateData = req.body

        if(!updateData || Object.keys(updateData).length === 0){
            return res.status(400).json({
                error:true,
                message:"No Update Data Provided"
            })
        }

        const updatedPerson = await Person.findByIdAndUpdate(id,updateData,{new:true})

        if(!updatedPerson){
            return res.status(404).json({
                error:true,
                message:"Person Not Found"
            })
        }

        res.json({
            message:"Data Updated Successfuly",
            updatedPerson
        })
    } catch(err){
        console.error("Error Updating Data:", err)
        res.status(500).json({
            error:true,
            message:"Error Updating Data",
            details:err.message
        })
    }
})


app.get("/", (req, res) => {
    res.send("QR Code App Backend Running");
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
