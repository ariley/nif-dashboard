import https from 'https';
import fs from 'fs';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// SSL options (replace with your actual certificate and key file paths)
const sslOptions = {
  key: fs.readFileSync('/etc/pki/tls/private/localhost.key'),
  cert: fs.readFileSync('/etc/pki/tls/certs/localhost.crt'),
};

// Enable CORS
app.use(cors());

// Enable file uploads
app.use(fileUpload({
  createParentPath: true
}));

// Get __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path for the public folder
const publicPath = path.join(__dirname, '..', '..', 'public');

// Static folder
app.use(express.static(publicPath));

// Upload endpoint
app.post('/upload', (req, res) => {
  console.log('Upload request received'); // Debug log
  console.log('Public path:', publicPath); // Debug log
  try {
    // Check if any files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files uploaded'); // Debug log
      return res.status(400).json({
        status: false,
        message: 'No file uploaded'
      });
    }

    let file = req.files.file;
    console.log(`File received: ${file.name}`); // Debug log

    // Validate file extension
    if (path.extname(file.name) !== '.xlsx') {
      console.log('Invalid file format'); // Debug log
      return res.status(400).json({
        status: false,
        message: 'Invalid file format. Only .xlsx files are allowed.'
      });
    }

    // Check file size (limit set to 5MB)
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      console.log('File size exceeds limit'); // Debug log
      return res.status(400).json({
        status: false,
        message: 'File size exceeds the limit of 5MB.'
      });
    }

    // Define the path where the file will be saved
    const uploadPath = path.join(publicPath, 'data', 'data.xlsx');
    console.log(`Moving file to ${uploadPath}`); // Debug log

    // Move the file to the upload directory
    file.mv(uploadPath, (err) => {
      if (err) {
        console.log('Error moving file:', err); // Debug log
        return res.status(500).json({
          status: false,
          message: 'Error moving file',
          error: err.message // Return error message
        });
      }

      console.log('File uploaded successfully'); // Debug log
      return res.status(200).json({
        status: true,
        message: 'File is uploaded',
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    });
  } catch (err) {
    console.log('Server error:', err); // Debug log
    return res.status(500).json({
      status: false,
      message: 'Server error',
      error: err.message // Include detailed error message
    });
  }
});

// HTTPS server setup with SSL options
https.createServer(sslOptions, app)
  .on('error', (err) => {
    console.error(`SSL Error: ${err.message}`); // Log SSL-related errors
  })
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with SSL`);
});