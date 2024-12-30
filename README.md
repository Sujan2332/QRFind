# *Emergency Contact QR Code Generator*

*A simple React application that allows users to create and manage emergency contact information, generating a unique QR code for each entry. The app also provides functionality to view, print, and delete data entries.*

# *Preview*
## *[Click For Preview](https://qrfind.onrender.com)*

## *Features*

- *Form Submission:* Users can enter details like name, age, contact number, and guardian contact to generate a QR code.
- *QR Code Generation:* The application generates a QR code for the entered emergency contact details.
- *Data Management:* The app fetches, displays, and manages a list of saved emergency contact data.
- *Print QR Code:* Allows users to print a wristband-style QR code with emergency contact details.
- *Delete Data:* Users can delete entries from the database.

## *Tech Stack*

- *Frontend:* React.js
- *Backend:* Node.js (Express.js) *(Assumed for API interaction)*
- *QR Code Generation:* A third-party API or service (like `qrcode` library) for generating QR codes.

## *Installation*

### *1. Clone the repository:*

```bash
git clone https://github.com/your-username/qr-code-generator.git
```

### *2. Install dependencies:*

```bash
cd qr-code-generator
npm install
```

### *3. Start the application:*

```bash
npm start
```

*The app will be available at `http://localhost:3000`.*

## *API Endpoints*

- *`POST /api/person`:* Save emergency contact data and generate a QR code.
- *`GET /api/data`:* Fetch saved emergency contact data.
- *`GET /api/all-persons`:* Fetch all saved persons.
- *`DELETE /api/delete/{id}`:* Delete a specific person by ID.

## *Usage*

1. *Enter Data:*
   - *Fill in the form with your emergency contact information (name, age, contact, guardian contact).*
   - *Click **Generate QR Code** to create a unique QR code for the contact details.*

2. *View QR Code:*
   - *After submitting the form, the generated QR code will be displayed with the contact information.*

3. *Print QR Code:*
   - *Click the **Print QR Code** button to open the QR code in a printable format.*

4. *View All Data:*
   - *A list of all saved emergency contact data will be shown, along with their corresponding QR codes.*

5. *Delete Data:*
   - *Click the **Delete** button next to an entry to remove it from the list.*

## *Example Output*

*After submitting the form, the app will generate and display a QR code like this:*

## Example Output

After submitting the form, the app will generate and display a QR code like this:


Each QR code is unique and encodes the emergency contact information.
[QR Code Example]()

*Each QR code is unique and encodes the emergency contact information.*

## *Contributing*

1. *Fork the repository.*
2. *Create a new branch (`git checkout -b feature-branch`).*
3. *Commit your changes (`git commit -am 'Add new feature'`).*
4. *Push to the branch (`git push origin feature-branch`).*
5. *Open a pull request.*

## *License*

*This project is licensed under the MIT License.*
