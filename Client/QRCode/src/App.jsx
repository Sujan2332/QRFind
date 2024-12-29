import React, { useState } from "react";
import axios from "axios";
import "./App.css"

function App() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        contact: "",
        guardianContact: "",
    });
    const [qrCode, setQrCode] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/person", formData);
            setQrCode(res.data.qrCode);
            handleData();
        } catch (err) {
            console.error(err);
            alert("Error saving data");
        }
    };

    const handleData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/data");
            setData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAllData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/all-persons");
            setData(res.data); // Update the state with the fetched data
        } catch (err) {
            console.log(err); // Log any errors
        }
    };
    

    const handleDelete = async (id) => {
      try {
          const res = await axios.delete(`http://localhost:5000/api/delete/${id}`);
          console.log("res",res)
          alert("Person deleted successfully");
          handleData(); // Refresh data after deletion
      } catch (err) {
          console.error(err);
      }
  };

    const printQR = () => {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-family: 'Poppins', sans-serif;
                            background-color: #f5f5f5;
                        }
                        .wristband {
                            border: 2px solid #333;
                            background:black;
                            background-color:black;
                            color:white;
                            padding: 20px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            width: auto;
                            height: auto;
                            text-align: center;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border-radius: 10px;
                        }
                        .wristband img {
                            width: 100px;
                            height: 100px;
                            margin-bottom: 10px;
                        }
                        .wristband h3 {
                            font-size: 16px;
                            margin: 0;
                            color: #f1c40f;
                        }
                    </style>
                </head>
                <body>
                    <div class="wristband">
                        <h3>Emergency Contact</h3>
                        <img src="${qrCode}" alt="QR Code" />
                        <p>Name:</br> ${formData.name}</p>
                        <p>Age:</br> ${formData.age}</p>
                        <p>Contact:</br> ${formData.contact}</p>
                        <p>Guardian:</br> ${formData.guardianContact}</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const OneprintQR = (item) => {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-family: 'Poppins', sans-serif;
                            background-color: #f5f5f5;
                        }
                        .wristband {
                            border: 2px solid #333;
                            background:black;
                            font-size:20px;
                            background-color:black;
                            color:white;
                            padding: 20px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            width: 100%;
                            height: auto;
                            text-align: center;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border-radius: 10px;
                            gap:10px
                            display:flex;
                            flex-direction:row;
                            align-items:center;
                            justify-content:space-evenly;
                        }
                        .wristband img {
                            width: 100px;
                            height: 100px;
                            margin-bottom: 10px;
                        }
                        .wristband h3 {
                            font-size: 16px;
                            margin: 0;
                            color: #f1c40f;
                        }
                    </style>
                </head>
                <body>
                    <div class="wristband">
                        <h3>Emergency Contact</h3>
                        <img src="${item.qrCode}" alt="QR Code" />
                        <p>Name:</br> ${item.name}</p>
                        <p>Age:</br> ${item.age}</p>
                        <p>Contact:</br> ${item.contact}</p>
                        <p>Guardian: </br>${item.guardianContact}</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    React.useEffect(() => {
        handleData()
        handleData(); // Fetch the data once the component mounts
    }, []);

    return (
        <div className="container">
            <h1 className="title">QR Code Generator for Emergency Contact</h1>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="input"
                />
                <input
                    type="text"
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="input"
                />
                <input
                    type="text"
                    name="guardianContact"
                    placeholder="Guardian Contact"
                    value={formData.guardianContact}
                    onChange={handleChange}
                    required
                    className="input"
                />
                <button type="submit" className="submit-btn">Generate QR Code</button>
            </form>

            {qrCode && (
                <div className="qr-wrapper">
                    <h2 className="qr-title">Emergency Contact QR Code</h2>
                    <div className="qr-code-container">
                        <img src={qrCode} alt="Generated QR Code" className="qr-image" />
                    </div>
                    <button onClick={printQR} className="print-btn">Print QR Code</button>
                </div>
            )}

            <div className="data-list">
                <h1>Data List</h1>
                <div className="card">
                    {data.map((item, index) => {
                        return (
                            <ul key={index} className="data-item">
                                <li>Name : {item.name}</li>
                                <li>Age : {item.age}</li>
                                <li>Contact : {item.contact}</li>
                                <li>Guardian : {item.guardianContact}</li>
                                <img src={item.qrCode} alt={`QR Code for ${item.name}`} style={{ width: "100px", height: "100px" }} />
                                <br />
                                <button className="print" onClick={()=>OneprintQR(item)} style={{marginBottom:"10px"}}>Print</button>
                                <br />
                                <button className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
                            </ul>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default App;
