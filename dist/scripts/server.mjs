const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
// SSL options (replace with your actual certificate and key file paths)
const sslOptions = {
  key: fs.readFileSync('/etc/pki/tls/private/localhost.key'),
  cert: fs.readFileSync('/etc/pki/tls/certs/localhost.crt'),
};

// Enable CORS
app.use(cors());

// Enable files upload
app.use(fileUpload({
  createParentPath: true
}));

// Static folder
app.use(express.static(publicPath));

// Upload endpoint
app.post('/upload', (req, res) => {  
  console.log('Upload request received'); // Debug log
  console.log('Public path:', publicPath); // Debug log
  try {
    if (!req.files) {
      res.status(400).send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let file = req.files.file;

      // Check file extension
      if (path.extname(file.name) !== '.xlsx') {
        return res.status(400).send({
          status: false,
          message: 'Invalid file format. Only .xlsx files are allowed.'
        });
      }

      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB
        return res.status(400).send({
          status: false,
          message: 'File size exceeds the limit of 5MB.'
        });
      }

      // Move the file to the data directory
      file.mv('./public/data/data.xlsx', err => {
        if (err) {
          return res.status(500).send(err);
        }

        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            name: file.name,
            mimetype: file.mimetype,
            size: file.size
          }
        });
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
