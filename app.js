// AETHERIS CLIENT APPLICATION LOGIC - CORE SCROLL ANIMATION & TERMINAL ACTIONS

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. CONFIGURATION & DOM ELEMENTS
    // -------------------------------------------------------------
    const frameCount = 240;
    const canvas = document.getElementById('scroll-canvas');
    const ctx = canvas.getContext('2d');
    
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const scrollHint = document.querySelector('.animation-scroll-hint');

    // Return the correct filename padded with zeros
    const currentFramePath = index => {
        const paddedIndex = index.toString().padStart(3, '0');
        return `assets/frames/ezgif-frame-${paddedIndex}.jpg`;
    };

    // -------------------------------------------------------------
    // 2. IMAGE PRELOADER
    // -------------------------------------------------------------
    const images = [];
    let loadedImagesCount = 0;
    let preloadingCompleted = false;

    // Start preloading
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFramePath(i);
        
        img.onload = () => {
            handleImageLoad();
        };

        img.onerror = () => {
            console.warn(`Frame failed to load: ${img.src}`);
            handleImageLoad();
        };

        images.push(img);
    }

    function handleImageLoad() {
        loadedImagesCount++;
        const percent = Math.round((loadedImagesCount / frameCount) * 100);
        
        // Smoothly display progress
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}% loaded`;

        if (loadedImagesCount === frameCount) {
            onPreloadComplete();
        }
    }

    function onPreloadComplete() {
        preloadingCompleted = true;
        
        // Hide loader with a clean fade out animation
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.style.overflow = 'auto'; // Re-enable scroll
            
            // Draw first frame
            drawFrame(1);
            
            // Start scroll render loop
            requestAnimationFrame(renderLoop);
            
            // Start dashboard glow cycle
            animateGlow();
        }, 600);
    }

    // Disable scrolling during load
    document.body.style.overflow = 'hidden';

    // -------------------------------------------------------------
    // 3. CANVAS DRAW ENGINE & COVER SCALING
    // -------------------------------------------------------------
    function drawFrame(index) {
        const img = images[index - 1];
        if (!img) return;

        // Sync canvas resolution with viewport dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const imgWidth = img.naturalWidth || img.width || 1920;
        const imgHeight = img.naturalHeight || img.height || 1080;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        // Cover scale (crops edges to guarantee background-fill)
        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Redraw on window resize
    window.addEventListener('resize', () => {
        if (preloadingCompleted) {
            const currentIdx = Math.round(interpolatedFrame);
            drawFrame(currentIdx);
        }
    });

    // -------------------------------------------------------------
    // 4. SMOOTH SCROLL INTERPOLATION (LERP ENGINE)
    // -------------------------------------------------------------
    let interpolatedFrame = 1;
    const lerpFactor = 0.08; // Control scroll inertia smoothness (0.01 - 0.1)

    function renderLoop() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Lock frame transitions to the first 150vh animation track trigger
        const animationTrackHeight = window.innerHeight * 1.5;
        const scrollFraction = Math.min(1, Math.max(0, scrollTop / animationTrackHeight));
        
        // Map scroll range to frame sequence indices
        const targetFrame = Math.min(frameCount, Math.max(1, Math.floor(scrollFraction * frameCount) + 1));
        
        // Linear Interpolation (lerp) for smooth frames transitions
        interpolatedFrame += (targetFrame - interpolatedFrame) * lerpFactor;
        
        // Round to nearest frame
        const frameToDraw = Math.round(interpolatedFrame);
        drawFrame(frameToDraw);

        // Fade scroll hint once scrolled past 40vh
        if (scrollHint) {
            if (scrollTop > window.innerHeight * 0.4) {
                scrollHint.classList.add('fade-out');
            } else {
                scrollHint.classList.remove('fade-out');
            }
        }

        // Fade title container when person scrolls 30% of the scroll animation section (45vh)
        const titleContainer = document.querySelector('.animation-title-container');
        if (titleContainer) {
            const fadeThreshold = animationTrackHeight * 0.3; // 30% of the 150vh animation track
            const opacity = Math.min(1, Math.max(0, 1 - (scrollTop / fadeThreshold)));
            titleContainer.style.opacity = opacity;
            if (opacity <= 0) {
                titleContainer.style.pointerEvents = 'none';
                titleContainer.style.visibility = 'hidden';
            } else {
                titleContainer.style.pointerEvents = 'auto';
                titleContainer.style.visibility = 'visible';
            }
        }

        // Toggle Sidebar visibility and layout displacement on scroll
        const sidebarThreshold = window.innerHeight * 1.0; // 100vh scroll depth
        if (scrollTop >= sidebarThreshold) {
            document.body.classList.add('show-sidebar');
        } else {
            document.body.classList.remove('show-sidebar');
        }

        // Loop
        requestAnimationFrame(renderLoop);
    }

    // -------------------------------------------------------------
    // 5. DECORATOR ACTIONS & HOLOGRAM PULSES
    // -------------------------------------------------------------
    function animateGlow() {
        const glows = document.querySelectorAll('.glow-green');
        glows.forEach(el => {
            let opacity = 0.15 + Math.sin(Date.now() / 800) * 0.08;
            el.style.boxShadow = `0 0 15px rgba(57, 255, 20, ${opacity})`;
        });
        requestAnimationFrame(animateGlow);
    }

    // -------------------------------------------------------------
    // 6. DYNAMIC TAB SWITCHER & TERMINAL GAUGE MICRO-INTERACTIONS
    // -------------------------------------------------------------
    const menuLinks = document.querySelectorAll('.nav-menu-link, .sidebar-tab-link');
    const tabPanels = document.querySelectorAll('.tab-stage-panel');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute('data-tab-target');
            if (!targetTab) return;

            // Update active states on all menus matching the target
            menuLinks.forEach(m => {
                if (m.getAttribute('data-tab-target') === targetTab) {
                    m.classList.add('active');
                } else {
                    m.classList.remove('active');
                }
            });

            // Switch tab panels with smooth transitions
            tabPanels.forEach(panel => {
                if (panel.id === `tab-panel-${targetTab}`) {
                    panel.classList.remove('hidden');
                } else {
                    panel.classList.add('hidden');
                }
            });

            // Smoothly auto-scroll past the animation to the trading dashboard
            const dashboardSectionTop = window.innerHeight * 1.5;
            window.scrollTo({
                top: dashboardSectionTop + 5,
                behavior: 'smooth'
            });

            // Trigger circular sentiment dial animations if AI Predict tab is loaded
            if (targetTab === 'ai-predict') {
                animateSentimentGauge();
            }
        });
    });

    // Initialize default active tab states
    const defaultTab = 'dashboard';
    menuLinks.forEach(m => {
        if (m.getAttribute('data-tab-target') === defaultTab) {
            m.classList.add('active');
        } else {
            m.classList.remove('active');
        }
    });

    function animateSentimentGauge() {
        const circle = document.getElementById('sentiment-gauge-circle');
        const pctText = document.getElementById('sentiment-percentage-value');
        const lblText = document.getElementById('sentiment-label-value');
        if (!circle || !pctText || !lblText) return;
        
        // Reset offset to full circumference (hidden)
        circle.style.strokeDashoffset = '251.2';
        pctText.textContent = '0%';
        lblText.textContent = 'ANALYZING...';
        
        setTimeout(() => {
            // Gauge value is 78% (78% of 251.2 stroke-dasharray) -> offset = 251.2 - (251.2 * 0.78) = 55.26
            const targetOffset = 251.2 - (251.2 * 0.78);
            circle.style.strokeDashoffset = targetOffset.toString();
            
            // Count up percentage text
            let currentPct = 0;
            const duration = 1200; // ms
            const intervalTime = 15;
            const steps = duration / intervalTime;
            const stepVal = 78 / steps;
            
            const counterInterval = setInterval(() => {
                currentPct += stepVal;
                if (currentPct >= 78) {
                    currentPct = 78;
                    clearInterval(counterInterval);
                    lblText.textContent = 'STRONG BULLISH';
                }
                pctText.textContent = `${Math.round(currentPct)}%`;
            }, intervalTime);
        }, 300);
    }
});
