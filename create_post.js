function openPopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");

    popup.style.display = "block"; // Show the popup
    overlay.style.display = "block"; // Show the overlay

    setTimeout(() => {
        popup.classList.add("show"); // Add the show class to trigger the transition
    }, 10);
}

// Popup
function closePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");

    popup.classList.remove("show");

    setTimeout(() => {
        popup.style.display = "none";
        overlay.style.display = "none";
    }, 300);
}
// Display file name when uploaded
document.getElementById('uploadImage').addEventListener('change', function () {
    let imageFile = this.files[0]; 
    if (imageFile) {
        document.getElementById('imageFileName').textContent = `Selected Image: ${imageFile.name}`;
    }
});

document.getElementById('uploadVideo').addEventListener('change', function () {
    let videoFile = this.files[0]; 
    if (videoFile) {
        document.getElementById('videoFileName').textContent = `Selected Video: ${videoFile.name}`; 
    }
});

// Save data into local storage
function saveContent() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let imageFile = document.getElementById("uploadImage").files[0];

    if (title && content) {
        let contents = JSON.parse(localStorage.getItem("contents") || "[]");
        let contentData = {
            title: title,
            content: content,
            saveTime: new Date().toISOString() // Created time
        };

        // Save image under Base64 if avaliable 
        if (imageFile) {
            let reader = new FileReader();
            reader.onload = function(e) {
                contentData.image = e.target.result; // Save image's Base64
                contents.push(contentData);
                localStorage.setItem("contents", JSON.stringify(contents)); // Save image into local storage
                closePopup();
                window.location.href = "index.html"; // refresh page after saving
            };
            reader.readAsDataURL(imageFile);
        } else {
            contents.push(contentData);
            localStorage.setItem("contents", JSON.stringify(contents)); // Local storage again
            closePopup();
            window.location.href = "index.html"; // Refresh again
        }
    } else {
        alert("Please fill in all fields");
    }
}

// Close popup
function cancelPopup() {
    const confirmation = confirm("You have not saved yet. If you agree to cancel, your post will not be saved.");
    if (confirmation) {
        document.getElementById("title").value = ""; 
        document.getElementById("content").value = ""; 
        document.getElementById("uploadImage").value = ""; 
        document.getElementById('imageFileName').textContent = ""; 

        closePopup();
    }
}


// Close popup if click out of bound
document.getElementById("overlay").addEventListener("click", function() {
    cancelPopup(); 
});

// Cancel button
document.querySelector(".cancel-btn").addEventListener("click", function() {
    cancelPopup(); 
});
