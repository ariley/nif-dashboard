import * as XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('tableBody');
  const chunkSize = 10; // Number of rows to display at a time
  let currentIndex = 0;
  let rows = [];

  async function fetchExcelData() {
    try {
      const response = await fetch('...src/data/data.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      rows = data.slice(1).map(row => 
        `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`
      );
      rotateRows(); // Start rotating rows after data is fetched
      setInterval(rotateRows, 5000); // Rotate rows every 5 seconds
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function displayRows(startIndex) {
    tableBody.innerHTML = '';
    const endIndex = Math.min(startIndex + chunkSize, rows.length);
    for (let i = startIndex; i < endIndex; i++) {
      tableBody.innerHTML += rows[i];
    }
  }

  function rotateRows() {
    displayRows(currentIndex);
    currentIndex = (currentIndex + chunkSize) % rows.length;
  }

  fetchExcelData(); // Fetch data on load
});