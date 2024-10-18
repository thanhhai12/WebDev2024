// Take data from local storage
function displayContentList() {
    let contents = JSON.parse(localStorage.getItem("contents") || []);
    const contentList = document.getElementById("contentList");

    // Delete old image before displaying new ones
    contentList.innerHTML = '';

    // Sort from new to old
    let sortedContents = [...contents]; // A replica of content for sorting
    sortedContents.sort((a, b) => new Date(b.saveTime) - new Date(a.saveTime));

    // Display each and every content
    sortedContents.forEach((content, displayIndex) => {
        // Save original index into element data-index
        const originalIndex = contents.findIndex(c => c.saveTime === content.saveTime);

        const contentItem = document.createElement('div');
        contentItem.className = 'content-item';
        contentItem.setAttribute('data-index', originalIndex); // Attach original index

        const contentTitle = document.createElement('div');
        contentTitle.className = 'content-title';
        const saveTime = new Date(content.saveTime);
        const formattedTime = saveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = saveTime.toLocaleDateString();
        contentTitle.innerHTML = `<strong>${content.title.toUpperCase()} - ${formattedTime} ${formattedDate}</strong>`;

        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.innerHTML = `
        <div class="dropdown">
          <button class="dropbtn">⋮</button>
          <div class="dropdown-content">
            <a href="#" onclick="editContent(${originalIndex})">Edit</a>
            <a href="#" onclick="deleteContent(${originalIndex})">Delete</a>
          </div>
        </div>`;

        const contentBody = document.createElement('div');
        contentBody.className = 'content-body';
        contentBody.innerText = content.content;

        if (content.image) {
            const imageElement = document.createElement('img');
            imageElement.src = content.image;
            imageElement.alt = 'Uploaded Image';
            imageElement.style.maxWidth = '100%';
            imageElement.style.borderRadius = '10px';
            imageElement.style.marginTop = '10px';
            contentBody.appendChild(imageElement);
        }

        contentItem.appendChild(contentTitle);
        contentItem.appendChild(toolbar);
        contentItem.appendChild(contentBody);
        contentList.appendChild(contentItem);
    });
}

let scrollPosition = 0; // Save scroll position

// Open editing popup
function editContent(originalIndex) {
    let contents = JSON.parse(localStorage.getItem("contents") || []);
    let content = contents[originalIndex]; // Take content from orignal index in local storage

    if (content) {
        // Memorize scroll position
        scrollPosition = window.pageYOffset;

        // Reset for popup for editing
        document.getElementById("title").value = content.title;
        document.getElementById("content").value = content.content;
        
        // Display popup and overlay
        document.getElementById("popup").classList.add('show');
        document.getElementById("overlay").classList.add('show');

        // Change event click to save
        document.querySelector(".save-btn").onclick = function () {
            content.title = document.getElementById("title").value;
            content.content = document.getElementById("content").value;
            content.saveTime = new Date().toISOString(); // Update save time
            contents[originalIndex] = content; // Update edited content
            localStorage.setItem("contents", JSON.stringify(contents)); // Save into local storage
            closePopup(); // close popup
            displayContentList(); // Display content menu
        };
    }
}

// Close pop up and scroll bar
function closePopup() {
    document.getElementById("popup").classList.remove('show');
    document.getElementById("overlay").classList.remove('show');

    // Restore original page
    document.body.classList.remove('fixed-position');
    window.scrollTo(0, scrollPosition); 
}


// Delete from local storage
function deleteContent(index) {
    // Confirmation message
    const confirmation = confirm("Are you sure to delete this post?");
    
    // If ok then delete
    if (confirmation) {
        let contents = JSON.parse(localStorage.getItem("contents") || []);

        // delete content in the specific index
        contents.splice(index, 1);
        
        // save content after deletion in local storage
        localStorage.setItem("contents", JSON.stringify(contents));

        // update list after deletion
        displayContentList();
        
        // Notify
        alert('Content has been deleted.');
    }
    // if cancel deletion, nothing happens
}

// Search function
function searchContent() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const contentItems = document.querySelectorAll('.content-item');

    contentItems.forEach(item => {
        const titleElement = item.querySelector('.content-title');
        const bodyElement = item.querySelector('.content-body');
        const images = bodyElement.querySelectorAll('img'); // Save images in body

        const originalTitle = titleElement.textContent; // Save original title
        const originalBody = bodyElement.textContent; // Save original content, excluding image

        const title = originalTitle.toLowerCase();
        const body = originalBody.toLowerCase();

        // Check for searchTerm
        if (title.includes(searchTerm) || body.includes(searchTerm)) {
            item.style.display = 'block'; // display content that match with the search

            // highlight searched term in title
            const highlightedTitle = originalTitle.replace(new RegExp(searchTerm, 'gi'), (match) => {
                return `<mark>${match}</mark>`;
            });
            titleElement.innerHTML = highlightedTitle;

            // highlight searched term in body
            const highlightedBody = originalBody.replace(new RegExp(searchTerm, 'gi'), (match) => {
                return `<mark>${match}</mark>`;
            });
            bodyElement.innerHTML = highlightedBody;

            // Add image back after adjustment
            images.forEach(img => {
                bodyElement.appendChild(img); 
            });

        } else {
            item.style.display = 'none'; 
        }
    });
}

// Redisplay contents after reload
document.addEventListener('DOMContentLoaded', displayContentList);
