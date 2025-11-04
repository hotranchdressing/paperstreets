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

// Initialize with random prompt
generateNewPrompt();

// Generate a random prompt
function generateNewPrompt() {
  const categories = ['growing', 'composting'];
  currentCategory = categories[Math.floor(Math.random() * categories.length)];
  const categoryPrompts = prompts[currentCategory];
  currentPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
  
  currentPromptEl.textContent = currentPrompt;
  promptCategoryEl.textContent = currentCategory === 'growing' ? 'GROWING' : 'COMPOSTING';
  promptCategoryEl.style.color = currentCategory === 'growing' ? '#34a853' : '#8B4513';
}

// Event listeners
newPromptBtn.addEventListener("click", generateNewPrompt);
submitBtn.addEventListener("click", handleSubmit);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const text = userInput.value.trim();
  if (!text) {
    alert('Please enter your thoughts before planting!');
    return;
  }

  // Create floating response
  createFloatingResponse(text, currentCategory);

  // Create plant or compost icon
  createVisualElement(currentCategory);

  // Update counts
  updateStats(currentCategory);

  // Log recent submission
  addRecentSubmission(text, currentCategory);

  // Clear input and generate new prompt
  userInput.value = "";
  userInput.placeholder = 'Thank you for sharing! Add another...';
  setTimeout(() => {
    userInput.placeholder = 'Share your thoughts...';
  }, 3000);
  
  generateNewPrompt();
}

// Create floating text bubbles
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

  // Remove after 15 seconds
  setTimeout(() => bubble.remove(), 15000);
}

// Create visual "growth" in soil or compost bin
function createVisualElement(category) {
  const zone = category === "growing" ? growingPlants : compostingPlants;
  const el = document.createElement("div");
  el.classList.add("plant");

  // Use your PNGs instead of emojis
  if (category === "growing") {
    const plantImages = [
      "images/beebalm3.png",
      "images/dogwood3.png",
      "images/lilac3.png",
      "images/milkweed3.png"
    ];
    el.style.backgroundImage = `url('${plantImages[Math.floor(Math.random() * plantImages.length)]}')`;
  } else {
    const compostImages = [
      "images/beebalm3.png",
      "images/dogwood3.png",
      "images/lilac3.png",
      "images/milkweed3.png"
    ];
    el.style.backgroundImage = `url('${compostImages[Math.floor(Math.random() * compostImages.length)]}')`;
  }

  // Random position
  const width = zone.offsetWidth;
  const height = zone.offsetHeight;
  const x = Math.random() * (width - 60);
  const y = Math.random() * (height - 80);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  zone.appendChild(el);

  // Fade out gently after 8 seconds
  setTimeout(() => {
    el.style.transition = "opacity 2s";
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 2000);
  }, 8000);
}

// Stats and logs
let growCount = 0;
let compostCount = 0;

function updateStats(category) {
  if (category === "growing") growCount++;
  else compostCount++;

  growingCount.textContent = growCount;
  compostingCount.textContent = compostCount;
  totalCount.textContent = growCount + compostCount;
}

function addRecentSubmission(text, category) {
  const item = document.createElement("div");
  item.classList.add("recent-item");
  if (category === "composting") item.classList.add("composting");

  item.innerHTML = `
    <div class="recent-item-text">${text}</div>
    <div class="recent-item-meta">${category}</div>
  `;

  recentList.prepend(item);

  // Keep the list to 10 entries
  const items = recentList.querySelectorAll(".recent-item");
  if (items.length > 10) items[items.length - 1].remove();
}