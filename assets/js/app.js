(function () {
  "use strict";

  const tripStart = new Date("2026-07-27T00:00:00+08:00");
  const day2Start = new Date("2026-07-28T00:00:00+08:00");
  const day3Start = new Date("2026-07-29T00:00:00+08:00");
  const tripEnd = new Date("2026-07-30T00:00:00+08:00");
  const countdown = document.querySelector("#countdown");
  const toast = document.querySelector("#toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
  }

  function updateTripStatus() {
    if (!countdown) return;
    const now = new Date();

    if (now < tripStart) {
      const days = Math.ceil((tripStart - now) / 86400000);
      countdown.textContent = `距離出發還有 ${days} 天`;
      return;
    }

    if (now < day2Start) {
      countdown.textContent = "今天是 Day 1：陸地冒險";
    } else if (now < day3Start) {
      countdown.textContent = "今天是 Day 2：水上夏日";
    } else if (now < tripEnd) {
      countdown.textContent = "今天是 Day 3：慢遊回家";
    } else {
      countdown.textContent = "旅行已完成，回憶正在累積";
    }
  }

  function setupShare() {
    const button = document.querySelector("#shareButton");
    if (!button) return;

    button.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        text: "六口探險隊的麗寶夏日大冒險",
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }

        await navigator.clipboard.writeText(window.location.href);
        showToast("網址已複製");
      } catch (error) {
        if (error && error.name !== "AbortError") {
          showToast("請從瀏覽器網址列複製連結");
        }
      }
    });
  }

  function setupPrint() {
    document.querySelectorAll(".print-button").forEach((button) => {
      button.addEventListener("click", () => window.print());
    });
  }

  function setupFilters() {
    document.querySelectorAll(".filter-bar").forEach((bar) => {
      const section = bar.closest(".day-section");
      const items = section ? section.querySelectorAll("[data-groups]") : [];

      bar.querySelectorAll("[data-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.filter;
          bar.querySelectorAll("[data-filter]").forEach((item) => {
            item.classList.toggle("active", item === button);
          });

          items.forEach((item) => {
            const groups = (item.dataset.groups || "").split(" ");
            item.hidden = filter !== "all" && !groups.includes(filter);
          });
        });
      });
    });
  }

  function setupChecklist() {
    const inputs = document.querySelectorAll("[data-check]");
    const storageKey = "lihpao-family-checklist-v1";
    let saved = {};

    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (error) {
      saved = {};
    }

    inputs.forEach((input) => {
      input.checked = Boolean(saved[input.dataset.check]);
      input.addEventListener("change", () => {
        saved[input.dataset.check] = input.checked;
        try {
          localStorage.setItem(storageKey, JSON.stringify(saved));
        } catch (error) {
          showToast("瀏覽器未允許儲存勾選狀態");
        }
        updateChecklistStatus(inputs);
      });
    });

    updateChecklistStatus(inputs);
  }

  function updateChecklistStatus(inputs) {
    const status = document.querySelector("#checkStatus");
    if (!status) return;
    const total = inputs.length;
    const completed = Array.from(inputs).filter((input) => input.checked).length;
    status.textContent = completed === total
      ? "出發前檢查已全部完成。"
      : `已完成 ${completed}／${total} 項，勾選狀態會保存在這台裝置。`;
  }

  function setupActiveNavigation() {
    if (!("IntersectionObserver" in window)) return;
    const links = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, {
      rootMargin: "-30% 0px -60% 0px",
      threshold: [0, 0.1, 0.25]
    });

    sections.forEach((section) => observer.observe(section));
  }

  function setupRemoteImageFallbacks() {
    document.querySelectorAll(".media-link img, .video-grid img").forEach((image) => {
      image.addEventListener("error", () => {
        image.hidden = true;
        const parent = image.parentElement;
        if (!parent || parent.querySelector(".image-fallback")) return;
        const fallback = document.createElement("span");
        fallback.className = "image-fallback";
        fallback.textContent = "連線後載入影片縮圖";
        parent.prepend(fallback);
      });
    });
  }

  updateTripStatus();
  setupShare();
  setupPrint();
  setupFilters();
  setupChecklist();
  setupActiveNavigation();
  setupRemoteImageFallbacks();
})();
