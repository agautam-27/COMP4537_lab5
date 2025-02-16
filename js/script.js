// Import messages from lang/en.js
const messages = {
    errorFetchingData: "Error: Unable to fetch data.",
    enterSQLQuery: "Please enter a SQL query.",
    insertSuccessFrontend: "Insert successful.",
};

// DOM Elements
const backendUrl = "https://urchin-app-2-fp4vo.ondigitalocean.app"; 
const insertDataBtn = document.getElementById("insertDataBtn");
const runQueryBtn = document.getElementById("runQueryBtn");
const sqlQueryInput = document.getElementById("sqlQuery");
const responseDiv = document.getElementById("response");

// Function to insert predefined data
function insertData() {
    fetch(backendUrl, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            query: `INSERT INTO patient (name, dateOfBirth) VALUES 
            ('Sara Brown', '1901-01-01'),
            ('John Smith', '1941-01-01'),
            ('Jack Ma', '1961-01-30'),
            ('Elon Musk', '1999-01-01')`
        })        
    })        
    .then(response => response.text())
    .then(data => {
        responseDiv.innerHTML = `<p>${messages.insertSuccessFrontend}</p>`;
    })
    .catch(error => {
        responseDiv.innerHTML = `<p style="color: red;">${messages.errorFetchingData}</p>`;
    });
}

// Function to run user-entered SQL queries
function runQuery() {
    const query = sqlQueryInput.value.trim();
    if (!query) {
        responseDiv.innerHTML = `<p style="color: red;">${messages.enterSQLQuery}</p>`;
        return;
    }

    // Detect if it's a SELECT query (should be sent via GET)
    const isSelectQuery = query.toUpperCase().startsWith("SELECT");
    
    fetch(`${backendUrl}/query${isSelectQuery ? `?query=${encodeURIComponent(query)}` : ''}`, {
        method: isSelectQuery ? "GET" : "POST",
        headers: { "Content-Type": "application/json" },
        body: isSelectQuery ? null : JSON.stringify({ query })
    })
    .then(response => response.json()) 
    .then(data => {
        if (Array.isArray(data)) {
            let tableHTML = "<table border='1'><tr><th>Patient ID</th><th>Name</th><th>Date of Birth</th></tr>";
            data.forEach(row => {
                tableHTML += `<tr><td>${row.patientid}</td><td>${row.name}</td><td>${row.dateOfBirth.split('T')[0]}</td></tr>`;
            });
            tableHTML += "</table>";
            responseDiv.innerHTML = tableHTML;
        } else {
            responseDiv.innerHTML = `<p>${data}</p>`;
        }
    })
    .catch(error => {
        responseDiv.innerHTML = `<p style="color: red;">${messages.errorFetchingData}</p>`;
    });
}

// Attach event listeners after DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
    insertDataBtn.addEventListener("click", insertData);
    runQueryBtn.addEventListener("click", runQuery);
});
