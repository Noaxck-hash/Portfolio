document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Floating Contact Box Logic ---
    const contactToggle = document.getElementById('contact-toggle');
    const contactForm = document.getElementById('contact-form');
    const toggleIcon = document.getElementById('toggle-icon');

    // --- Floating Left Index Logic ---
    const indexToggle = document.getElementById('index-toggle');
    const sideIndex = document.getElementById('side-index');

    indexToggle.addEventListener('click', () => {
        sideIndex.classList.toggle('collapsed');
    });

    // Make sure the form starts closed
    contactForm.classList.add('collapsed');

    contactToggle.addEventListener('click', () => {
        contactForm.classList.toggle('collapsed');
        
        // Swap out the plus for a minus when opened
        if (contactForm.classList.contains('collapsed')) {
            toggleIcon.textContent = '+';
        } else {
            toggleIcon.textContent = '−';
        }
    });

    // --- Web3Forms Submission Logic ---
    const form = document.getElementById('contact-form');
    const formInputs = document.getElementById('form-inputs');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Stops the page from refreshing

        // Change button text to show it's working
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Gather the data from the form
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Send the data to Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                // Success! Hide the inputs and show the Done message
                formInputs.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                // If something goes wrong with the API
                console.log(response);
                submitBtn.innerText = 'Error. Try Again.';
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.log(error);
            submitBtn.innerText = 'Error. Try Again.';
            submitBtn.disabled = false;
        });
    });


