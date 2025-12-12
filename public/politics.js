// POLITICS VIDEOS - 8 clips
const VIDEOS = [
    {id:"v23",interviewee:"ena",duration:42,title:"It's not a privilege to have access to good food",url:"https://drive.google.com/file/d/1idSGVzVLNgf3nLE3gWxMPPQZ2V_HWswx/preview"},
    {id:"v24",interviewee:"ena",duration:319,title:"More than 50 percent of gardening is politics",url:"https://drive.google.com/file/d/1RxSqcG7TPTD393iy6hepYhOyO4hbRIuU/preview"},
    {id:"v25",interviewee:"ena",duration:48,title:"Most of the gardens are founded by Black and Brown women",url:"https://drive.google.com/file/d/1YII9Vr3sYiQmxU6otBkDuYsbGryB33uJ/preview"},
    {id:"v27",interviewee:"ena",duration:29,title:"The resistance to climate change started in our gardens",url:"https://drive.google.com/file/d/1Ru1szv4gwxSbs3hVayUqjKZGrdx3TYVz/preview"},
    {id:"v28",interviewee:"ena",duration:241,title:"We could build a whole movement around that",url:"https://drive.google.com/file/d/1pbwF49AolakJhFJ0edFlffoquEdrQmjg/preview"},
    {id:"v42",interviewee:"qiana",duration:154,title:"We're here to protect and amplify their power even more",url:"https://drive.google.com/file/d/1wOOrnAgwydrYpJAk2IrNrClASn1ibPk5/preview"},
    {id:"v43",interviewee:"qiana",duration:190,title:"Everybody deserves quality goods and services",url:"https://drive.google.com/file/d/1JaUQYqLkxKe55-LYFz59YHfly4R75Q7P/preview"},
    {id:"v45",interviewee:"qiana",duration:295,title:"How do we find a common thread",url:"https://drive.google.com/file/d/1JvtyxN1Ou8ChIoCuKiV_1fYrL-aEPxEu/preview"}
];

const FORMAL_NAMES = {
    'qiana': 'Qiana Mickie',
    'anamaria': 'Dr. Anamaría Flores',
    'ena': 'Ms. Ena K. McPherson',
    'kwesi': 'Kwesi Joseph, MBA'
};

const INTERVIEWEE_COLORS = {
    'qiana': '#a8b8c5',
    'anamaria': '#c9b5b8',
    'ena': '#b8c5b0',
    'kwesi': '#d4c5a9'
};

function renderVideos() {
    const container = document.getElementById('theme-content');
    
    const byInterviewee = {};
    VIDEOS.forEach(v => {
        if (!byInterviewee[v.interviewee]) {
            byInterviewee[v.interviewee] = [];
        }
        byInterviewee[v.interviewee].push(v);
    });
    
    Object.values(byInterviewee).forEach(group => {
        group.sort((a, b) => a.duration - b.duration);
    });
    
    let html = '';
    
    Object.entries(byInterviewee).forEach(([interviewee, clips]) => {
        html += `
            <div class="speaker-section">
                <h3 class="speaker-name" style="color: ${INTERVIEWEE_COLORS[interviewee]}">${FORMAL_NAMES[interviewee] || interviewee}</h3>
                
                <div class="clips-grid">
                    ${clips.map(video => renderVideoTile(video)).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    console.log('Rendered ' + VIDEOS.length + ' video tiles');
}

function renderVideoTile(video) {
    const maxDuration = 319;
    const minDuration = 13;
    const normalizedDuration = (video.duration - minDuration) / (maxDuration - minDuration);
    const size = 120 + (1 - normalizedDuration) * 100;
    
    return `
        <div class="video-tile" 
             onclick="openVideo('${video.id}')"
             style="width: ${size}px; height: ${size}px; background-color: ${INTERVIEWEE_COLORS[video.interviewee]}">
            <div class="tile-content">
                <div class="tile-title">${video.title}</div>
                <div class="tile-duration">${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}</div>
            </div>
        </div>
    `;
}

function openVideo(videoId) {
    const video = VIDEOS.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-video-content');
    const displayName = FORMAL_NAMES[video.interviewee] || video.interviewee;
    
    const relatedVideos = VIDEOS
        .filter(v => v.id !== video.id && v.interviewee === video.interviewee)
        .slice(0, 3);
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${video.title}</h2>
            <button class="close-modal" onclick="closeVideoModal()">×</button>
        </div>
        
        <iframe 
            src="${video.url}" 
            width="100%" 
            height="480"
            allow="autoplay"
            style="border: none; background: #000;">
        </iframe>
        
        <div class="modal-meta">
            <div><strong>${displayName}</strong></div>
        </div>
        
        ${relatedVideos.length > 0 ? `
            <div class="related-clips">
                <h4>Related clips</h4>
                <div class="related-grid">
                    ${relatedVideos.map(v => `
                        <div class="related-clip" onclick="openVideo('${v.id}')">
                            <div class="related-title">${v.title}</div>
                            <div class="related-speaker">${FORMAL_NAMES[v.interviewee]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('visible');
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('visible');
    
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        iframe.src = iframe.src;
    }
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('video-modal');
    if (e.target === modal) {
        closeVideoModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

renderVideos();
console.log('Politics page loaded - 8 videos');