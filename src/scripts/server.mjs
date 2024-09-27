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

// Enable CORS with HTTPS allowed
app.use(cors({
  origin: 'https://nif-dashboard.llnl.gov', // Ensure only your domain is allowed
  credentials: true
}));

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
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files uploaded'); // Debug log
      return res.status(400).json({
        status: false,
        message: 'No file uploaded'
      });
    }

    let file = req.files.file;
    console.log(`File received: ${file.name}`); // Debug log

    // Check file extension
    if (path.extname(file.name) !== '.xlsx') {
      console.log('Invalid file format'); // Debug log
      return res.status(400).json({
        status: false,
        message: 'Invalid file format. Only .xlsx files are allowed.'
      });
    }

    // Move the file to the correct data directory
    const uploadPath = path.join(publicPath, 'data', 'data.xlsx');
    console.log(`Moving file to ${uploadPath}`); // Debug log
    file.mv(uploadPath, err => {
      if (err) {
        console.log('Error moving file:', err); // Debug log
        return res.status(500).json({
          status: false,
          message: 'Error moving file',
          error: err
        });
      }

      console.log('File uploaded successfully'); // Debug log
      res.status(200).json({
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
    res.status(500).json({
      status: false,
      message: 'Server error',
      error: err
    });
  }
});

// Create HTTPS server with SSL options and handling
https.createServer(sslOptions, app)
  .on('error', (err) => {
    console.error(`SSL Error: ${err.message}`);
  })
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with SSL`);
  });
