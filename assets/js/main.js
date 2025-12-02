// ===== RSVP 送信先（GAS WebアプリURL） =====
const ENDPOINT_URL = 'https://script.google.com/macros/library/d/1wgb5XujD-FfNHpxZTV272jlmW7EFDS_7-FwSJuqRZ3H-yzrOxUiE-qXN/4';

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =====================================
     ページロード時：ロゴのフェードイン
  ===================================== */
  setTimeout(() => {
    body.classList.add("is-loaded");
  }, 50);

  /* =====================================
     言語切り替え（JP / EN）
  ===================================== */
  const langJpBtn = document.getElementById("langJp");
  const langEnBtn = document.getElementById("langEn");

  const updateLanguageTexts = (lang) => {
    const isJa = lang === "jp";

    const inputs = document.querySelectorAll("[data-placeholder-ja], [data-placeholder-en]");
    inputs.forEach((el) => {
      const ja = el.getAttribute("data-placeholder-ja");
      const en = el.getAttribute("data-placeholder-en");
      if (isJa && ja) {
        el.placeholder = ja;
      } else if (!isJa && en) {
        el.placeholder = en;
      }
    });

    const options = document.querySelectorAll("[data-label-ja], [data-label-en]");
    options.forEach((opt) => {
      const ja = opt.getAttribute("data-label-ja");
      const en = opt.getAttribute("data-label-en");
      if (isJa && ja) {
        opt.textContent = ja;
      } else if (!isJa && en) {
        opt.textContent = en;
      }
    });
  };

  const setLang = (lang) => {
    if (lang === "jp") {
      body.classList.add("jp");
      body.classList.remove("en");
      langJpBtn?.classList.add("active");
      langEnBtn?.classList.remove("active");
    } else {
      body.classList.add("en");
      body.classList.remove("jp");
      langEnBtn?.classList.add("active");
      langJpBtn?.classList.remove("active");
    }
    updateLanguageTexts(lang);
  };

  langJpBtn?.addEventListener("click", () => setLang("jp"));
  langEnBtn?.addEventListener("click", () => setLang("en"));

  setLang(body.classList.contains("en") ? "en" : "jp");

  /* =====================================
     ハンバーガーメニュー（SP）
  ===================================== */
  const navMenuBtn = document.getElementById("gnaviMenuBtn");
  const gnaviOverlay = document.getElementById("gnaviOverlay");

  navMenuBtn?.addEventListener("click", () => {
    body.classList.toggle("nav-open");
  });

  gnaviOverlay?.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", () => {
      body.classList.remove("nav-open");
    });
  });

  /* =====================================
     PC丸ナビのカレント表示
  ===================================== */
  const pcNavLinks = Array.from(document.querySelectorAll("#gnaviPcList a[href^='#']"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (!id) return;

          pcNavLinks.forEach((link) => {
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("current");
            } else {
              link.classList.remove("current");
            }
          });
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  }

  /* =====================================
     セクションのフェードイン
  ===================================== */
  const sectionBlocks = document.querySelectorAll(".section-block");

  if ("IntersectionObserver" in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    sectionBlocks.forEach((sec) => fadeObserver.observe(sec));
  } else {
    sectionBlocks.forEach((sec) => sec.classList.add("is-visible"));
  }

  /* =====================================
     FVを過ぎたら lang / gnavi を消す
  ===================================== */
  const updateFvState = () => {
    const threshold = window.innerHeight * 0.95;
    if (window.scrollY >= threshold) {
      body.classList.add("after-fv");
    } else {
      body.classList.remove("after-fv");
    }
  };

  /* =====================================
     Message セクションで tagline を小さく
  ===================================== */
  const messageSection = document.querySelector(".message");

  const updateMessageState = () => {
    if (!messageSection) return;

    const rect = messageSection.getBoundingClientRect();
    const triggerStart = window.innerHeight * 0.9;
    const triggerEnd = 0;

    if (rect.top <= triggerStart && rect.bottom >= triggerEnd) {
      body.classList.add("logo-small");
    } else {
      body.classList.remove("logo-small");
    }
  };

  /* =====================================
     Profile 以降で tagline を消す
  ===================================== */
  const profileSection = document.querySelector("#profile");

  const updateProfileState = () => {
    if (!profileSection) return;

    const rect = profileSection.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.4;

    if (rect.top <= triggerPoint) {
      body.classList.add("after-profile");
    } else {
      body.classList.remove("after-profile");
    }
  };

  /* =====================================
     スクロール時の共通ハンドラ
  ===================================== */
  const onScroll = () => {
    updateFvState();
    updateMessageState();
    updateProfileState();
  };

  updateFvState();
  updateMessageState();
  updateProfileState();
  window.addEventListener("scroll", onScroll);
});


// ========================================
// RSVP フォーム送信（必須チェック追加版）
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lang = document.body.classList.contains('en') ? 'en' : 'jp';

    const name = document.getElementById('guestName')?.value.trim() || '';
    const nameKana = document.getElementById('guestKana')?.value.trim() || '';
    const attendance = document.getElementById('attendance')?.value || '';
    const allergies = document.getElementById('allergies')?.value || '';
    const message = document.getElementById('guestMessage')?.value || '';

    // ---- エラーメッセージ表示枠 ----
    let msg = document.querySelector('.rsvp_message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'rsvp_message';
      form.appendChild(msg);
    }

    // ============================================
    //  必須チェック
    // ============================================
    if (!name) {
      msg.className = "rsvp_message error";
      msg.textContent = lang === 'jp'
        ? 'お名前をご入力ください'
        : 'Please enter your name';
      return;
    }

    if (lang === "jp" && !nameKana) {
      msg.className = "rsvp_message error";
      msg.textContent = 'ふりがなをご入力ください';
      return;
    }

    if (!attendance) {
      msg.className = "rsvp_message error";
      msg.textContent = lang === 'jp'
        ? 'ご出欠を選択してください'
        : 'Please select attendance';
      return;
    }

    // ============================================
    //  送信開始
    // ============================================
    msg.classList.remove("error");
    msg.classList.add("info");
    msg.textContent = lang === 'jp' ? '送信中...' : 'Sending...';

    const payload = { name, nameKana, attendance, allergies, message, lang };

    try {
      await fetch(ENDPOINT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      msg.classList.remove('error');
      msg.classList.add('success');
      msg.innerHTML = lang === 'jp'
        ? '送信が完了しました<br>ご回答いただきありがとうございます'
        : 'Your response has been sent Thank you!';

      form.reset();

    } catch (err) {
      msg.classList.remove('success');
      msg.classList.add('error');
      msg.textContent = lang === 'jp'
        ? '送信に失敗しました 通信環境をご確認ください '
        : 'Failed to send Please check your connection';
      console.error(err);
    }
  });
});
