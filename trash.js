document.addEventListener('DOMContentLoaded', function () {
    const trashList = document.getElementById('trashList').getElementsByTagName('tbody')[0];
    const trash = JSON.parse(localStorage.getItem('trash')) || [];

    if (trash.length === 0) {
        const emptyMessage = document.createElement('tr');
        emptyMessage.innerHTML = '<td colspan="3">Trash is empty.</td>';
        trashList.appendChild(emptyMessage);
        return;
    }

    trash.forEach((file, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${file.name}</td>
            <td>${new Date(file.time).toLocaleString()}</td>
            <td>
                <button onclick="restoreFile(${index})">Restore</button>
                <button onclick="deletePermanently(${index})">Delete Permanently</button>
            </td>
        `;
        trashList.appendChild(tr);
    });
});

// Restore a file from trash
function restoreFile(index) {
    let trash = JSON.parse(localStorage.getItem('trash')) || [];
    const file = trash.splice(index, 1)[0];

    // Restore the file to the main storage
    localStorage.setItem(file.name, file.content);
    localStorage.setItem(`${file.name}_time`, file.time);
    localStorage.setItem('trash', JSON.stringify(trash));

    alert(`File "${file.name}" restored.`);
    window.location.reload();
}

// Permanently delete a file from trash
function deletePermanently(index) {
    if (confirm('Are you sure you want to permanently delete this file?')) {
        let trash = JSON.parse(localStorage.getItem('trash')) || [];
        trash.splice(index, 1); // Remove the file from trash
        localStorage.setItem('trash', JSON.stringify(trash));

        alert('File deleted permanently.');
        window.location.reload();
    }
}
