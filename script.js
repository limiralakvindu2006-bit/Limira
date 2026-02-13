window.onload = () => {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const main = document.getElementById("main");
  const intermission = document.getElementById("intermission");
  const proceedBtn = document.getElementById("proceedBtn");
  const memorial = document.getElementById("memorial");
  const bgMusic = document.getElementById("bgMusic");
  const airlineLink = document.getElementById("airlineLink");

  // --- Evasive & Logic Variables ---
  let active = false;
  let isRespawning = false;
  let noX, noY, targetX, targetY;
  const SPEED = 0.2; 
  const MARGIN = 20;
  const SAFE_RADIUS = 90; 
  const ESCAPE_FORCE = 15; 
  let pointerX = null, pointerY = null;

  // --- "Crazy No" Conversation Messages ---
  const noMessages = [
    "No 🙈",
    "Noooo? 🤨",
    "No way! 🙅‍♀️",
    "Are you sure? 🥺",
    "Think again... 🌹",
    "Last chance! 💎",
    "Wrong button! 😂",
    "Still no? 😭",
    "You're being mean! 💔",
    "Just click Yes! ✨"
  ];
  let noClickCount = 0;

  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  function moveButtonRandomly() {
    const rect = noBtn.getBoundingClientRect();
    noX = Math.random() * (window.innerWidth - rect.width - MARGIN * 2) + MARGIN;
    noY = Math.random() * (window.innerHeight - rect.height - MARGIN * 2) + MARGIN;
    targetX = noX;
    targetY = noY;
    noBtn.style.left = `${noX}px`;
    noBtn.style.top = `${noY}px`;
  }

  function handleNoInteraction(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    noClickCount++;
    const messageIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[messageIndex];
    const currentScale = 1 + (noClickCount * 0.1);
    yesBtn.style.transform = `scale(${currentScale})`;
    moveButtonRandomly();
  }

  function activateAvoidance(e) {
    if (!active) {
      active = true;
      const rect = noBtn.getBoundingClientRect();
      noX = rect.left;
      noY = rect.top;
      targetX = noX;
      targetY = noY;
      noBtn.style.position = "fixed";
      noBtn.style.left = `${noX}px`;
      noBtn.style.top = `${noY}px`;
      noBtn.style.margin = "0";
      noBtn.style.zIndex = "1000";
      noBtn.style.touchAction = "none"; 
      document.body.appendChild(noBtn);
    }
  }

  noBtn.addEventListener("mouseenter", activateAvoidance);
  noBtn.addEventListener("pointerdown", (e) => {
    activateAvoidance(e);
    handleNoInteraction(e);
  });

  const updatePointer = (x, y) => { pointerX = x; pointerY = y; };
  document.addEventListener("mousemove", e => updatePointer(e.clientX, e.clientY));
  document.addEventListener("touchmove", e => {
    updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  function animate() {
    if (active && pointerX !== null && !isRespawning && noBtn.parentNode) {
      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(btnCenterX - pointerX, btnCenterY - pointerY);

      if (rect.left < 2 || rect.right > window.innerWidth - 2 || rect.top < 2 || rect.bottom > window.innerHeight - 2) {
        isRespawning = true;
        noBtn.style.opacity = "0";
        setTimeout(() => {
          if(noBtn.parentNode) {
              moveButtonRandomly();
              noBtn.style.opacity = "1";
          }
          isRespawning = false;
        }, 200);
      }

      if (!isRespawning && dist < SAFE_RADIUS) {
        let dx = btnCenterX - pointerX;
        let dy = btnCenterY - pointerY;
        const len = Math.hypot(dx, dy) || 1;
        targetX += (dx / len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
        targetY += (dy / len) * (SAFE_RADIUS - dist + ESCAPE_FORCE);
      }

      if (!isRespawning) {
        targetX = clamp(targetX, MARGIN, window.innerWidth - rect.width - MARGIN);
        targetY = clamp(targetY, MARGIN, window.innerHeight - rect.height - MARGIN);
        noX += (targetX - noX) * SPEED;
        noY += (targetY - noY) * SPEED;
        noBtn.style.left = `${noX}px`;
        noBtn.style.top = `${noY}px`;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  function showMemorial() {
    memorial.classList.add("active");
    const photoRow = document.getElementById("photoRow");
    const videoRow = document.getElementById("videoRow");
    const letterEl = document.getElementById("letter");
    // --- INFINITE FIREWORKS LOOP ---
const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
function randomInRange(min, max) { return Math.random() * (max - min) + min; }

const infiniteConfetti = setInterval(() => {
  confetti(Object.assign({}, defaults, { 
    particleCount: 35, 
    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
  }));
  confetti(Object.assign({}, defaults, { 
    particleCount: 35, 
    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
  }));
}, 500);
// -------------------------------



    photoRow.innerHTML = "";
    ["assets/photo1.jpeg", "assets/photo2.jpeg", "assets/photo3.jpeg", "assets/photo4.jpeg"].forEach(src => {
      const img = document.createElement("img"); img.src = src; photoRow.appendChild(img);
    });

    videoRow.src = "assets/video.mp4";
    videoRow.setAttribute("playsinline", "");
    videoRow.muted = true;
    videoRow.play();

   const letterText = `𝓘 𝓴𝓷𝓸𝔀 𝔂𝓸𝓾’𝓻𝓮 𝓷𝓸𝓽 𝓼𝓸𝓶𝓮𝓸𝓷𝓮 𝔀𝓱𝓸 𝓽𝓪𝓵𝓴𝓼 𝓪 𝓵𝓸𝓽 𝓪𝓫𝓸𝓾𝓽 𝔂𝓸𝓾𝓻 𝓯𝓮𝓮𝓵𝓲𝓷𝓰𝓼.
𝓨𝓸𝓾 𝓴𝓮𝓮𝓹 𝓽𝓱𝓲𝓷𝓰𝓼 𝓲𝓷𝓼𝓲𝓭𝓮.
𝓨𝓸𝓾 𝓪𝓬𝓽 𝓼𝓽𝓻𝓸𝓷𝓰.
𝓨𝓸𝓾 𝓶𝓸𝓿𝓮 𝓺𝓾𝓲𝓮𝓽𝓵𝔂.

𝓑𝓾𝓽 𝓘 𝓼𝓮𝓮 𝔂𝓸𝓾.

𝓘 𝓼𝓮𝓮 𝓽𝓱𝓪𝓽 𝔂𝓸𝓾 𝓭𝓲𝓭𝓷’𝓽 𝓫𝓮𝓬𝓸𝓶𝓮 𝓽𝓱𝓲𝓼 𝔀𝓪𝔂 𝓯𝓸𝓻 𝓷𝓸 𝓻𝓮𝓪𝓼𝓸𝓷.
𝓛𝓲𝓯𝓮 𝓽𝓪𝓾𝓰𝓱𝓽 𝔂𝓸𝓾 𝓽𝓸 𝓫𝓮 𝓬𝓪𝓻𝓮𝓯𝓾𝓵.
𝓘𝓽 𝓽𝓪𝓾𝓰𝓱𝓽 𝔂𝓸𝓾 𝓽𝓸 𝓹𝓻𝓸𝓽𝓮𝓬𝓽 𝔂𝓸𝓾𝓻 𝓱𝓮𝓪𝓻𝓽.
𝓐𝓷𝓭 𝓮𝓿𝓮𝓷 𝓽𝓱𝓸𝓾𝓰𝓱 𝔂𝓸𝓾 𝓭𝓸𝓷’𝓽 𝓼𝓪𝔂 𝓶𝓾𝓬𝓱, 𝓘 𝓴𝓷𝓸𝔀 𝔂𝓸𝓾 𝓯𝓮𝓮𝓵 𝓭𝓮𝓮𝓹𝓵𝔂.

𝓣𝓱𝓪𝓽’𝓼 𝓼𝓸𝓶𝓮𝓽𝓱𝓲𝓷𝓰 𝓘 𝓪𝓭𝓶𝓲𝓻𝓮 𝓪𝓫𝓸𝓾𝓽 𝔂𝓸𝓾.

𝓨𝓸𝓾𝓻 𝓱𝓮𝓪𝓻𝓽 𝓲𝓼 𝓼𝓸𝓯𝓽 𝓪𝓷𝓭 𝓲𝓽’𝓼 𝓫𝓮𝓪𝓾𝓽𝓲𝓯𝓾𝓵.

𝓘 𝓭𝓸𝓷’𝓽 𝔀𝓪𝓷𝓽 𝓽𝓸 𝓬𝓱𝓪𝓷𝓰𝓮 𝔂𝓸𝓾.
𝓘 𝓭𝓸𝓷’𝓽 𝔀𝓪𝓷𝓽 𝓽𝓸 𝓻𝓾𝓼𝓱 𝔂𝓸𝓾.
𝓘 𝓭𝓸𝓷’𝓽 𝔀𝓪𝓷𝓽 𝓽𝓸 𝓯𝓸𝓻𝓬𝓮 𝔂𝓸𝓾 𝓲𝓷𝓽𝓸 𝓪𝓷𝔂𝓽𝓱𝓲𝓷𝓰.

𝓘’𝓶 𝓷𝓸𝓽 𝓱𝓮𝓻𝓮 𝓽𝓸 𝓫𝓻𝓮𝓪𝓴 𝔂𝓸𝓾𝓻 𝔀𝓪𝓵𝓵𝓼.
𝓘’𝓶 𝓳𝓾𝓼𝓽 𝓱𝓮𝓻𝓮 𝓽𝓸 𝓼𝓽𝓪𝓷𝓭 𝓹𝓪𝓽𝓲𝓮𝓷𝓽𝓵𝔂 𝓸𝓾𝓽𝓼𝓲𝓭𝓮 𝓽𝓱𝓮𝓶, 𝓾𝓷𝓽𝓲𝓵 𝔂𝓸𝓾 𝓯𝓮𝓮𝓵 𝓼𝓪𝓯𝓮 𝓮𝓷𝓸𝓾𝓰𝓱 𝓽𝓸 𝓸𝓹𝓮𝓷 𝓽𝓱𝓮 𝓭𝓸𝓸𝓻 𝔂𝓸𝓾𝓻𝓼𝓮𝓵𝓯.

𝓨𝓸𝓾 𝓶𝓪𝓽𝓽𝓮𝓻 𝓽𝓸 𝓶𝓮 𝓷𝓸𝓽 𝓫𝓮𝓬𝓪𝓾𝓼𝓮 𝓸𝓯 𝔀𝓱𝓪𝓽 𝔂𝓸𝓾 𝓰𝓲𝓿𝓮 𝓶𝓮, 𝓫𝓾𝓽 𝓫𝓮𝓬𝓪𝓾𝓼𝓮 𝓸𝓯 𝔀𝓱𝓸 𝔂𝓸𝓾 𝓪𝓻𝓮.

𝓗𝓪𝓹𝓹𝔂 𝓥𝓪𝓵𝓮𝓷𝓽𝓲𝓷𝓮’𝓼 𝓓𝓪𝔂 🤍`;

    let i = 0;
    const typeInterval = setInterval(() => {
      if(letterText[i] !== undefined) {
        letterEl.textContent += letterText[i]; i++;
        if (i % 5 === 0) memorial.scrollTop = memorial.scrollHeight;
      } else {
        clearInterval(typeInterval);
        if(airlineLink) airlineLink.classList.add("show");
      }
    }, 45);
  }

  yesBtn.addEventListener("click", () => {
    main.style.display = "none";
    if(noBtn.parentNode) noBtn.style.display = "none"; 
    intermission.style.display = "flex"; 
    if (bgMusic) bgMusic.play().catch(() => {});
  });

  proceedBtn.addEventListener("click", () => {
    intermission.style.display = "none";
    if(noBtn.parentNode) noBtn.remove(); 
    if (bgMusic) bgMusic.play(); 
    showMemorial();
  });
};
