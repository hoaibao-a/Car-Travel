document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Define paths for all JSON data files
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
            // Tạo object để lưu trữ dữ liệu
            const allData = {};
            
            // Fetch từng file JSON một cách tuần tự để dễ xác định lỗi
            for (const [key, url] of Object.entries(dataFiles)) {
                console.log(`Fetching ${url}...`); // Log đường dẫn file đang fetch
                const response = await fetch(url);
                
                // Kiểm tra nếu response không thành công (ví dụ: 404)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${url}`);
                }

                // Kiểm tra Content-Type
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.warn(`Received non-JSON content type: ${contentType} for ${url}. Attempting to parse anyway.`);
                }

                // Thử parse JSON và log lỗi nếu có
                try {
                    const data = await response.json();
                    allData[key] = data;
                    console.log(`Successfully fetched and parsed ${url}:`, data);
                } catch (parseError) {
                    console.error(`Failed to parse JSON for ${url}:`, parseError);
                    throw new Error(`Invalid JSON in ${url}: ${parseError.message}`);
                }
            }

            console.log("All data fetched successfully.");
            console.log("Combined data:", allData);
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
            <p>Chi tiết lỗi: ${error.message}</p>
            <p>Vui lòng kiểm tra xem tất cả các file JSON (site.json, header.json, ...) có tồn tại trong thư mục <code>data/</code> và có đúng định dạng JSON không.</p>
            <p><strong>Lưu ý:</strong> Nếu chạy trên server cục bộ (ví dụ: <code>python -m http.server</code>), hãy đảm bảo server trả về đúng kiểu MIME (application/json) cho file .json. Nếu vẫn lỗi, hãy thử deploy lên Vercel/Netlify.</p>
        </div>`;
    }

    function renderPage(allData) {
        console.log("Starting page rendering with combined data...");
        try {
            // Check if essential data exists
            if (!allData.site || !allData.header || !allData.hero || !allData.about || !allData.pricing || !allData.contact || !allData.footer) {
                throw new Error("Một hoặc nhiều phần dữ liệu thiết yếu bị thiếu.");
            }

            // Set Page Title (from site.json)
            document.title = allData.site.site_title || "Dịch Vụ Xe 7 Chỗ";
            console.log("Page title set.");

            // Render Header (from header.json)
            renderHeader(allData.header);
            console.log("Header rendered.");

            // Render Hero (from hero.json)
            renderHero(allData.hero);
            console.log("Hero rendered.");

            // Render About (from about.json)
            renderAbout(allData.about);
            console.log("About rendered.");

            // Render Pricing (from pricing.json)
            renderPricing(allData.pricing);
            console.log("Pricing rendered.");

            // Render Contact (from contact.json)
            renderContact(allData.contact);
            console.log("Contact rendered.");

            // Render Footer (from footer.json)
            renderFooter(allData.footer);
            console.log("Footer rendered.");

            // Setup Mobile Menu Toggle (after header is rendered)
            setupMobileMenu();
            console.log("Mobile menu setup.");

            console.log("Page rendering complete.");
        } catch (renderError) {
            console.error("Error during page rendering:", renderError);
            document.body.innerHTML += `<p style="color: orange; text-align: center; padding: 20px;">Lỗi hiển thị nội dung: ${renderError.message}. Vui lòng kiểm tra cấu trúc file JSON tương ứng.</p>`;
        }
    }

    // --- Rendering Functions (Updated to accept specific data objects) ---

    function renderHeader(headerData) {
        try {
            const logoPlaceholder = document.getElementById("logo-placeholder");
            const navPlaceholder = document.getElementById("nav-placeholder");

            if (logoPlaceholder && headerData.logo) {
                let logoHTML = '';
                if (headerData.logo.type === "image" && headerData.logo.src) {
                    logoHTML = `<a href="${headerData.logo.link || "#"}"><img src="${headerData.logo.src}" alt="${headerData.logo.alt || "Logo"}"></a>`;
                } else {
                    logoHTML = `<a href="${headerData.logo.link || "#"}">${headerData.logo.content || "Logo"}</a>`;
                }
                logoPlaceholder.outerHTML = `<div class="logo">${logoHTML}</div>`;
            }

            if (navPlaceholder && headerData.navigation) {
                const navList = headerData.navigation.map(item =>
                    `<li><a href="${item.link}">${item.label}</a></li>`
                ).join("");
                navPlaceholder.outerHTML = `<nav><ul>${navList}</ul></nav>`;
            }
        } catch (e) {
            console.error("Error rendering header:", e);
            throw e;
        }
    }

    function renderHero(heroData) {
        try {
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
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error rendering hero:", e);
            throw e;
        }
    }

    function renderAbout(aboutData) {
        try {
            const aboutSection = document.getElementById("about");
            if (aboutSection && aboutData) {
                const imagesHTML = (aboutData.images || []).map(img =>
                    `<img src="${img.url || ''}" alt="${img.alt || ''}">`
                ).join("");

                aboutSection.innerHTML = `
                    <div class="container">
                        <h2>${aboutData.title || "Giới thiệu"}</h2>
                        <div class="about-content">
                            <div class="about-text">
                                <p>${(aboutData.description || "").replace(/\n/g, "<br>")}</p>
                            </div>
                            <div class="about-images">
                                ${imagesHTML}
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error rendering about:", e);
            throw e;
        }
    }

    function renderPricing(pricingData) {
        try {
            const pricingContainer = document.getElementById("pricing-container");
            if (pricingContainer && pricingData && pricingData.table) {
                const tableHeaders = (pricingData.table.headers || []).map(header => `<th>${header}</th>`).join("");
                const tableRows = (pricingData.table.rows || []).map(row => {
                    const cells = (row || []).map(cell => `<td>${cell}</td>`).join("");
                    return `<tr>${cells}</tr>`;
                }).join("");

                pricingContainer.innerHTML = `
                    <h2>${pricingData.title || "Bảng giá"}</h2>
                    <div class="pricing-table-wrapper">
                        <table>
                            <thead>
                                <tr>${tableHeaders}</tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    ${pricingData.note ? `<p class="pricing-note">${pricingData.note}</p>` : ""}
                `;
            }
        } catch (e) {
            console.error("Error rendering pricing:", e);
            throw e;
        }
    }

    function renderContact(contactData) {
        try {
            const contactSection = document.getElementById("contact");
            if (contactSection && contactData) {
                const contactInfoHTML = (contactData.info || []).map(item =>
                    `<p><i class="${item.icon_class || ''}"></i> ${item.link ? `<a href="${item.link}" ${item.type === "zalo" ? "target=\"_blank\"" : ""}>${item.text || ''}</a>` : (item.text || '')}</p>`
                ).join("");

                const mapHTML = contactData.google_map_iframe_src ? `
                    <div class="map-container">
                        <iframe src="${contactData.google_map_iframe_src}" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>` : "";

                contactSection.innerHTML = `
                    <div class="container">
                        <h2>${contactData.title || "Liên hệ"}</h2>
                        <div class="contact-content">
                            <div class="contact-form-container">
                                <form action="#" method="post">
                                    <div class="form-group">
                                        <label for="name">Họ tên:</label>
                                        <input type="text" id="name" name="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Số điện thoại:</label>
                                        <input type="tel" id="phone" name="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="itinerary">Lịch trình/Địa điểm:</label>
                                        <textarea id="itinerary" name="itinerary" rows="4" required></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="notes">Ghi chú:</label>
                                        <textarea id="notes" name="notes" rows="3"></textarea>
                                    </div>
                                    <button type="submit" class="cta-button">${(contactData.form && contactData.form.submit_button_text) || "Gửi"}</button>
                                </form>
                            </div>
                            <div class="contact-info-container">
                                <h3>Thông tin liên lạc</h3>
                                ${contactInfoHTML}
                                ${mapHTML}
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error rendering contact:", e);
            throw e;
        }
    }

    function renderFooter(footerData) {
        try {
            const footerContainer = document.getElementById("footer-container");
            if (footerContainer && footerData) {
                const socialLinksHTML = (footerData.social_links || []).map(link =>
                    `<a href="${link.url || '#'}" aria-label="${link.platform || ''}" target="_blank"><i class="${link.icon_class || ''}"></i></a>`
                ).join("");

                footerContainer.innerHTML = `
                    <div class="footer-content">
                        <div class="footer-info">
                            <p><strong>${footerData.company_name || ""}</strong></p>
                            ${footerData.tax_code ? `<p>${footerData.tax_code}</p>` : ''}
                            ${footerData.address ? `<p>${footerData.address}</p>` : ''}
                        </div>
                        <div class="footer-social">
                            ${socialLinksHTML}
                        </div>
                    </div>
                    <div class="footer-copyright">
                        <p>${footerData.copyright_text || ""}</p>
                    </div>
                `;
            }
        } catch (e) {
            console.error("Error rendering footer:", e);
            throw e;
        }
    }

    function setupMobileMenu() {
        try {
            const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
            const nav = document.querySelector("#main-header nav ul");

            if (mobileMenuToggle && nav) {
                mobileMenuToggle.addEventListener("click", () => {
                    nav.classList.toggle("active");
                    const icon = mobileMenuToggle.querySelector("i");
                    if (nav.classList.contains("active")) {
                        icon.classList.remove("fa-bars");
                        icon.classList.add("fa-times");
                    } else {
                        icon.classList.remove("fa-times");
                        icon.classList.add("fa-bars");
                    }
                });

                nav.querySelectorAll("a").forEach(link => {
                    link.addEventListener("click", () => {
                        if (nav.classList.contains("active")) {
                            nav.classList.remove("active");
                            const icon = mobileMenuToggle.querySelector("i");
                            icon.classList.remove("fa-times");
                            icon.classList.add("fa-bars");
                        }
                        
                    });
                });
            }
        } catch (e) {
            console.error("Error setting up mobile menu:", e);
            throw e;
        }
    }

    // Initial fetch of all data
    fetchAllData();
});