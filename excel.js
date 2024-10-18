let lineChart, pieChart, barChart;
let excelData;

function readExcelHeaders() { 
    const file = document.getElementById('excelFile').files[0];
    const reader = new FileReader(); 

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(firstSheet, {header: 1}); 
        const headers = excelData[0];
        const xAxisSelect = document.getElementById('xAxis');
        const yAxisSelect = document.getElementById('yAxis');

        xAxisSelect.innerHTML = '<option value="">Select X-Axis</option>';
        yAxisSelect.innerHTML = '<option value="">Select Y-Axis</option>';

        // allow selection of different columns
        headers.forEach((header, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = header;
            xAxisSelect.appendChild(option.cloneNode(true));
            yAxisSelect.appendChild(option);
        });

        xAxisSelect.disabled = false;
        yAxisSelect.disabled = false;
        document.getElementById('generateBtn').disabled = false;

        // add event listeners to prevent selecting the same column ( prevent selecting indentical columns )
        xAxisSelect.addEventListener('change', () => updateAxisOptions(xAxisSelect, yAxisSelect));
        yAxisSelect.addEventListener('change', () => updateAxisOptions(yAxisSelect, xAxisSelect));
    };

    reader.readAsArrayBuffer(file);
}


// Cannot select some columns
function updateAxisOptions(changedSelect, otherSelect) {
    const selectedValue = changedSelect.value;
    Array.from(otherSelect.options).forEach(option => {
        option.disabled = option.value === selectedValue;
    });
}

// Main function for reading excel file then convert it into charts
function processExcel() {
    const xAxisIndex = parseInt(document.getElementById('xAxis').value);
    const yAxisIndex = parseInt(document.getElementById('yAxis').value);
    const rowLimit = parseInt(document.getElementById('rowLimit').value) || excelData.length;

    // start from index 1 (second row) and add rowLimit ( cuz row 1 se la text-data that already been scanned )
    const dataEndIndex = Math.min(rowLimit + 1, excelData.length);
    const labels = excelData.slice(1, dataEndIndex).map(row => row[xAxisIndex]);
    const values = excelData.slice(1, dataEndIndex).map(row => parseFloat(row[yAxisIndex]));

    // extracts the relevant data from the excel file tuy vao row minh chon va call function de tao cac chart khac nhau
    createLineChart(labels, values);
    createPieChart(labels, values);
    createBarChart(labels, values);
}

function createLineChart(labels, values) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) lineChart.destroy(); // destroys any existing line chart before creating a new one
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Line Chart',
                data: values,
                borderColor: 'rgb(75, 192, 192)', 
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function createPieChart(labels, values) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy(); // Replace old chart with new ones 

    const dynamicColors = generateColors(values.length); // Dynamic coloring for the pie chart for better differenciation and visualization.

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: dynamicColors,
                borderColor: 'rgba(255, 255, 255, 0.5)', 
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function createBarChart(labels, values) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bar Chart',
                data: values,
                backgroundColor: 'rgb(75, 192, 192)' 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateColors(count) { // Color generation for pie chart
    const colors = [];
    for (let i = 0; i < count; i++) { 
        const hue = (i * 137.508) % 360;  // For color visualization
        colors.push(`hsl(${hue}, 70%, 60%)`); //  golden angle approximation to spread the colors evenly around the color wheel
    }
    return colors;
}