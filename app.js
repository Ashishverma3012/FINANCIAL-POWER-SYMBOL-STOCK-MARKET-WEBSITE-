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

    // -------------------------------------------------------------
    // 7. REAL-TIME MARKET TICK ENGINE (STOCHASTIC SIMULATOR & COMMODITIES)
    // -------------------------------------------------------------
    const marketAssets = {
        nifty: { elementId: 'nifty-price', changeId: 'nifty-change', trendId: 'nifty-trend', base: 22419.55, change: 142.30, pct: 0.64, currency: '₹', precision: 2 },
        sensex: { elementId: 'sensex-price', changeId: 'sensex-change', trendId: 'sensex-trend', base: 73872.29, change: 456.20, pct: 0.62, currency: '₹', precision: 2 },
        banknifty: { elementId: 'banknifty-price', changeId: 'banknifty-change', trendId: 'banknifty-trend', base: 47286.40, change: -89.15, pct: -0.19, currency: '₹', precision: 2 },
        gold: { elementId: 'gold-price', changeId: 'gold-change', trendId: 'gold-trend', base: 2345.50, change: 12.80, pct: 0.55, currency: '$', precision: 2 },
        silver: { elementId: 'silver-price', changeId: 'silver-change', trendId: 'silver-trend', base: 29.20, change: -0.45, pct: -1.52, currency: '$', precision: 2 }
    };

    function startTickEngine() {
        setInterval(() => {
            for (const [key, asset] of Object.entries(marketAssets)) {
                // Stochastic geometric random fluctuation (maximum 0.02% variance per tick)
                const pctChange = (Math.random() - 0.495) * 0.0004; 
                const tickShift = asset.base * pctChange;

                asset.base += tickShift;
                asset.change += tickShift;
                asset.pct = (asset.change / (asset.base - asset.change)) * 100;

                const priceEl = document.getElementById(asset.elementId);
                const changeEl = document.getElementById(asset.changeId);
                const trendEl = document.getElementById(asset.trendId);

                // 1. Update Price Text
                if (priceEl) {
                    const formatted = asset.base.toLocaleString('en-US', {
                        minimumFractionDigits: asset.precision,
                        maximumFractionDigits: asset.precision
                    });
                    priceEl.textContent = `${asset.currency}${formatted}`;
                    
                    // Add a tiny flash animation to indicate tick update
                    priceEl.classList.add('transition-all', 'duration-200');
                    if (tickShift >= 0) {
                        priceEl.style.textShadow = '0 0 8px rgba(42, 229, 0, 0.4)';
                    } else {
                        priceEl.style.textShadow = '0 0 8px rgba(255, 180, 171, 0.4)';
                    }
                    setTimeout(() => {
                        priceEl.style.textShadow = 'none';
                    }, 250);
                }

                // 2. Update Change Percentage and Colors
                if (changeEl) {
                    const sign = asset.change >= 0 ? '+' : '';
                    const colorClass = asset.change >= 0 ? 'text-primary-fixed-dim' : 'text-error';
                    changeEl.textContent = `${sign}${asset.change.toFixed(2)} (${sign}${asset.pct.toFixed(2)}%)`;
                    
                    // Reset styling classes cleanly
                    changeEl.className = `${colorClass} font-data-lg text-sm transition-colors duration-300`;
                }

                // 3. Update Trend Indicator Icon & Style
                if (trendEl) {
                    if (asset.change >= 0) {
                        trendEl.textContent = 'trending_up';
                        trendEl.className = 'material-symbols-outlined text-primary-fixed-dim text-sm transition-colors duration-300';
                        if (trendEl.parentElement.parentElement.classList.contains('border-error/20')) {
                            trendEl.parentElement.parentElement.classList.remove('border-error/20');
                        }
                    } else {
                        trendEl.textContent = 'trending_down';
                        trendEl.className = 'material-symbols-outlined text-error text-sm transition-colors duration-300';
                        // Add border-error helper to visually emphasize down trend cards
                        if (key === 'banknifty') {
                            trendEl.parentElement.parentElement.classList.add('border-error/20');
                        }
                    }
                }
            }
        }, 1500);
    }

    startTickEngine();

    // -------------------------------------------------------------
    // 8. REAL-TIME EXTERNAL MARKET DATA INTEGRATION LAYER (TWELVE DATA)
    // -------------------------------------------------------------
    async function fetchTwelveDataFeed() {
        // Twelve Data API Key Slot - Add key here to switch from simulator to live feed
        const API_KEY = "3c6f9b2d887a4d62a9390234a9ff5bb3"; // Temporary key or configure here
        const querySymbols = "NSE:NIFTY50,NSE:SENSEX,NSE:BANKNIFTY,XAU/USD,XAG/USD";
        
        try {
            const res = await fetch(`https://api.twelvedata.com/price?symbol=${querySymbols}&apikey=${API_KEY}`);
            if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
            
            const rawData = await res.json();
            
            // Map Twelve Data prices dynamically into the baselines
            if (rawData['NSE:NIFTY50'] && rawData['NSE:NIFTY50'].price) {
                marketAssets.nifty.base = parseFloat(rawData['NSE:NIFTY50'].price);
            }
            if (rawData['NSE:SENSEX'] && rawData['NSE:SENSEX'].price) {
                marketAssets.sensex.base = parseFloat(rawData['NSE:SENSEX'].price);
            }
            if (rawData['NSE:BANKNIFTY'] && rawData['NSE:BANKNIFTY'].price) {
                marketAssets.banknifty.base = parseFloat(rawData['NSE:BANKNIFTY'].price);
            }
            if (rawData['XAU/USD'] && rawData['XAU/USD'].price) {
                marketAssets.gold.base = parseFloat(rawData['XAU/USD'].price);
            }
            if (rawData['XAG/USD'] && rawData['XAG/USD'].price) {
                marketAssets.silver.base = parseFloat(rawData['XAG/USD'].price);
            }

            console.log("Twelve Data API: Baselines refreshed successfully.");
        } catch (err) {
            console.warn("Twelve Data API feed unavailable. Continuing on local high-fidelity tick engine.", err);
        }
    }

    // Uncomment these lines to enable automatic feed sync on load and every 5 minutes
    // fetchTwelveDataFeed();
    // setInterval(fetchTwelveDataFeed, 300000);
});
