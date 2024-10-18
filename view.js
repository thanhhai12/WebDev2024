document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('file');
    const fileContent = localStorage.getItem(fileName);

    if (fileContent) {
        document.getElementById('fileContent').textContent = fileContent;
    }
});

function goBack() {
    window.location.href = 'document.html'; 
}

function saveXlsxToLocalStorage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const binaryData = e.target.result;
        const base64Data = btoa(binaryData); // Encode to Base64
        localStorage.setItem(file.name, base64Data);
    };
    reader.readAsBinaryString(file); // Read as binary
}

