// Function to read data from the spreadsheet
async function readSheet() {
    const spreadsheetId = document.getElementById('spreadsheet-id').value;
    if (!spreadsheetId) {
        alert('Please enter a spreadsheet ID');
        return;
    }

    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A1:J10', // Reads first 10 rows, 10 columns
        });

        const result = document.getElementById('result');
        const resultContent = document.getElementById('result-content');

        // Format the data for display
        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            resultContent.textContent = 'No data found.';
        } else {
            const formattedData = rows.map(row => row.join('\t')).join('\n');
            resultContent.textContent = formattedData;
        }

        result.classList.remove('hidden');
    } catch (err) {
        console.error('Error reading sheet:', err);
        alert('Error reading spreadsheet. Check the console for details.');
    }
}

// Function to update data in the spreadsheet
async function updateSheet() {
    const spreadsheetId = document.getElementById('spreadsheet-id').value;
    if (!spreadsheetId) {
        alert('Please enter a spreadsheet ID');
        return;
    }

    try {
        const timestamp = new Date().toISOString();
        const values = [['Last Updated', timestamp]];

        const response = await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A1:B1',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        const result = document.getElementById('result');
        const resultContent = document.getElementById('result-content');

        resultContent.textContent = `Update successful!\nCells updated: ${response.result.updatedCells}\nTimestamp: ${timestamp}`;
        result.classList.remove('hidden');
    } catch (err) {
        console.error('Error updating sheet:', err);
        alert('Error updating spreadsheet. Check the console for details.');
    }
}

// Helper function to display errors
function showError(message) {
    const result = document.getElementById('result');
    const resultContent = document.getElementById('result-content');

    resultContent.textContent = `Error: ${message}`;
    result.classList.remove('hidden');
}
