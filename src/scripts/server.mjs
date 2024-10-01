import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Enable files upload
app.use(fileUpload({
  createParentPath: true
}));

// Static folder
app.use(express.static(path.join(path.resolve(), 'public')));

// Upload endpoint
app.post('/upload', (req, res) => {
  try {
    if (!req.files) {
      // If no file is uploaded, respond with an error in JSON format
      return res.status(400).json({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let file = req.files.file;

      // Check file extension
      if (path.extname(file.name) !== '.xlsx') {
        // Respond with an error if the file format is not .xlsx
        return res.status(400).json({
          status: false,
          message: 'Invalid file format. Only .xlsx files are allowed.'
        });
      }

      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        // Respond with an error if the file exceeds 5MB
        return res.status(400).json({
          status: false,
          message: 'File size exceeds the limit of 5MB.'
        });
      }

      // Move the file to the data directory
      file.mv('./data/data.xlsx', (err) => {
        if (err) {
          // Respond with a 500 error if there's an issue moving the file
          return res.status(500).json({
            status: false,
            message: 'An error occurred while saving the file.',
            error: err
          });
        }

        // // Respond with success if the file is uploaded successfully
        // res.json({
        //   status: true,
        //   message: 'File is uploaded successfully.',
        //   data: {
        //     name: file.name,
        //     mimetype: file.mimetype,
        //     size: file.size
        //   }
        // });
        return res.json({
          status: true,
          message: 'File uploaded successfully',
        });
      });
    }
  } catch (err) {
    // Respond with a 500 error for any other server issues
    return res.status(500).json({
      status: false,
      message: 'An error occurred on the server',
      error: err
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
