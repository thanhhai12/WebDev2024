function filterMedia(type) {
    const mediaItems = document.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
        if (type === 'all') {
            item.style.display = 'block';
        } else {
            item.style.display = item.classList.contains(type) ? 'block' : 'none';
        }
    });
}

function handleFileUpload(event) {
    const files = event.target.files;
    const mediaContainer = document.getElementById('media-container');

    Array.from(files).forEach(file => {
        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            const imageItem = document.createElement('div');
            imageItem.className = 'media-item image';

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;

            imageItem.appendChild(img);
            mediaContainer.appendChild(imageItem);
        } else if (fileType.startsWith('video/')) {
            const videoItem = document.createElement('div');
            videoItem.className = 'media-item video';

            const video = document.createElement('video');
            video.controls = true;
            const source = document.createElement('source');
            source.src = URL.createObjectURL(file);
            source.type = fileType;

            video.appendChild(source);
            videoItem.appendChild(video);
            mediaContainer.appendChild(videoItem);
        }
    });
}
