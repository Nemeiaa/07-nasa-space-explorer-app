// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the "Get Space Images" button and gallery container
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA API key and endpoint
const API_KEY = 'hjB6sbeurEsPkPW8EANHmuTTgOORZNqU3MtkPrTQ';
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Find the loading overlay
const loadingOverlay = document.getElementById('loadingOverlay');

// Function to fetch and display images
getImagesButton.addEventListener('click', async () => {
  // Show the loading overlay
  loadingOverlay.style.display = 'flex';

  // Clear the gallery
  gallery.innerHTML = '';

  // Get the selected date range
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Fetch data from NASA API
  try {
    const response = await fetch(`${NASA_API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`);
    const data = await response.json();

    // Limit to 9 images
    const images = data.slice(0, 9);

    // Create gallery items
    images.forEach(image => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      // Add image, title, date, and store description in a data attribute
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <p>${image.title}</p>
        <p><small>Date: ${image.date}</small></p>
      `;
      item.dataset.description = image.explanation; // Store the description

      gallery.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    gallery.innerHTML = '<p>Failed to load images. Please try again later.</p>';
  } finally {
    // Hide the loading overlay
    loadingOverlay.style.display = 'none';
  }
});

// Find the modal elements
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');

// Function to open the modal
function openModal(image, title, date, description) {
  modalImage.src = image;
  modalTitle.textContent = title;
  modalDate.textContent = `Date: ${date}`;
  modalDescription.textContent = description;
  imageModal.style.display = 'flex';
}

// Function to close the modal
function closeModalHandler(event) {
  // Close the modal if the user clicks outside the modal content
  if (event.target === imageModal) {
    imageModal.style.display = 'none';
  }
}

// Add event listener to close the modal when clicking outside of it
imageModal.addEventListener('click', closeModalHandler);

// Update the close button functionality
closeModal.addEventListener('click', () => {
  imageModal.style.display = 'none';
});

// Add click event to gallery items
gallery.addEventListener('click', (event) => {
  const item = event.target.closest('.gallery-item');
  if (item) {
    const image = item.querySelector('img').src;
    const title = item.querySelector('p').textContent;
    const date = item.querySelector('small').textContent.replace('Date: ', '');
    const description = item.dataset.description; // Retrieve the description
    openModal(image, title, date, description);
  }
});
