// PERSONAL STORIES VIDEOS - 10 clips
const VIDEOS = [
    {id:"v4",interviewee:"kwesi",duration:55,title:"I Started Gardening Because I Was Stressed",url:"https://drive.google.com/file/d/1Y1ZxawbB6i4-xengELFVK6Tke3ZB3Mmf/preview"},
    {id:"v8",interviewee:"kwesi",duration:21,title:"My name is Kwesi Joseph",url:"https://drive.google.com/file/d/1BMIpihlxFaNaaxSWXHIpPPsSm-DVWaDV/preview"},
    {id:"v18",interviewee:"ena",duration:64,title:"I decided I wanted to live in a more Afrocentric neighborhood",url:"https://drive.google.com/file/d/1PqjDDDQZsmgXvo7epuQqs-iZsOntieQ6/preview"},
    {id:"v20",interviewee:"ena",duration:46,title:"I think I have a couple more gardens in me",url:"https://drive.google.com/file/d/1O6UTvnjxCZzlPtPxxn-2LBOdH_7pbxRG/preview"},
    {id:"v21",interviewee:"ena",duration:81,title:"I was depressed for one day",url:"https://drive.google.com/file/d/1SchMzHbL9fPpebXNi0nLJ6GXXjsYrwae/preview"},
    {id:"v22",interviewee:"ena",duration:57,title:"I was young and gorgeous",url:"https://drive.google.com/file/d/1z0Rqp1fuxyL7HJY4c25k5Jde1TAO4cZD/preview"},
    {id:"v26",interviewee:"ena",duration:53,title:"My name is Ena K. McPherson",url:"https://drive.google.com/file/d/1IlMVV47bEawPHTeGp4nTTUPCSmQkDJ_1/preview"},
    {id:"v34",interviewee:"anamaria",duration:26,title:"My name is Dr. Anamaría Flores",url:"https://drive.google.com/file/d/1nG-03txGflm2zwjiDvN14bnzkRS3zp0n/preview"},
    {id:"v41",interviewee:"qiana",duration:32,title:"My name is Qiana Mickie",url:"https://drive.google.com/file/d/1C1_faJQDbAWsASXIj3j-ULQf_tsednD4/preview"},
    {id:"v43",interviewee:"qiana",duration:190,title:"Everybody deserves quality goods and services",url:"https://drive.google.com/file/d/1JaUQYqLkxKe55-LYFz59YHfly4R75Q7P/preview"}
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
console.log('Personal Stories page loaded - 10 videos');