// --- 2. Magnifying Glass Bubble Text Logic ---
    const heroText = document.querySelector('.hero h1');
    // .trim() ensures no accidental spaces at the start/end cause issues
    const textContent = heroText.innerText.trim(); 
    
    heroText.innerHTML = ''; 

    // Split text into words
    const words = textContent.split(' ');

    words.forEach(word => {
        // Wrapper keeps the letters together
        const wordWrapper = document.createElement('span');
        wordWrapper.classList.add('word-wrapper');
        
        // Put each letter in the wrapper
        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            charSpan.classList.add('bubble-char');
            wordWrapper.appendChild(charSpan);
        });
        
        // Add the finished word to the h1
        heroText.appendChild(wordWrapper);
    });

    const chars = document.querySelectorAll('.bubble-char');

    // Track mouse movement over the whole header
    heroText.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        // --- Optimized Mouse & Glow Tracking ---
    const glow = document.querySelector('.ambient-glow');
    let isMoving = false;

    // requestAnimationFrame syncs the movement to your screen's refresh rate to prevent lag
    document.addEventListener('mousemove', (e) => {
        if (!isMoving) {
            window.requestAnimationFrame(() => {
                // Instantly move the cursor
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                // Just update the coordinates for the glow; CSS will handle the smooth delay
                if (glow) {
                    glow.style.left = e.clientX + 'px';
                    glow.style.top = e.clientY + 'px';
                }
                isMoving = false;
            });
            isMoving = true;
        }
    });

        chars.forEach(char => {
            const rect = char.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const charCenterY = rect.top + rect.height / 2;

            const distX = mouseX - charCenterX;
            const distY = mouseY - charCenterY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            const maxDistance = 120; 

            if (distance < maxDistance) {
                const scale = 1 + (0.6 * (maxDistance - distance) / maxDistance);
                char.style.transform = `scale(${scale}) translateY(-${(scale - 1) * 15}px)`;
                char.style.color = '#ffffff'; 
                char.style.textShadow = '0 0 25px rgba(255, 59, 48, 0.9)';
            } else {
                char.style.transform = 'scale(1) translateY(0)';
                char.style.color = 'var(--accent)';
                char.style.textShadow = 'var(--red-glow)';
            }
        });
    });

    // Reset everything when the mouse leaves the h1 area completely
    heroText.addEventListener('mouseleave', () => {
        chars.forEach(char => {
            char.style.transform = 'scale(1) translateY(0)';
            char.style.color = 'var(--accent)';
            char.style.textShadow = 'var(--red-glow)';
        });
    });


    // --- 3. Custom Cursor & Ambient Glow Logic ---
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const glow = document.querySelector('.ambient-glow');
    let isMoving = false;

    // Movement Tracker (Syncs to screen refresh rate)
    document.addEventListener('mousemove', (e) => {
        if (!isMoving) {
            window.requestAnimationFrame(() => {
                // Move the custom cursor
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                // Move the background glow
                if (glow) {
                    glow.style.left = e.clientX + 'px';
                    glow.style.top = e.clientY + 'px';
                }
                isMoving = false;
            });
            isMoving = true;
        }
    });

    // --- Click & Touch Tracker (Mousedown/Mouseup + Touchstart/Touchend) ---
    
    // Desktop Mouse Events
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) { 
            cursor.classList.add('clicking');
            if (glow) glow.classList.add('clicking'); 
        }
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        if (glow) glow.classList.remove('clicking'); 
    });

    // NEW: Mobile Touch Events
    document.addEventListener('touchstart', (e) => {
        if (glow) {
            // Instantly move the glow to exactly where the finger tapped
            glow.style.left = e.touches[0].clientX + 'px';
            glow.style.top = e.touches[0].clientY + 'px';
            glow.classList.add('clicking'); // Condense the light
        }
    });

    document.addEventListener('touchend', () => {
        if (glow) glow.classList.remove('clicking'); // Restore the light
    });


    // --- 4 & 5. Smooth Scrolling & Intersection Observer (Fixed) ---
    
    const trackedSections = document.querySelectorAll('#about, #work, #resume');
    const sidebarLinks = document.querySelectorAll('.index-content a');
    
    // The "Lock" variable
    let isClickScrolling = false;
    let scrollTimeout;

    // Configure the camera
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Lowered to 20% so it catches the bottom sections easier
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // If the lock is ON (because we clicked a link), ignore the camera
        if (isClickScrolling) return; 

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                // Remove active from all
                sidebarLinks.forEach(link => link.classList.remove('active'));
                
                // Add active to the current one
                const activeLink = document.querySelector(`.index-content a[href="#${currentId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    trackedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Handle the clicking
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 1. Turn ON the lock
            isClickScrolling = true;
            clearTimeout(scrollTimeout); // Reset the timer if they click multiple times fast

            // 2. Instantly move the red highlight IF we clicked a sidebar link
            if (this.parentElement.classList.contains('index-content')) {
                sidebarLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }

            // 3. Perform the smooth scroll
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // 4. Turn OFF the lock after the scroll animation finishes (800 milliseconds)
            scrollTimeout = setTimeout(() => {
                isClickScrolling = false;
            }, 800);
        });
    });

    // Tell the observer to start watching our sections
    trackedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- 6. 3D Viewer Shadow DOM Override ---
    // Wait for the model viewer to load, then inject custom CSS into its hidden core
    const viewer = document.querySelector('model-viewer');
    if (viewer) {
        viewer.addEventListener('load', () => {
            const shadowRoot = viewer.shadowRoot;
            if (shadowRoot) {
                const style = document.createElement('style');
                style.textContent = '* { cursor: none !important; }';
                shadowRoot.appendChild(style);
            }
        });
    }

    // --- 7. Scroll Fade-In Animation Logic ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the visible class to trigger the CSS animation
                entry.target.classList.add('is-visible');
                
                // Stop watching the element 
                observer.unobserve(entry.target);

                // NEW: Remove the animation classes entirely after 1.2 seconds
                // This gives full control back to your hover effects!
                setTimeout(() => {
                    entry.target.classList.remove('fade-in', 'is-visible');
                }, 1200); 
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // --- 8. Light/Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');

    // Check if the user already chose a theme in a previous visit
    if (localStorage.getItem('portfolio-theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // Toggle the theme on click with a smooth fade
    themeToggle.addEventListener('click', () => {
        // 1. Turn on the smooth transition override
        document.body.classList.add('theme-transition');

        // 2. Swap the colors
        document.body.classList.toggle('light-mode');
        
        // 3. Save the user's choice
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
        }

        // 4. Turn off the override after exactly 0.5 seconds
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    });

});