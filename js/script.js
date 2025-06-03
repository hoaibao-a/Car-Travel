document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const dataFiles = {
    site: "./data/site.json",
    header: "./data/header.json",
    hero: "./data/hero.json",
    about: "./data/about.json",
    pricing: "./data/pricing.json",
    contact: "./data/contact.json",
    footer: "./data/footer.json"
  };

  async function fetchAllData() {
    console.log("Fetching all data files...");
    try {
      const allData = {};
      for (const [key, url] of Object.entries(dataFiles)) {
        console.log(`Fetching ${url}...`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }
        const data = await response.json();
        allData[key] = data;
        console.log(`Successfully fetched ${url}`);
      }
      renderPage(allData);
    } catch (error) {
      console.error("Could not fetch or parse one or more data files:", error);
      displayErrorMessage(error);
    }
  }

  function displayErrorMessage(error) {
    document.body.innerHTML = `<div style="padding: 50px; text-align: center;">
      <h2 style="color: red;">Lỗi Tải Dữ Liệu Trang Web</h2>
      <p>Không thể tải hoặc xử lý một hoặc nhiều file JSON trong thư mục <code>data/</code>.</p>
      <p><strong>Chi tiết lỗi:</strong> ${error.message}</p>
    </div>`;
  }

  function renderPage(allData) {
    document.title = allData.site.site_title || "Dịch Vụ Xe 7 Chỗ";
    renderHeader(allData.header);
    renderHero(allData.hero);
    renderAbout(allData.about);
    renderPricing(allData.pricing);
    renderContact(allData.contact);
    renderFooter(allData.footer);
    setupMobileMenu();
  }

  function renderHeader(headerData) {
    const logoPlaceholder = document.getElementById("logo-placeholder");
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (logoPlaceholder && headerData.logo) {
      const logoHTML = headerData.logo.type === "image"
        ? `<a href="${headerData.logo.link || "#"}"><img src="${headerData.logo.src}" alt="${headerData.logo.alt || "Logo"}"></a>`
        : `<a href="${headerData.logo.link || "#"}">${headerData.logo.content || "Logo"}</a>`;
      logoPlaceholder.outerHTML = `<div class="logo">${logoHTML}</div>`;
    }
    if (navPlaceholder && headerData.navigation) {
      const navList = headerData.navigation.map(item => `<li><a href="${item.link}">${item.label}</a></li>`).join("");
      navPlaceholder.outerHTML = `<nav><ul>${navList}</ul></nav>`;
    }
  }

  function renderHero(heroData) {
    const heroSection = document.getElementById("hero");
    if (heroSection && heroData) {
      const bgImage = heroData.background_image || 'images/hero-bg-placeholder.jpg';
      heroSection.style.backgroundImage = `url("${bgImage}")`;
      heroSection.innerHTML = `
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <h1>${heroData.title || "Tiêu đề mặc định"}</h1>
          <p>${heroData.subtitle || ""}</p>
          ${heroData.cta_button ? `<a href="${heroData.cta_button.link || "#"}" class="cta-button">${heroData.cta_button.text || "Nút CTA"}</a>` : ""}
        </div>`;
    }
  }

  function renderAbout(aboutData) {
    const aboutSection = document.getElementById("about");
    if (aboutSection && aboutData) {
      const hasImages = aboutData.images && aboutData.images.length > 0;
      const slidesHTML = hasImages ? aboutData.images.map(img =>
        `<div class="swiper-slide"><img src="${img.url}" alt="${img.alt || ''}"></div>`).join("")
        : `<div class="swiper-slide"><p>Không có hình ảnh để hiển thị.</p></div>`;
      aboutSection.innerHTML = `
        <div class="container">
          <h2>${aboutData.title || "Giới thiệu"}</h2>
          <div class="about-content">
            <div class="about-text">
              <p>${(aboutData.description || "").replace(/\n/g, "<br>")}</p>
            </div>
            <div class="about-images">
              <div class="swiper about-carousel">
                <div class="swiper-wrapper">${slidesHTML}</div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>`;
      new Swiper('.about-carousel', {
        loop: hasImages,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        spaceBetween: 10,
        autoplay: hasImages ? { delay: 5000, disableOnInteraction: false } : false,
      });
    }
  }

  function renderPricing(pricingData) {
    const pricingContainer = document.getElementById("pricing-container");
    if (pricingContainer && pricingData && pricingData.table) {
      const headers = pricingData.table.headers.map(h => `<th>${h}</th>`).join("");
      const rows = pricingData.table.rows.map(row =>
        `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("");
      pricingContainer.innerHTML = `
        <h2>${pricingData.title || "Bảng giá"}</h2>
        <div class="pricing-table-wrapper">
          <table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
        </div>
        ${pricingData.note ? `<p class="pricing-note">${pricingData.note}</p>` : ""}`;
    }
  }

  function renderContact(contactData) {
    const contactSection = document.getElementById("contact");
    if (contactSection && contactData) {
      const infoHTML = (contactData.info || []).map(item =>
        `<p><i class="${item.icon_class || ''}"></i> ${
          item.link ? `<a href="${item.link}" ${item.type === "zalo" ? 'target="_blank"' : ""}>${item.text}</a>` : (item.text || '')
        }</p>`).join("");
      const mapHTML = contactData.google_map_iframe_src
        ? `<div class="map-container"><iframe src="${contactData.google_map_iframe_src}" width="100%" height="300" style="border:0;" allowfullscreen loading="lazy"></iframe></div>` : "";
      const googleFormAction = "https://docs.google.com/forms/d/e/1FAIpQLScqFIwAwtQhORYKl4sioeT9rHrJsck7TxkEwEOsmkJ7iCU4Ug/formResponse";

      contactSection.innerHTML = `
        <div class="container">
          <h2>${contactData.title || "Liên hệ"}</h2>
          <div class="contact-content">
            <div class="contact-form-container">
              <form id="contact-form" action="${googleFormAction}" method="POST">
                <div class="form-group">
                  <label for="name">Họ tên:</label>
                  <input type="text" id="name" name="entry.551521474" required>
                </div>
                <div class="form-group">
                  <label for="phone">Số điện thoại:</label>
                  <input type="tel" id="phone" name="entry.259521136" required>
                </div>
                <div class="form-group">
                  <label for="itinerary">Lịch trình/Địa điểm:</label>
                  <textarea id="itinerary" name="entry.235100757" rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label for="notes">Ghi chú:</label>
                  <textarea id="notes" name="entry.1195433523" rows="3"></textarea>
                </div>
                <button type="submit" class="cta-button">${(contactData.form && contactData.form.submit_button_text) || "Gửi"}</button>
              </form>
            </div>
            <div class="contact-info-container">
              <h3>Thông tin liên lạc</h3>
              ${infoHTML}
              ${mapHTML}
            </div>
          </div>
        </div>`;

      const form = document.getElementById("contact-form");
      if (form) {
        form.addEventListener("submit", e => {
          e.preventDefault();
          const data = new FormData(form);
          fetch(googleFormAction, {
            method: "POST",
            mode: "no-cors",
            body: data
          }).then(() => {
            alert("✅ Gửi thành công!");
            form.reset();
          }).catch(() => {
            alert("❌ Lỗi kết nối. Vui lòng thử lại!");
          });
        });
      }
    }
  }

  function renderFooter(footerData) {
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer && footerData) {
      const socialLinks = (footerData.social_links || []).map(link =>
        `<a href="${link.url || '#'}" aria-label="${link.platform}" target="_blank"><i class="${link.icon_class || ''}"></i></a>`).join("");
      footerContainer.innerHTML = `
        <div class="footer-content">
          <div class="footer-info">
            <p><strong>${footerData.company_name || ""}</strong></p>
            ${footerData.tax_code ? `<p>${footerData.tax_code}</p>` : ''}
            ${footerData.address ? `<p>${footerData.address}</p>` : ''}
          </div>
          <div class="footer-social">${socialLinks}</div>
        </div>
        <div class="footer-copyright">
          <p>${footerData.copyright_text || ""}</p>
        </div>`;
    }
  }

  function setupMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector("#main-header nav ul");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        const icon = toggle.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      });
      nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          if (nav.classList.contains("active")) {
            nav.classList.remove("active");
            const icon = toggle.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
          }
        });
      });
    }
  }

  fetchAllData();
});
