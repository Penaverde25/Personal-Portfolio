document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const toggleBtn = document.getElementById('audio-toggle');

  // When user clicks a nav link to a different page, save 'audio-enabled' = true
  const navLinks = document.querySelectorAll('nav a[href]:not([href^="#"])');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sessionStorage.setItem('audio-enabled', 'true');
    });
  });

  // Load saved currentTime from sessionStorage
  const savedTime = sessionStorage.getItem('audio-current-time');
  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }

  // Check if audio was enabled (unmuted) in this session
  const audioEnabledBefore = sessionStorage.getItem('audio-enabled') === 'true';

  if (audioEnabledBefore) {
    // Play unmuted immediately
    audio.muted = false;
    audio.play().then(() => {
      toggleBtn.textContent = '🔊';
    }).catch(() => {
      console.warn("Play failed after unmuting");
      audio.muted = true;
      toggleBtn.textContent = '🔇';
    });
  } else {
    // Autoplay muted (allowed)
    audio.muted = true;
    audio.play().then(() => {
      toggleBtn.textContent = '🔇';
    }).catch(() => {
      console.warn("Muted autoplay failed");
    });

    // On first user click, unmute and play
    const enableAudio = () => {
      audio.muted = false;
      audio.play().then(() => {
        toggleBtn.textContent = '🔊';
        sessionStorage.setItem('audio-enabled', 'true'); // save enable flag in session
      }).catch(() => {
        console.warn("Play failed after unmuting");
      });
      document.removeEventListener('click', enableAudio);
    };
    document.addEventListener('click', enableAudio, { once: true });
  }

  // Toggle button logic
  toggleBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    toggleBtn.textContent = audio.muted ? '🔇' : '🔊';

    if (!audio.muted) {
      audio.play().catch(() => {
        console.warn("Play failed after unmute");
      });
      sessionStorage.setItem('audio-enabled', 'true');
    } else {
      sessionStorage.setItem('audio-enabled', 'false');
    }
  });

  // Save currentTime every second to sessionStorage
  setInterval(() => {
    sessionStorage.setItem('audio-current-time', audio.currentTime);
  }, 1000);

  // Highlight nav (only for # links)
  const navAnchors = document.querySelectorAll('nav a');
  function highlightNav() {
    let scrollY = window.pageYOffset;
    navAnchors.forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
          if (
            scrollY >= section.offsetTop - 60 &&
            scrollY < section.offsetTop + section.offsetHeight
          ) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

  // Glow effect on button click
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.boxShadow = '0 0 30px var(--neon-pink), 0 0 50px var(--neon-pink)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.boxShadow =
        '0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink), 0 0 30px var(--neon-pink)';
    });
  });

  // Parallax title movement
  document.addEventListener("mousemove", (e) => {
    const title = document.querySelector(".title-container");
    if (title) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) * 0.02;
      const moveY = (e.clientY - centerY) * 0.02;
      title.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });
});
