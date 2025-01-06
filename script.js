document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Open the modal with specific content and title
function openModal(contentId, title) {
    // Show the modal
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    modal.scrollTop = 0;

    // Disable scrolling on the body
    document.body.style.overflow = 'hidden'; // Disables scrolling on the body

    // Disable focus on background elements
    document.body.classList.add('body-no-focus');

    // Set the modal title dynamically
    const modalTitle = document.querySelector('.modalTitle');
    modalTitle.textContent = title; // Change the title to the passed argument

    // Hide all content inside the modal and show the selected content
    const allModalContent = document.querySelectorAll('.modalText');
    allModalContent.forEach((content) => (content.style.display = 'none'));
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }

    modal.focus(); // This ensures focus remains inside the modal

    // Store the modal state in localStorage
    localStorage.setItem('modalState', JSON.stringify({ contentId, title }));
}

function stopClickPropagation(event) {
    event.stopPropagation(); // Prevent the click from bubbling up to the .card div
}


function copyCode(button) {
    const codeBlock = button.previousElementSibling; // Get the code block
    const codeText = codeBlock.textContent; // Extract the code text

    if (navigator.clipboard && navigator.clipboard.writeText) {
        // Modern way to copy using Clipboard API
        navigator.clipboard.writeText(codeText)
            .then(() => {
                // Feedback for successful copy
                button.innerHTML = '<i class=\"fa-solid fa-check\"></i> Copied!';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
                }, 5000);
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
                alert("Failed to copy text. Please try again.");
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = codeText;
        textArea.style.position = "fixed"; // Avoid scrolling
        textArea.style.opacity = "0"; // Make invisible
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            button.innerHTML = '<i class=\"fa-solid fa-check\"></i> Copied!';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
            }, 2000);
        } catch (err) {
            console.error("Fallback: Unable to copy", err);
            alert("Failed to copy text. Please try again.");
        }
        document.body.removeChild(textArea);
    }
}

function toggleCode(button) {
    const codeContainer = button.closest('.collapsible-code');
    const codeBlock = codeContainer.querySelector('.code-block');

    if (codeContainer.classList.contains('expanded')) {
        codeContainer.classList.remove('expanded');
        button.innerHTML = 'Show More <span>&#x25BC;</span>'; // Down arrow
    } else {
        codeContainer.classList.add('expanded');
        button.innerHTML = 'Show Less <span>&#x25B2;</span>'; // Up arrow
    }
}


// Close the modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');

    // Re-enable scrolling on the body when the modal is closed
    document.body.style.overflow = 'auto'; // Restores the body's scroll behavior

    // Re-enable focus on the background elements
    document.body.classList.remove('body-no-focus');

    // Remove modal state from localStorage
    localStorage.removeItem('modalState');

}

// Check on page load if a modal should be open
document.addEventListener("DOMContentLoaded", function () {
    const modalState = localStorage.getItem('modalState');
    if (modalState) {
        const { contentId, title } = JSON.parse(modalState);
        openModal(contentId, title);
    }
});



// Close modal when clicking outside of the modal content
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal when the ESC key is pressed
window.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Initialize the map and set the view to a specific location and zoom level
var map = L.map('map').setView([38.9466, -106.4360], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to load and display a GPX file
// function loadGPX(gpxFile) {
//     new L.GPX(gpxFile, {
//         async: true,
//         marker_options: {
//             startIconUrl: 'https://example.com/start-icon.png', // Optional: custom start marker
//             endIconUrl: 'https://example.com/end-icon.png',     // Optional: custom end marker
//             shadowUrl: 'https://example.com/marker-shadow.png'   // Optional: shadow for marker
//         }
//     }).on('loaded', function(e) {
//         map.fitBounds(e.target.getBounds());  // Automatically zoom to fit the GPX track
//     }).addTo(map);
// }
//
// // Load multiple GPX files (replace these URLs with your actual GPX file paths or URLs)
// loadGPX('gpx/HuronPeak_09-08-2024.gpx');
