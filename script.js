// Get all gif items
const gifItems = document.querySelectorAll('.gif-item');

// Add click event listener to each gif item
gifItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const text = this.querySelector('.gif-text');
        
        // Toggle between showing image and text
        if (img.style.display === 'none') {
            img.style.display = 'block';
            text.classList.add('hidden');
        } else {
            img.style.display = 'none';
            text.classList.remove('hidden');
        }
    });
});