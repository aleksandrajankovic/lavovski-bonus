(function () {
  const stage = document.getElementById("lionCarousel");
  const root = document.getElementById("lionSlots");
  const cards = Array.from(root.querySelectorAll("[data-card]"));

  if (!stage || !root || cards.length < 3) return;

  let active = 0;
  let locked = false;

  const mod = (i, n) => ((i % n) + n) % n;

  function applyClasses() {
    const n = cards.length;
    const prev = mod(active - 1, n);
    const next = mod(active + 1, n);

    cards.forEach((c, i) => {
      c.classList.remove("vc-prev", "vc-active", "vc-next");
      if (i === prev) c.classList.add("vc-prev");
      else if (i === active) c.classList.add("vc-active");
      else if (i === next) c.classList.add("vc-next");
      else {
        c.style.opacity = "0";
        c.style.pointerEvents = "none";
        c.style.transform = "translateY(0) scale(.9)";
        c.style.zIndex = "0";
      }
    });

    [prev, active, next].forEach((i) => {
      cards[i].style.opacity = "";
      cards[i].style.pointerEvents = "";
      cards[i].style.transform = "";
      cards[i].style.zIndex = "";
    });
  }

  function go(delta) {
    if (locked) return;
    locked = true;

    active = mod(active + delta, cards.length);
    applyClasses();

    setTimeout(() => (locked = false), 240);
  }

  // init
  applyClasses();

  let startY = 0;
  let startX = 0;

  stage.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      startY = t.clientY;
      startX = t.clientX;
    },
    { passive: true },
  );

  stage.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false },
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      const dy = t.clientY - startY;
      const dx = t.clientX - startX;

      if (Math.abs(dx) > Math.abs(dy)) return;

      if (dy < -45) go(1);
      if (dy > 45) go(-1);
    },
    { passive: true },
  );

  stage.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      if (e.deltaY > 0) go(1);
      if (e.deltaY < 0) go(-1);
    },
    { passive: false },
  );

  let isDown = false;
  let mouseStartY = 0;

  stage.addEventListener("mousedown", (e) => {
    isDown = true;
    mouseStartY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
  });

  stage.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    const dy = e.clientY - mouseStartY;

    if (dy < -50) {
      go(1);
      isDown = false;
    }

    if (dy > 50) {
      go(-1);
      isDown = false;
    }
  });
})();
