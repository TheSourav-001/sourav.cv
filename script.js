document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ROBUST BOOT SEQUENCE ---
    const bootSequence = document.getElementById('boot-sequence');
    const bootText = document.getElementById('boot-text');
    const progressBar = document.querySelector('.boot-progress');
    const interfaceLayer = document.getElementById('main-interface');
    
    // Function to unlock the site
    function unlockSystem() {
        bootSequence.style.opacity = '0';
        setTimeout(() => {
            bootSequence.style.display = 'none';
            interfaceLayer.style.opacity = '1';
        }, 500);
    }

    // Animation Loop
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 4; // Variable speed
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        
        // Dynamic Text
        if(progress > 20 && progress < 50) bootText.innerText = "LOADING CORE MODULES...";
        if(progress > 50 && progress < 80) bootText.innerText = "DECRYPTING USER DATA...";
        if(progress >= 100) {
            bootText.innerText = "ACCESS GRANTED";
            clearInterval(interval);
            setTimeout(unlockSystem, 400); // Short delay before unlock
        }
    }, 50);

    // FAILSAFE: Force unlock after 3.5 seconds if animation stuck
    setTimeout(() => {
        if(bootSequence.style.display !== 'none') {
            clearInterval(interval);
            unlockSystem();
        }
    }, 3500);


    // --- 2. AUDIO ENGINE (PASSIVE) ---
    // Only initializes on first user interaction to prevent browser blocking
    let audioCtx;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        if (!audioCtx) return; // Don't play if not initialized yet
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        
        if (type === 'hover') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
            gain.gain.setValueAtTime(0.02, now); // Very quiet
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    }

    // Initialize audio on first click anywhere
    document.body.addEventListener('click', () => {
        initAudio();
        playSound('click');
    }, { once: true });

    // Attach sounds to elements
    document.querySelectorAll('a, .glass-card, .nav-btn').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('mousedown', () => playSound('click'));
    });


    // --- 3. PARTICLES (OPTIMIZED) ---
    const canvas = document.getElementById('quantum-field');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Mouse tracking
    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Create reduced particle count for performance
    for(let i=0; i<60; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            // Draw particle
            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();

            // Draw connections if close to mouse
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if(dist < 150) {
                ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist/150})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        });
        requestAnimationFrame(animate);
    }
    animate();


    // --- 4. CLOCK ---
    const clock = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clock.innerText = now.toLocaleTimeString('en-GB') + " UTC";
    }, 1000);
});