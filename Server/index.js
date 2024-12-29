const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const bodyParser = require("body-parser");
const QRCode = require("qrcode");

const app = express();
const PORT = 5000;
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
});

const Person = mongoose.model("Person", personSchema);

// Routes
app.post("/api/person", async (req, res) => {
    const { name, age, contact, guardianContact } = req.body;

    try {
        // Generate QR code data
        const qrData = {
            name,
            contact,
            guardianContact,
        };

        // Generate the QR code image as a base64 string
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

        // Save the person data along with the QR code in the database
        const person = new Person({
            name,
            age,
            contact,
            guardianContact,
            qrCode, // Save the generated QR code
        });

        await person.save(); // Save the data to the database

        // Respond with the saved person data and QR code
        res.status(201).json({ person });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while saving data" });
    }
});

app.get("/api/all-persons", async (req, res) => {
    try {
        // Fetch all persons from the database
        const persons = await Person.find();

        // Generate QR codes for each person
        const personsWithQrCodes = await Promise.all(persons.map(async (person) => {
            const qrData = {
                name: person.name,
                contact: person.contact,
                guardianContact: person.guardianContact,
            };
            const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
            return { ...person.toObject(), qrCode };
        }));

        res.status(200).json(personsWithQrCodes);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching the data", details: err.message });
    }
});


app.get("/api/data", async (req, res) => {
    try {
      const datas = await Person.find();
      res.json(datas.map(data => ({
        ...data.toObject()
      })));
    } catch (err) {
      res.status(500).json({
        error: true,
        message: "Error Fetching data",
        details: err.message
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

app.get("/", (req, res) => {
    res.send("QR Code App Backend Running");
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
