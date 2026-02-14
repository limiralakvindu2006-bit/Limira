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

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

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

  function activateAvoidance() {
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
    activateAvoidance();
    handleNoInteraction(e);
  });

  const updatePointer = (x, y) => {
    pointerX = x;
    pointerY = y;
  };

  document.addEventListener("mousemove", (e) => updatePointer(e.clientX, e.clientY));
  document.addEventListener(
    "touchmove",
    (e) => {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: false }
  );

  function animate() {
    if (active && pointerX !== null && !isRespawning && noBtn.parentNode) {
      const rect = noBtn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(btnCenterX - pointerX, btnCenterY - pointerY);

      // If the button hits edges, respawn
      if (
        rect.left < 2 ||
        rect.right > window.innerWidth - 2 ||
        rect.top < 2 ||
        rect.bottom > window.innerHeight - 2
      ) {
        isRespawning = true;
        noBtn.style.opacity = "0";
        setTimeout(() => {
          if (noBtn.parentNode) {
            moveButtonRandomly();
            noBtn.style.opacity = "1";
          }
          isRespawning = false;
        }, 200);
      }

      // Escape if pointer is close
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

  // ---------------- ROSE RAIN (Memorial only) ----------------
  let roseTimer = null;

  function stopRoseRain() {
    if (roseTimer) clearInterval(roseTimer);
    roseTimer = null;
    const oldLayer = document.querySelector(".rose-layer");
    if (oldLayer) oldLayer.remove();
  }

  function startRoseRain() {
    stopRoseRain(); // prevents duplicates

    const layer = document.createElement("div");
    layer.className = "rose-layer";
    document.body.appendChild(layer);

    const MAX_ROSES = 120;

    roseTimer = setInterval(() => {
      if (layer.childElementCount > MAX_ROSES) return;

      const rose = document.createElement("div");
      rose.className = "rose";
      rose.textContent = "🌸";

      rose.style.left = Math.random() * 100 + "vw";
      rose.style.fontSize = 16 + Math.random() * 22 + "px";
      rose.style.animationDuration = 4 + Math.random() * 5 + "s";
      rose.style.opacity = (0.65 + Math.random() * 0.35).toFixed(2);

      layer.appendChild(rose);

      setTimeout(() => {
        if (rose && rose.parentNode) rose.remove();
      }, 10000);
    }, 220);
  }

  function showMemorial() {
    memorial.classList.add("active");

    const photoRow = document.getElementById("photoRow");
    const videoRow = document.getElementById("videoRow");
    const letterEl = document.getElementById("letter");

    // Photos
    photoRow.innerHTML = "";
    ["assets/photo1.jpeg", "assets/photo2.jpeg", "assets/photo3.jpeg", "assets/photo4.jpeg"].forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      photoRow.appendChild(img);
    });

    // Video
    videoRow.src = "assets/video.mp4";
    videoRow.setAttribute("playsinline", "");
    videoRow.muted = true;
    videoRow.play();

    // Letter text
    const letterText = `I know you’re not someone who talks a lot about your feelings. You keep things inside. You act strong. You move quietly.But I see you. I see that you didn’t become this way for no reason. Life taught you to be careful. It taught you to protect your heart. And even though you don’t say much, I know you feel deeply. That’s something I admire about you.You may not always show it, but your heart is soft and it’s beautiful.I don’t want to change you. I don’t want to rush you. I don’t want to force you into anything. I just want you to know that with me, you don’t have to carry everything alone. You don’t have to be guarded all the time. You don’t have to pretend you don’t care. I’m not here to break your walls. I’m just here to stand patiently outside them, until you feel safe enough to open the door yourself. And no matter what pace you move at, I’ll respect it.You matter to me not because of what you give me, but because of who you are.

Happy Valentine’s Day 🤍`;

    // Fade in letter (CSS handles animation)
    letterEl.textContent = letterText;
    letterEl.classList.remove("show");
    requestAnimationFrame(() => {
      setTimeout(() => letterEl.classList.add("show"), 150);
    });

    // Start roses here
    startRoseRain();

    // Show airline link after fade
    setTimeout(() => {
      if (airlineLink) airlineLink.classList.add("show");
    }, 2200);
  }

  yesBtn.addEventListener("click", () => {
    main.style.display = "none";
    if (noBtn.parentNode) noBtn.style.display = "none";
    intermission.style.display = "flex";
    if (bgMusic) bgMusic.play().catch(() => {});
  });

  proceedBtn.addEventListener("click", () => {
    intermission.style.display = "none";
    if (noBtn.parentNode) noBtn.remove();
    if (bgMusic) bgMusic.play();
    showMemorial();
  });
};
