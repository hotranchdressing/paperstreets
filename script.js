// Prompts for each category
const prompts = {
  growing: [
    "What dream are you planting for your community?",
    "What skill or knowledge do you want to cultivate?",
    "What positive change do you envision for the neighborhood?",
    "What connections do you want to nurture?",
    "What tradition or practice do you want to keep alive?",
    "What new possibility excites you?",
    "What strength in yourself or community do you want to develop?",
    "What abundance do you imagine for the future?",
    "What seeds of change are you ready to plant?"
  ],
  composting: [
    "What fear or doubt are you ready to release?",
    "What habit no longer serves you?",
    "What limiting belief can you let go of?",
    "What past disappointment are you ready to compost?",
    "What negative pattern are you breaking?",
    "What old story about yourself can you transform?",
    "What grudge or resentment are you releasing?",
    "What barrier are you ready to break down?",
    "What self-judgment can you compost into wisdom?",
    "What are you making peace with and letting go?"
  ]
};

let currentCategory = null;
let currentPrompt = null;

// Element references
const currentPromptEl = document.getElementById("current-prompt");
const promptCategoryEl = document.getElementById("prompt-category");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const newPromptBtn = document.getElementById("new-prompt-btn");

const growingResponses = document.getElementById("growing-responses");
const compostingResponses = document.getElementById("composting-responses");

const growingPlants = document.getElementById("growing-plants");
const compostingPlants = document.getElementById("composting-plants");

const growingCount = document.getElementById("growing-count");
const compostingCount = document.getElementById("composting-count");
const totalCount = document.getElementById("total-count");

const recentList = document.getElementById("recent-list");

// Stats counters
let growCount = 0;
let compostCount = 0;

// --- PROMPT LOGIC ---
function generateNewPrompt() {
  const categories = ["growing", "composting"];
  currentCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryPrompts = prompts[currentCategory];
  currentPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];

  currentPromptEl.textContent = currentPrompt;
  promptCategoryEl.textContent = currentCategory.toUpperCase();
  promptCategoryEl.style.color = currentCategory === "growing" ? "#34a853" : "#8B4513";
}

// Initialize first prompt
generateNewPrompt();
newPromptBtn.addEventListener("click", generateNewPrompt);

// --- SUBMIT HANDLER ---
submitBtn.addEventListener("click", handleSubmit);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSubmit();
});

async function handleSubmit() {
  const text = userInput.value.trim();
  if (!text) {
    alert("Please enter your thoughts before planting!");
    return;
  }

  // Send response to server - CHANGED URL HERE
  try {
    const res = await fetch("/api/responses", {  // ← CHANGED FROM "/submit-response"
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: currentCategory, text })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // Update visuals & UI
    createFloatingResponse(text, currentCategory);
    createVisualElement(currentCategory);
    updateStats(data.responses);
    renderRecent(data.responses);

    // Clear input and refresh prompt
    userInput.value = "";
    userInput.placeholder = "Thank you for sharing! Add another...";
    setTimeout(() => userInput.placeholder = "Share your thoughts...", 3000);
    generateNewPrompt();
  } catch (err) {
    console.error("Error posting response:", err);
    alert("Failed to submit. Please try again!");
  }
}

// --- FLOATING RESPONSE BUBBLES ---
function createFloatingResponse(text, category) {
  const zone = category === "growing" ? growingResponses : compostingResponses;
  const bubble = document.createElement("div");
  bubble.classList.add("floating-text");
  if (category === "composting") bubble.classList.add("composting");
  bubble.textContent = text;

  const areaWidth = zone.offsetWidth;
  const areaHeight = zone.offsetHeight;
  const x = Math.random() * (areaWidth - 200);
  const y = Math.random() * (areaHeight - 80);
  bubble.style.left = `${Math.max(0, x)}px`;
  bubble.style.top = `${Math.max(0, y)}px`;

  zone.appendChild(bubble);
  setTimeout(() => bubble.remove(), 15000);
}

// --- VISUAL PLANT/COMPOST ELEMENTS ---
function createVisualElement(category) {
  const zone = category === "growing" ? growingPlants : compostingPlants;
  const el = document.createElement("div");
  el.classList.add("plant");

  // Use your PNGs instead of emojis
  const plantImages = [
    "images/beebalm3.png",
    "images/dogwood3.png",
    "images/lilac3.png",
    "images/milkweed3.png"
  ];
  const compostImages = [
    "images/beebalm3.png",
    "images/dogwood3.png",
    "images/lilac3.png",
    "images/milkweed3.png"
  ];

  el.style.backgroundImage = `url('${category === "growing" ? plantImages[Math.floor(Math.random() * plantImages.length)] : compostImages[Math.floor(Math.random() * compostImages.length)]}')`;

  // Random position
  const x = Math.random() * (zone.offsetWidth - 60);
  const y = Math.random() * (zone.offsetHeight - 80);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  zone.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 2s";
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 2000);
  }, 8000);
}

// --- STATS AND LEADERBOARD ---
function updateStats(responses) {
  growCount = responses.filter(r => r.category === "growing").length;
  compostCount = responses.filter(r => r.category === "composting").length;

  growingCount.textContent = growCount;
  compostingCount.textContent = compostCount;
  totalCount.textContent = growCount + compostCount;
}

function renderRecent(responses) {
  recentList.innerHTML = "";
  responses.slice(-10).reverse().forEach(r => {
    const item = document.createElement("div");
    item.classList.add("recent-item");
    if (r.category === "composting") item.classList.add("composting");

    item.innerHTML = `
      <div class="recent-item-text">${r.text}</div>
      <div class="recent-item-meta">${r.category}</div>
    `;
    recentList.appendChild(item);
  });
}

// Auto-refresh responses every 5 seconds
async function fetchLatestResponses() {
  try {
    const res = await fetch("/api/responses");
    const data = await res.json();
    
    if (data.responses) {
      updateStats(data.responses);
      renderRecent(data.responses);
    }
  } catch (err) {
    console.error("Error fetching responses:", err);
  }
}

// Fetch on page load
fetchLatestResponses();

// Then fetch every 5 seconds
setInterval(fetchLatestResponses, 5000);

// Track which responses we've already shown visually
let visualizedResponseIds = new Set();

// Modified fetchLatestResponses function
async function fetchLatestResponses() {
  try {
    const res = await fetch("/api/responses");
    const data = await res.json();
    
    if (data.responses) {
      updateStats(data.responses);
      renderRecent(data.responses);
      
      // NEW: Show visual elements for new responses
      visualizeNewResponses(data.responses);
    }
  } catch (err) {
    console.error("Error fetching responses:", err);
  }
}

// NEW FUNCTION: Create visual elements for responses we haven't shown yet
function visualizeNewResponses(responses) {
  responses.forEach((response, index) => {
    // Use index as a simple ID (or response.id if your DB returns it)
    const responseId = response.id || `${response.timestamp}-${response.text.substring(0, 10)}`;
    
    // Skip if we've already visualized this one
    if (visualizedResponseIds.has(responseId)) {
      return;
    }
    
    // Mark as visualized
    visualizedResponseIds.add(responseId);
    
    // Create the visual element
    createVisualElement(response.category);
    
    // Optionally also create floating text bubble
    createFloatingResponse(response.text, response.category);
  });
}

// Fetch on page load
fetchLatestResponses();

// Then fetch every 5 seconds
setInterval(fetchLatestResponses, 5000);

// Inside visualizeNewResponses, replace the createVisualElement line with:
setTimeout(() => {
  createVisualElement(response.category);
  createFloatingResponse(response.text, response.category);
}, Math.random() * 2000); // Random delay 0-2 seconds