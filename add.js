// Function to navigate to the Add Content page
function goToCMS() {
    window.location.href = 'add.html'; // Navigate to Add Content page
}

function goToProfile() {
    window.location.href = 'profile.html'; // Redirects to profile.html
}


// Function to navigate to Settings page
function goToSettings() {
    alert('Settings page not implemented yet.');
}

// Function to navigate to Support page
function goToSupport() {
    window.location.href = 'contact.html'; // Redirects to profile.html
}


function goToHome() {
    window.location.href = 'index.html'; // Navigate to Add Content page
}

function toggleNav() {
    var nav = document.getElementById("side-nav");
    if (nav.style.width === "250px") {
        nav.style.width = "0";
    } else {
        nav.style.width = "250px";
    }
}

function closeNav() {
    document.getElementById("side-nav").style.width = "0";
}



// Variables to store the information from previous containers
let title = '';
let content = '';
let documentContent = ''; // Store content of document (txt or excel)
let uploadedImageSrc = ''; // Store the image source

// Capture the data from Container 1 (Title and Content)
function goToNextContainer() {
    title = document.getElementById('title').value;
    content = document.getElementById('content').value;

    if (title.trim() === '' || content.trim() === '') {
        alert("Please fill out the title and content before proceeding.");
        return;
    }

    document.getElementById('title-container').style.display = 'none';
    document.getElementById('doc-container').style.display = 'block';

    // Update footer buttons
    updateFooterButtons();
}

// Handle the file upload for documents (only txt and Excel files)
document.getElementById('uploadFilesBtn').addEventListener('click', function() {
    document.getElementById('fileInput').click(); // Trigger hidden input to select a file
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileType = file.type;

        if (fileType === 'text/plain') {
            // Handle .txt file
            const reader = new FileReader();
            reader.onload = function(e) {
                documentContent = `<pre>${e.target.result}</pre>`;
                alert("TXT file uploaded successfully.");
            };
            reader.readAsText(file);

        } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel') {
            // Handle Excel files (xlsx or xls)
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                documentContent = createHtmlTableFromExcel(worksheet); // Convert Excel to HTML table
                alert("Excel file uploaded successfully.");
            };
            reader.readAsArrayBuffer(file);

        } else {
            alert("Unsupported file format. Please upload a .txt or Excel file.");
            documentContent = '';
        }
    }
});

// Function to convert Excel sheet to an HTML table
function createHtmlTableFromExcel(worksheet) {
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Extract data as an array of arrays (rows)
    
    let html = '<table border="1" cellpadding="5" cellspacing="0">';
    jsonData.forEach((row) => {
        html += '<tr>';
        row.forEach((cell) => {
            html += `<td>${cell || ''}</td>`; // Handle empty cells
        });
        html += '</tr>';
    });
    html += '</table>';
    
    return html;
}

// Function to move from Container 2 (Document upload) to Container 3 (Image upload)
function goToNextContainer3() {
    if (documentContent.trim() === '') {
        alert("Please upload a document before proceeding.");
        return;
    }

    document.getElementById('doc-container').style.display = 'none';
    document.getElementById('final-container').style.display = 'block';

    // Update footer buttons
    updateFooterButtons();
}

// Handle image upload in Container 3
document.getElementById('UpLoadImage').addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.addEventListener('change', function(event) {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const reader = new FileReader();

            reader.onload = function(e) {
                uploadedImageSrc = e.target.result; // Save the image source
                alert("Image uploaded successfully.");
            };

            reader.readAsDataURL(imageFile); // Read image as Data URL to display
        }
    });
});

// Function to move from Container 3 (Image upload) to Container 4 (Summary)
function goToNextContainer4() {
    if (!uploadedImageSrc) {
        alert("Please upload an image before proceeding.");
        return;
    }

    document.getElementById('final-container').style.display = 'none';
    document.getElementById('summary-container').style.display = 'block';

    displaySummary();

    // Update footer buttons
    updateFooterButtons();
}

// Function to display the summary in Container 4
function displaySummary() {
    document.getElementById('summary-title').textContent = title;
    document.getElementById('summary-content').textContent = content;

    // Display the uploaded image
    const imageElement = document.getElementById('summary-image');
    imageElement.src = uploadedImageSrc;
    imageElement.style.display = 'block'; // Make sure image is visible

    // Display document content (txt or Excel as a table)
    const documentElement = document.getElementById('summary-file-content');
    documentElement.innerHTML = documentContent;
}

// Functions to go back to previous containers
function goToPreviousContainer() {
    document.getElementById('doc-container').style.display = 'none';
    document.getElementById('title-container').style.display = 'block';
    
    // Update footer buttons
    updateFooterButtons();
}

function goToPreviousContainer2() {
    document.getElementById('final-container').style.display = 'none';
    document.getElementById('doc-container').style.display = 'block';
    
    // Update footer buttons
    updateFooterButtons();
}

function goToPreviousContainer3() {
    document.getElementById('summary-container').style.display = 'none';
    document.getElementById('final-container').style.display = 'block';
    
    // Update footer buttons
    updateFooterButtons();
}

// Function to update the visibility of footer buttons based on the current container
function updateFooterButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (document.getElementById('title-container').style.display !== 'none') {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        nextBtn.onclick = goToNextContainer;

    } else if (document.getElementById('doc-container').style.display !== 'none') {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        prevBtn.onclick = goToPreviousContainer;
        nextBtn.onclick = goToNextContainer3;

    } else if (document.getElementById('final-container').style.display !== 'none') {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        prevBtn.onclick = goToPreviousContainer2;
        nextBtn.onclick = goToNextContainer4;

    } else if (document.getElementById('summary-container').style.display !== 'none') {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        prevBtn.onclick = goToPreviousContainer3;
    }
}

function goToCMS() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
        window.location.href = 'add.html';
    } else {
        alert('Access restricted for guest users.');
    }
}

function goToMedia() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
        window.location.href = 'media.html';
    } else {
        alert('Access restricted for guest users.');
    }
}

function goToDocument() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
        window.location.href = 'document.html'; 
    } else {
        alert('Access restricted for guest users.');
    }
}

function goToShared() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
        window.location.href = 'shared.html'; 
    } else {
        alert('Access restricted for guest users.');
    }
}

function goToVisualize() {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'user') {
        window.location.href = 'excel.html'; 
    } else {
        alert('Access restricted for guest users.');
    }
}

function goToProfile() {
    window.location.href = 'profile.html'; 
}

function goToSupport() {
    window.location.href = 'contact.html';
}

function goToHome() {
    window.location.href = 'index.html';
}

// Call updateFooterButtons on page load to ensure buttons are correct
document.addEventListener('DOMContentLoaded', updateFooterButtons);
