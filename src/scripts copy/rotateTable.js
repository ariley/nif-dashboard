import * as XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('tableBody');
  const chunkSize = 10; // Number of rows to display at a time
  let currentIndex = 0;
  let rows = [];

  // Define colors for headers
  const headerColors = ['bg-cyan-500', 'bg-orange-500', 'bg-teal-500', 'bg-blue-500', 'bg-red-500', 'bg-slate-500'];
  // Create a mapping from header values to colors
  const headerColorMap = {};

  async function fetchExcelData() {
    try {
      const response = await fetch('/data/data.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      console.log('Parsed JSON data:', jsonData); // Log the raw JSON data

      // Sort JSON data based on column 6 (index 5)
      const sortedData = jsonData.slice(1).sort((a, b) => {
        if (a[6] < b[6]) return -1;
        if (a[6] > b[6]) return 1;
        return 0;
      });

      // Assign colors to headers based on their values
      let colorIndex = 0;
      sortedData.forEach(row => {
        if (!headerColorMap[row[6]]) {
          headerColorMap[row[6]] = headerColors[colorIndex % headerColors.length];
          colorIndex++;
        }
      });

      // Convert sorted JSON data to HTML rows with date formatting
      rows = sortedData.map(row => {
        const formattedDate1 = formatExcelDate(row[4]); // Assuming column 5 contains date
        const formattedDate2 = formatExcelDate(row[5]); // Assuming column 6 contains date
        return {
          header: row[6], // Store the header value
          html: `<tr><td class="dark:border-gray-700">${row[0]}</td><td class="dark:border-gray-700">${row[1]}</td><td class="dark:border-gray-700">${row[2]}</td><td class="dark:border-gray-700">${row[3]}</td><td class="dark:border-gray-700">${formattedDate1}</td><td class="dark:border-gray-700">${formattedDate2}</td><td class="hidden-column">${row[6]}</td></tr>`
        };
      });

      rotateRows(); // Start rotating rows after data is fetched
      setInterval(rotateRows, 10000); // Rotate rows every 5 seconds
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function formatExcelDate(excelDate) {
    // Check if the date is a valid number
    if (!isNaN(excelDate)) {
      // Excel dates are stored as the number of days since January 1, 1900
      const date = new Date((excelDate - (excelDate > 59 ? 25569 : 25568)) * 86400 * 1000);
      return date.toLocaleDateString();
    } else {
      return excelDate; // If not a number, return the raw value
    }
  }

  function displayRows(startIndex) {
    tableBody.innerHTML = '';
    const endIndex = Math.min(startIndex + chunkSize, rows.length);
    let currentHeader = null;

    for (let i = startIndex; i < endIndex; i++) {
      if (rows[i].header !== currentHeader) {
        currentHeader = rows[i].header;
        // Use the color from the headerColorMap
        const headerColor = headerColorMap[currentHeader];
        tableBody.innerHTML += `<tr><td colspan="7" class="dark:border-gray-700 text-gray-700 uppercase ${headerColor} dark:text-white text-center">${currentHeader}</td></tr>`;
      }
      tableBody.innerHTML += rows[i].html;
    }
  }

  function rotateRows() {
    displayRows(currentIndex);
    currentIndex = (currentIndex + chunkSize) % rows.length;
  }

  fetchExcelData(); // Fetch data on load
});
