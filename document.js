// Trigger file upload dialog
function triggerFileUpload() {
    document.getElementById('fileInput').click();
}

// Handle the file upload and store it in localStorage
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) return;

    const fileType = file.type;
    const fileName = file.name;

    // Check if file already exists in localStorage
    if (localStorage.getItem(fileName)) {
        const confirmOverride = confirm("File already exists. Do you want to overwrite it?");
        if (!confirmOverride) {
            return;
        }
    }

    const reader = new FileReader();

    // Handle .txt files
    if (fileType === "text/plain") {
        reader.onload = function () {
            localStorage.setItem(fileName, reader.result);
            localStorage.setItem(`${fileName}_time`, new Date().toString());
            window.location.href = 'document.html';
        };
        reader.readAsText(file);

    // Handle .xlsx files
    } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        reader.onload = function (event) {
            const binaryString = event.target.result; // Get binary string from reader
            const base64String = btoa(String.fromCharCode(...new Uint8Array(binaryString))); // Convert to Base64

            localStorage.setItem(fileName, base64String); // Store Base64 in localStorage
            localStorage.setItem(`${fileName}_time`, new Date().toString());
            window.location.href = 'document.html'; // Redirect after upload
        };
        reader.readAsArrayBuffer(file); // Read as ArrayBuffer to handle binary data

    } else {
        alert("Wrong file type! Please upload .txt or .xlsx files only.");
    }
}



// Load the list of files from localStorage and display in the table
document.addEventListener('DOMContentLoaded', function () {
    const fileList = document.getElementById('fileList').getElementsByTagName('tbody')[0];
    const keys = Object.keys(localStorage);

    if (keys.length === 0 || keys.every(key => key === 'trash')) {
        const emptyMessage = document.createElement('tr');
        emptyMessage.innerHTML = '<td colspan="3">No files uploaded yet.</td>';
        fileList.appendChild(emptyMessage);
        return;
    }

    keys.forEach((key) => {
        // Ignore 'trash' and any '_time' keys
        if (key === 'trash' || key.endsWith('_time')) {
            return;
        }

        const uploadTime = new Date(localStorage.getItem(`${key}_time`));
        const formattedTime = uploadTime.toLocaleString();

        // Ensure the upload time is valid before displaying
        if (!isNaN(uploadTime.getTime())) {
            const tr = document.createElement('tr');
            tr.classList.add('file-item');
            tr.innerHTML = `
                <td>${formattedTime}</td>
                <td class="file-name">${key}</td>
                <td>
                    <button class="menu-btn" onclick="contextMenu(this, '${key}')">
                        <img src="more.png" alt="More Options">
                    </button>
                </td>
            `;
            fileList.appendChild(tr);
        }
    });

    // Bind the context menu to file items
    bindContextMenu();
});


// View file content
function viewFile(fileName) {
    window.location.href = `view.html?file=${fileName}`;
}

// Edit file content
function editFile(fileName) {
    window.location.href = `edit.html?file=${fileName}`;
}

function deleteFile(fileName) {
    if (confirm(`Do you really want to delete ${fileName}?`)) {
        // Fetch existing trash data from localStorage or create a new array
        let trash = JSON.parse(localStorage.getItem('trash')) || [];

        // Add the deleted file to the trash array
        const deletedFile = {
            name: fileName,
            content: localStorage.getItem(fileName),
            time: localStorage.getItem(`${fileName}_time`),
        };
        trash.push(deletedFile);
        localStorage.setItem('trash', JSON.stringify(trash)); // Save updated trash

        // Remove the file from the main localStorage
        localStorage.removeItem(fileName);
        localStorage.removeItem(`${fileName}_time`);

        // Update the UI by removing the deleted file's row from the table
        const row = Array.from(document.querySelectorAll('.file-item')).find(
            (r) => r.querySelector('.file-name').innerText === fileName
        );
        if (row) row.remove(); // Remove the correct row from the table

        alert(`File "${fileName}" moved to trash.`);

        // Reload the page if no more files remain in the list
        const fileList = document.getElementById('fileList').getElementsByTagName('tbody')[0];
        if (fileList.children.length === 0) {
            window.location.reload();
        }
    }
}




// Open context menu by clicking the menu button
function contextMenu(button, fileName) {
    const menu = document.getElementById('context-menu');
    
    // Position the context menu near the clicked button
    const rect = button.getBoundingClientRect();
    menu.style.left = `${rect.right + window.scrollX}px`;
    menu.style.top = `${rect.top + window.scrollY}px`;
    menu.style.display = 'block';

    // Set the selected file to the one associated with the clicked menu button
    selectedFile = fileName;

    // Close the context menu if the user clicks elsewhere
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !button.contains(event.target)) {
            menu.style.display = 'none';
        }
    }, { once: true });
}

// Bind context menu options
function bindContextMenu() {
    const menuOptions = document.querySelectorAll('.menu-option');
    
    menuOptions.forEach(option => {
        option.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const fileName = selectedFile; // Get file name from the selected file

            switch (action) {
                case 'view':
                    viewFile(fileName);
                    break;
                case 'edit':
                    editFile(fileName);
                    break;
                case 'rename':
                    const newName = prompt('Enter new name:', fileName.split('.').slice(0, -1).join('.'));
                    if (newName) {
                        const extension = fileName.split('.').pop();
                        const newFullName = `${newName}.${extension}`;
                        localStorage.setItem(newFullName, localStorage.getItem(fileName));
                        localStorage.setItem(`${newFullName}_time`, localStorage.getItem(`${fileName}_time`));
                        localStorage.removeItem(fileName);
                        localStorage.removeItem(`${fileName}_time`);
                        alert(`File renamed to ${newFullName}`);
                        window.location.reload();
                    }
                    break;
                case 'download':
                    downloadFile(fileName);
                    break;
                case 'share':
                    alert(`Sharing ${fileName}`);
                    break;
                case 'delete':
                    deleteFile(fileName);
                    break;
                default:
                    break;
            }

            // Hide the context menu after an action
            document.getElementById('context-menu').style.display = 'none';
        });
    });


    // add more
    document.getElementById('add-file-button').addEventListener('click', function() {
        const newFileName = document.getElementById('new-file-name').value;
        if (newFileName) {
            const files = JSON.parse(localStorage.getItem('files')) || [];
            files.push(newFileName);
            localStorage.setItem('files', JSON.stringify(files));

            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');
            fileItem.innerText = newFileName;
            fileItemsContainer.appendChild(fileItem);
            document.getElementById('new-file-name').value = '';
        }
    });
}

// Function to handle file download
function downloadFile(fileName) {
    const fileContent = localStorage.getItem(fileName);
    if (!fileContent) {
        alert(`File ${fileName} not found.`);
        return;
    }

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
