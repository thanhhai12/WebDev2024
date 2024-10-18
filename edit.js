document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file');
    if (!fileName) {
        alert('No file name provided in the URL.');
        return;
    }
    document.getElementById('fileTitle').textContent = fileName;
    const fileContent = localStorage.getItem(fileName);
    if (!fileContent) {
        alert('File not found in localStorage.');
        document.getElementById('fileContent').textContent = 'File not found.';
    } else {
        document.getElementById('fileContent').innerText = fileContent;
    }
});

function saveChanges() {
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file');
    const newContent = document.getElementById('fileContent').innerText;

    if (!fileName) {
        alert('No file name provided. Cannot save.');
        return;
    }

    const saveOption = confirm("Do you want to overwrite the existing file? Click OK to overwrite, or Cancel to save as a new file.");

    if (saveOption) {
        localStorage.setItem(fileName, newContent);
        localStorage.setItem(`${fileName}_time`, new Date().toString()); // Update upload time
        alert("File has been overwritten successfully!");
    } else {
        const newFileName = `${fileName} (edited)`;
        localStorage.setItem(newFileName, newContent);
        localStorage.setItem(`${newFileName}_time`, new Date().toString()); 
        alert("File has been saved as a new file successfully!");
    }

    window.location.href = 'document.html';
}

function Cancel() {
    const CancelOption = confirm("You didn't save this edit, are you sure?");
    if (CancelOption) {
        window.location.href = 'document.html';
    }
}
