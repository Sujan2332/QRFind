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
[QR Code Example](data:image/png;base64,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)

*Each QR code is unique and encodes the emergency contact information.*

## *Contributing*

1. *Fork the repository.*
2. *Create a new branch (`git checkout -b feature-branch`).*
3. *Commit your changes (`git commit -am 'Add new feature'`).*
4. *Push to the branch (`git push origin feature-branch`).*
5. *Open a pull request.*

## *License*

*This project is licensed under the MIT License.*
