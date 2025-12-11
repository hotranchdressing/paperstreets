// Configuration - Replace with your actual content
const VIDEOS = [
    { 
        id: 'v1', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
        title: 'Segment One' 
    },
    { 
        id: 'v2', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
        title: 'Segment Two' 
    }
];

const GIFS = [
    { 
        id: 'g1', 
        gifUrl: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', 
        text: 'This is the hidden text behind the first visual element. Click to reveal the underlying meaning.' 
    },
    { 
        id: 'g2', 
        gifUrl: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', 
        text: 'Another layer of information revealed through interaction. The gesture of clicking transforms image to language.' 
    }
];

// Backend API URL - uses relative path for Vercel deployment
// For local development, run backend separately and use: http://localhost:3001/api
const API_URL = '/api';

// State management
let annotations = {};
let responses = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderContent();
});

// Load data from backend
async function loadData() {
    try {
        const [annotationsRes, responsesRes] = await Promise.all([
            fetch(`${API_URL}/annotations`),
            fetch(`${API_URL}/responses`)
        ]);

        if (annotationsRes.ok) {
            annotations = await annotationsRes.json();
        }

        if (responsesRes.ok) {
            responses = await responsesRes.json();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render all content
function renderContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    // Render videos
    VIDEOS.forEach(video => {
        const videoSection = createVideoSection(video);
        content.appendChild(videoSection);
    });

    // Render GIFs
    GIFS.forEach(gif => {
        const gifSection = createGifSection(gif);
        content.appendChild(gifSection);
    });
}

// Create video section
function createVideoSection(video) {
    const section = document.createElement('div');
    section.className = 'video-section';
    section.innerHTML = `
        <div class="video-wrapper">
            <video id="${video.id}" src="${video.url}"></video>
            
            <div class="timeline">
                <div class="timeline-progress" id="${video.id}-progress"></div>
                <div id="${video.id}-markers"></div>
            </div>

            <div class="annotation-display" id="${video.id}-annotation-display"></div>

            <div class="annotation-input" id="${video.id}-annotation-input">
                <textarea 
                    id="${video.id}-annotation-text" 
                    placeholder="Note this moment..." 
                    maxlength="280"
                ></textarea>
                <div class="annotation-controls">
                    <span class="char-count" id="${video.id}-char-count">0/280</span>
                    <div class="button-group">
                        <button class="btn-secondary" onclick="cancelAnnotation('${video.id}')">Cancel</button>
                        <button class="btn-primary" id="${video.id}-submit-annotation">Add Note</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="response-section">
            <div class="response-divider">
                <div class="response-list" id="${video.id}-responses"></div>
                
                <div class="response-input">
                    <textarea 
                        id="${video.id}-response-text" 
                        placeholder="Add to the conversation..."
                    ></textarea>
                    <button class="btn-primary" id="${video.id}-submit-response">Continue Chain</button>
                </div>
            </div>
        </div>
    `;

    // Set up video event listeners
    setTimeout(() => {
        setupVideoPlayer(video.id);
        renderAnnotationMarkers(video.id);
        renderResponses(video.id);
    }, 0);

    return section;
}

// Set up video player functionality
function setupVideoPlayer(videoId) {
    const videoElement = document.getElementById(videoId);
    const progressBar = document.getElementById(`${videoId}-progress`);
    const annotationInput = document.getElementById(`${videoId}-annotation-input`);
    const annotationTextarea = document.getElementById(`${videoId}-annotation-text`);
    const charCount = document.getElementById(`${videoId}-char-count`);
    const submitBtn = document.getElementById(`${videoId}-submit-annotation`);
    const responseTextarea = document.getElementById(`${videoId}-response-text`);
    const submitResponseBtn = document.getElementById(`${videoId}-submit-response`);

    // Update progress bar
    videoElement.addEventListener('timeupdate', () => {
        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // Click video to add annotation
    videoElement.addEventListener('click', (e) => {
        const rect = videoElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickTime = (clickX / rect.width) * videoElement.duration;
        
        videoElement.pause();
        videoElement.currentTime = clickTime;
        
        annotationInput.classList.add('visible');
        annotationInput.dataset.timestamp = clickTime;
        annotationTextarea.focus();
    });

    // Character count
    annotationTextarea.addEventListener('input', () => {
        charCount.textContent = `${annotationTextarea.value.length}/280`;
    });

    // Submit annotation
    submitBtn.addEventListener('click', async () => {
        const text = annotationTextarea.value.trim();
        if (!text) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Checking...';

        const isSafe = await moderateContent(text);
        
        if (isSafe) {
            const timestamp = parseFloat(annotationInput.dataset.timestamp);
            await addAnnotation(videoId, timestamp, text);
            annotationTextarea.value = '';
            charCount.textContent = '0/280';
            annotationInput.classList.remove('visible');
            renderAnnotationMarkers(videoId);
        } else {
            alert('Your message was flagged for inappropriate content. Please revise.');
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Note';
    });

    // Submit response
    submitResponseBtn.addEventListener('click', async () => {
        const text = responseTextarea.value.trim();
        if (!text) return;

        submitResponseBtn.disabled = true;
        submitResponseBtn.textContent = 'Checking...';

        const isSafe = await moderateContent(text);
        
        if (isSafe) {
            await addResponse(videoId, text);
            responseTextarea.value = '';
            renderResponses(videoId);
        } else {
            alert('Your message was flagged for inappropriate content. Please revise.');
        }

        submitResponseBtn.disabled = false;
        submitResponseBtn.textContent = 'Continue Chain';
    });
}

// Cancel annotation input
function cancelAnnotation(videoId) {
    const annotationInput = document.getElementById(`${videoId}-annotation-input`);
    const annotationTextarea = document.getElementById(`${videoId}-annotation-text`);
    const charCount = document.getElementById(`${videoId}-char-count`);
    
    annotationInput.classList.remove('visible');
    annotationTextarea.value = '';
    charCount.textContent = '0/280';
}

// Render annotation markers on timeline
function renderAnnotationMarkers(videoId) {
    const markersContainer = document.getElementById(`${videoId}-markers`);
    const videoElement = document.getElementById(videoId);
    const videoAnnotations = annotations[videoId] || [];

    markersContainer.innerHTML = '';

    videoAnnotations.forEach(annotation => {
        const marker = document.createElement('div');
        marker.className = 'annotation-marker';
        marker.style.left = `${(annotation.timestamp / videoElement.duration) * 100}%`;
        
        marker.addEventListener('mouseenter', () => showAnnotation(videoId, annotation));
        marker.addEventListener('mouseleave', () => hideAnnotation(videoId));
        
        markersContainer.appendChild(marker);
    });
}

// Show annotation on hover
function showAnnotation(videoId, annotation) {
    const display = document.getElementById(`${videoId}-annotation-display`);
    display.textContent = annotation.text;
    display.classList.add('visible');
}

// Hide annotation
function hideAnnotation(videoId) {
    const display = document.getElementById(`${videoId}-annotation-display`);
    display.classList.remove('visible');
}

// Render response chain
function renderResponses(videoId) {
    const responsesList = document.getElementById(`${videoId}-responses`);
    const videoResponses = responses[videoId] || [];

    responsesList.innerHTML = '';

    videoResponses.forEach(response => {
        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.innerHTML = `
            <div class="response-timestamp">${new Date(response.timestamp).toLocaleString()}</div>
            <div class="response-text">${escapeHtml(response.text)}</div>
        `;
        responsesList.appendChild(responseItem);
    });
}

// Add annotation
async function addAnnotation(videoId, timestamp, text) {
    const newAnnotation = { 
        timestamp, 
        text, 
        created: new Date().toISOString() 
    };

    // Optimistic update
    if (!annotations[videoId]) {
        annotations[videoId] = [];
    }
    annotations[videoId].push(newAnnotation);

    // Save to backend
    try {
        await fetch(`${API_URL}/annotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId, timestamp, text })
        });
    } catch (error) {
        console.error('Error saving annotation:', error);
    }
}

// Add response
async function addResponse(videoId, text) {
    const newResponse = { 
        text, 
        timestamp: new Date().toISOString() 
    };

    // Optimistic update
    if (!responses[videoId]) {
        responses[videoId] = [];
    }
    responses[videoId].push(newResponse);

    // Save to backend
    try {
        await fetch(`${API_URL}/responses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId, text })
        });
    } catch (error) {
        console.error('Error saving response:', error);
    }
}

// Content moderation using backend filter
async function moderateContent(text) {
    try {
        const response = await fetch(`${API_URL}/moderate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        return data.safe;
    } catch (error) {
        console.error('Moderation error:', error);
        return true; // Allow on error to avoid blocking legitimate content
    }
}

// Create GIF toggle section
function createGifSection(gif) {
    const section = document.createElement('div');
    section.className = 'gif-section';
    section.dataset.showing = 'gif';
    
    section.innerHTML = `
        <img src="${gif.gifUrl}" alt="Click to reveal text" class="gif-image">
        <div class="gif-text hidden">${escapeHtml(gif.text)}</div>
    `;

    section.addEventListener('click', () => {
        const img = section.querySelector('.gif-image');
        const text = section.querySelector('.gif-text');
        
        if (section.dataset.showing === 'gif') {
            img.classList.add('hidden');
            text.classList.remove('hidden');
            section.dataset.showing = 'text';
        } else {
            text.classList.add('hidden');
            img.classList.remove('hidden');
            section.dataset.showing = 'gif';
        }
    });

    return section;
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}