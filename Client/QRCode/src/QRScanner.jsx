import React, { useState,useEffect } from "react";
import axios from "axios";
import "./App.css"
import { useNavigate } from 'react-router-dom';
function QRScanner() {
    const [data, setData] = useState([]);
    const [isEditing,setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        contact: "",
        guardianContact: "",
    });
    const [updateData, setUpdateData] = useState({});
    const [qrCode, setQrCode] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // State for search input
    const navigate = useNavigate();

  // Filter data based on the search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
    const backend = import.meta.env.VITE_BACKENDURL || `https://qrfind-backend.onrender.com/`;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

        const handleLogout = () => {
          // Clear the token and authentication status from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
      
          // Optionally, redirect the user to the login page
          navigate('/login');  // Redirect to the login page
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
        
            // Get the user ID from localStorage (assuming it is stored under the key 'userId')
            const userId = localStorage.getItem('userId');
            console.log( "user",userId)
        
            // Add userId to the form data
            const dataWithUserId = { 
                ...formData, 
                userId 
            };
            try {
                // Send the form data with the userId to the backend
                const res = await axios.post(`${backend}api/person`, dataWithUserId);
        
                // Assuming the QR code is returned as a part of the response
                setQrCode(res.data.qrCode);
                // alert("Data Posted Succesfully")
                // Optionally call handleData() if needed
                handleData();
            } catch (err) {
                console.error(err);
                alert("Error saving data");
            }
        };        

        const handleData = async () => {
            try {
                // Get the userId from localStorage
                const userId = localStorage.getItem('userId'); 
        
                // If the userId is not found, handle the case (optional)
                if (!userId) {
                    console.error('No userId found, user might not be logged in');
                    return;
                }
        
                // Send GET request with userId in the headers
                const res = await axios.get(`${backend}api/data`, {
                    headers: {
                        'userid': userId // Send userId in the header
                    },
                });
        
                // Set the data from the response
                setData(res.data);
            } catch (err) {
                console.error("Error fetching data:", err.response?.data || err.message);
            }
        };                  
    
    const handleCardClick = (id) => {
        // Navigate to the user details page with the user's ID
        navigate(`/user-details/${id}`);
      };

      const toggleEditMode = (item) => {
        setIsEditing(!isEditing);
        setUpdateData({
          _id: item._id,
          name: item.name,
          age: item.age,
          contact: item.contact,
          guardianContact: item.guardianContact
        });
      };

      const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleUpdateSubmit = async () => {
        await handleUpdate(); // Perform the update operation
        setIsEditing(false);  // Exit the edit mode after update is successful
        setUpdateData({}); 
      }; 
      
      const handleUpdate = async () => {
        try {
          const res = await axios.patch(`${backend}api/update/${updateData._id}`, updateData);
          console.log("Update Response:", res.data);
          if (res.status === 200) {
            alert("Data updated successfully!");
            // Refresh data to reflect the changes
            setIsEditing(false); // Exit edit mode
          }
        } catch (err) {
          console.error("Error updating data:", err);
          alert("Failed to update data");
        }
      };     

      const handleDelete = async (id) => {
        try {
            // Send delete request to the backend
            const res = await axios.delete(`${backend}api/delete/${id}`);
            console.log("res", res);
            alert("Person deleted successfully");
    
            // Fetch the updated data
            await handleData(); 
    
            // Check if the updated data is empty
            if (data.length === 1) {
                // If it was the last card, refresh the page
                window.location.reload();
            }
        } catch (err) {
            console.error("Error deleting:", err);
        }
    };    
    

  const handleDeleteAll = async () => {
    try {
        // Get the userId from localStorage
        const userId = localStorage.getItem('userId'); 

        // If the userId is not found, handle the case (optional)
        if (!userId) {
            console.error('No userId found, user might not be logged in');
            return;
        }

        // Send DELETE request with userId in the headers
        const res = await axios.delete(`${backend}api/deleteAll`, {
            headers: {
                'userId': userId // Send userId in the header
            }
        });

        console.log("Response:", res);
        alert("All data deleted successfully");

        // Clear the local data immediately without calling handleData()
        setData([]); // Clear data from the state

    } catch (err) {
        console.error("Error deleting data:", err.response?.data || err.message);
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
                            font-style:italic;
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

    useEffect(() => {
        handleData(); // Fetch the data once the component mounts
    }, []);

    return (
        <div className="container">
             <button  className="logout" onClick={handleLogout}>Logout ?</button>
            <h1 className="title" style={{textDecoration:"underline"}}>QR Code Generator for Emergency Contact <i class="fa-solid fa-qrcode" style={{marginLeft:"10px"}}></i></h1>
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
                <button type="submit" className="submit-btn">Submit</button>
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
                <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
<div className="card">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const isEditingThisCard = updateData._id === item._id; // Check if this card is being edited
            return (
              <ul
                key={index}
                className="data-item"
                onClick={() => {
                  handleCardClick(item._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fa-solid fa-pen-to-square"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleEditMode(item);
                  }}
                  style={{ cursor: "pointer" }}
                ></i>
                {isEditingThisCard ? (
                  <div
                    className="editing"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <li>
                      Name:{" "}
                      <input
                        type="text"
                        name="name"
                        value={updateData.name || item.name}
                        onChange={handleUpdateChange}
                        placeholder={item.name}
                      />
                    </li>
                    <li>
                      Age:{" "}
                      <input
                        type="text"
                        name="age"
                        value={updateData.age || item.age}
                        onChange={handleUpdateChange}
                        placeholder={item.age}
                      />
                    </li>
                    <li>
                      Contact:{" "}
                      <input
                        type="text"
                        name="contact"
                        value={updateData.contact || item.contact}
                        onChange={handleUpdateChange}
                        placeholder={item.contact}
                      />
                    </li>
                    <li>
                      Guardian:{" "}
                      <input
                        type="text"
                        name="guardian"
                        value={updateData.guardianContact || item.guardianContact}
                        onChange={handleUpdateChange}
                        placeholder={item.guardianContact}
                      />
                    </li>
                    <button className="submit" onClick={handleUpdateSubmit}>
                      Submit
                    </button>
                  </div>
                ) : (
                  <>
                    <li>Name: {item.name}</li>
                    <li>Age: {item.age}</li>
                    <li>Contact: {item.contact}</li>
                    <li>Guardian: {item.guardianContact}</li>
                    <img
                      src={item.qrCode}
                      alt={`QR Code for ${item.name}`}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <br />
                    <button
                      className="print"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        OneprintQR(item);
                      }}
                      style={{ marginBottom: "10px" }}
                    >
                      Print
                    </button>
                    <br />
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </ul>
            );
          })
        ) : (
          <p></p>
        )}
      </div>

      {filteredData.length > 0 ? (
        <button
          onClick={handleDeleteAll}
          style={{
            border: "2px solid black",
            padding: "0px 10px",
            borderRadius: "5px",
            background: "red",
            color: "white",
            fontSize: "20px",
            marginTop: "10px",
          }}
        >
          Delete All
        </button>
      ) : (
        <p>No Data Available</p>
      )}
    </div>
    </div>
    );
}

export default QRScanner;
