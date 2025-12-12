// COMMUNITY VIDEOS ONLY - 13 clips
const VIDEOS = [
    {id:"v24",interviewee:"ena",topics:["politics","gardening","community"],duration:319,title:"More than 50 percent of gardening is politics",url:"https://drive.google.com/file/d/1RxSqcG7TPTD393iy6hepYhOyO4hbRIuU/preview"},
    {id:"v25",interviewee:"ena",topics:["politics","gardening","community","elders"],duration:48,title:"Most of the gardens are founded by Black and Brown women",url:"https://drive.google.com/file/d/1YII9Vr3sYiQmxU6otBkDuYsbGryB33uJ/preview"},
    {id:"v27",interviewee:"ena",topics:["climate","politics","community","gardening"],duration:29,title:"The resistance to climate change started in our gardens",url:"https://drive.google.com/file/d/1Ru1szv4gwxSbs3hVayUqjKZGrdx3TYVz/preview"},
    {id:"v28",interviewee:"ena",topics:["technique","politics","community"],duration:241,title:"We could build a whole movement around that",url:"https://drive.google.com/file/d/1pbwF49AolakJhFJ0edFlffoquEdrQmjg/preview"},
    {id:"v29",interviewee:"ena",topics:["community","gardening","food"],duration:52,title:"We have breakfast at the end of the season",url:"https://drive.google.com/file/d/1T7n8ceSLMFTh2PmWRk9vxApFRAJVHphD/preview"},
    {id:"v30",interviewee:"ena",topics:["food","community","compost"],duration:239,title:"You can tell how a person is feeding themselves by what they compost",url:"https://drive.google.com/file/d/1miMcLpkcBaUGjxksAMNK4F-WCse56O0P/preview"},
    {id:"v32",interviewee:"anamaria",topics:["Bronx","community"],duration:34,title:"I live and work in the South Bronx",url:"https://drive.google.com/file/d/18jzcfcajJaLja4LiIAqSfmyS9AMSKkYF/preview"},
    {id:"v33",interviewee:"anamaria",topics:["community","education","gardening","technique"],duration:173,title:"Centering the African Diaspora",url:"https://drive.google.com/file/d/1dzTVS8NAuARUp39HBUXyDFxJku-pvG-z/preview"},
    {id:"v36",interviewee:"anamaria",topics:["community","gardening"],duration:101,title:"I don't know how long New Roots has been in this neighborhood",url:"https://drive.google.com/file/d/13qaE4QwOpFTPfWAVJ81xKxFrVbQQzfnW/preview"},
    {id:"v40",interviewee:"qiana",topics:["community","education","food"],duration:134,title:"Connecting volunteers to gleaning opportunities",url:"https://drive.google.com/file/d/15HOgxU8Ec3HB_cOdVMud4RnwJNeyP5rC/preview"},
    {id:"v42",interviewee:"qiana",topics:["politics","community","grants"],duration:154,title:"We're here to protect and amplify their power even more",url:"https://drive.google.com/file/d/1wOOrnAgwydrYpJAk2IrNrClASn1ibPk5/preview"},
    {id:"v43",interviewee:"qiana",topics:["food","community","politics","personal"],duration:190,title:"Everybody deserves quality goods and services",url:"https://drive.google.com/file/d/1JaUQYqLkxKe55-LYFz59YHfly4R75Q7P/preview"},
    {id:"v44",interviewee:"qiana",topics:["youth","elders","community"],duration:227,title:"How to build a succession plan",url:"https://drive.google.com/file/d/1JlNg02EYNXqeE5shG9W0jwS0fCPAUcwo/preview"}
];

const THEME_GIF = {
    url: 'https://drive.google.com/thumbnail?id=1msLPOMbSM0BylRKduw86YBK_1oSjQeIE&sz=w350',
    text: ''
};

const STUDENT_GIF = {
    url: 'https://drive.google.com/thumbnail?id=1GkIWGAmN0pBmczPU5bpQWNNHMNAbxqO1&sz=w350',
    text: 'Abdoul Balde - The Snake'
};

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

// Render videos grouped by speaker
function renderVideos() {
    const container = document.getElementById('theme-content');
    
    // Group by interviewee
    const byInterviewee = {};
    VIDEOS.forEach(v => {
        if (!byInterviewee[v.interviewee]) {
            byInterviewee[v.interviewee] = [];
        }
        byInterviewee[v.interviewee].push(v);
    });
    
    // Sort each group by duration (shortest first)
    Object.values(byInterviewee).forEach(group => {
        group.sort((a, b) => a.duration - b.duration);
    });
    
    let html = '';
    let gifIndex = 0;
    
    Object.entries(byInterviewee).forEach(([interviewee, clips]) => {
        html += `
            <div class="speaker-section">
                <h3 class="speaker-name" style="color: ${INTERVIEWEE_COLORS[interviewee]}">${FORMAL_NAMES[interviewee] || interviewee}</h3>
                
                <div class="clips-grid">
                    ${clips.map(video => renderVideoTile(video)).join('')}
                </div>
            </div>
        `;
        
        // Add GIF after first speaker section
        if (gifIndex === 0) {
            html += `
                <div class="theme-gif" onclick="toggleGif(this)">
                    <img src="${THEME_GIF.url}" alt="Visual interpretation">
                    ${THEME_GIF.text ? `<div class="gif-text hidden">${THEME_GIF.text}</div>` : ''}
                </div>
            `;
        } else if (gifIndex === 1) {
            html += `
                <div class="theme-gif" onclick="toggleGif(this)">
                    <img src="${STUDENT_GIF.url}" alt="Student work">
                    <div class="gif-text hidden">${STUDENT_GIF.text}</div>
                </div>
            `;
        }
        gifIndex++;
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

function toggleGif(element) {
    const img = element.querySelector('img');
    const text = element.querySelector('.gif-text');
    
    if (text && text.classList.contains('hidden')) {
        img.classList.add('hidden');
        text.classList.remove('hidden');
    } else if (text) {
        text.classList.add('hidden');
        img.classList.remove('hidden');
    }
}

function openVideo(videoId) {
    const video = VIDEOS.find(v => v.id === videoId);
    if (!video) return;
    
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-video-content');
    const displayName = FORMAL_NAMES[video.interviewee] || video.interviewee;
    
    // Get related videos
    const relatedVideos = VIDEOS
        .filter(v => v.id !== video.id && v.topics.some(t => video.topics.includes(t)))
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
            <div class="modal-topics">${video.topics.join(' • ')}</div>
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

// Modal close handlers
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

// Initialize
renderVideos();
console.log('Community page loaded - 13 videos');