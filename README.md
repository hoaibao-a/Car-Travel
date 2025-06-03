# Trang Web Dịch Vụ Xe 7 Chỗ (Quản lý bằng nhiều file JSON)

Đây là mã nguồn cho trang web tĩnh giới thiệu dịch vụ xe 7 chỗ. Điểm đặc biệt của phiên bản này là toàn bộ nội dung (văn bản, hình ảnh, bảng giá, liên kết...) được quản lý tập trung trong thư mục `data/` thông qua **nhiều file JSON riêng biệt** (ví dụ: `header.json`, `hero.json`, `about.json`...). JavaScript sẽ tự động đọc tất cả các file này và hiển thị nội dung tương ứng lên giao diện, giúp việc quản lý và cập nhật từng phần trở nên dễ dàng hơn.

## Cấu trúc thư mục

```
car_service_json_site/
├── css/
│   └── style.css         # File CSS chính cho giao diện
├── data/
│   ├── site.json         # Tiêu đề trang web
│   ├── header.json       # Dữ liệu logo và menu
│   ├── hero.json         # Dữ liệu phần hero (ảnh nền, tiêu đề, nút CTA)
│   ├── about.json        # Dữ liệu phần giới thiệu (mô tả, ảnh)
│   ├── pricing.json      # Dữ liệu bảng giá
│   ├── contact.json      # Dữ liệu phần liên hệ (thông tin, form, map)
│   └── footer.json       # Dữ liệu phần footer (tên công ty, social, copyright)
├── images/
│   └── ...               # Thư mục chứa hình ảnh (logo, hero, about...)
├── js/
│   └── script.js         # File JavaScript xử lý fetch nhiều JSON và render nội dung
├── index.html            # File HTML khung sườn chính
└── README.md             # File hướng dẫn này
```

## Cách cập nhật nội dung

Để thay đổi bất kỳ nội dung nào trên trang web, bạn **CHỈ CẦN** tìm đến file JSON tương ứng trong thư mục `data/` và chỉnh sửa nội dung bên trong bằng một trình soạn thảo văn bản (như Notepad++, VS Code, Sublime Text...). **Không cần chỉnh sửa file HTML hay JavaScript.**

**Ví dụ:**

*   **Thay đổi số điện thoại liên hệ:** Mở file `data/contact.json`, tìm đến mục `"info"` và thay đổi giá trị `"text"` và `"link"` cho mục có `"type": "phone"`.
*   **Cập nhật bảng giá:** Mở file `data/pricing.json`, tìm đến mục `"table"` -> `"rows"`. Sửa đổi các giá trị trong các mảng con tương ứng với từng hàng dịch vụ.
*   **Thay đổi ảnh hero:** Mở file `data/hero.json`, thay đổi giá trị của `"background_image"` thành đường dẫn tương đối đến file ảnh mới (ví dụ: `"images/new-hero.jpg"`). Đảm bảo bạn đã đặt file ảnh mới vào thư mục `images/`.
*   **Thêm mục menu:** Mở file `data/header.json`, tìm đến mảng `"navigation"` và thêm một đối tượng mới theo cấu trúc: `{ "label": "Tên mục mới", "link": "#id-section-moi" }`.

**Lưu ý quan trọng khi sửa file JSON:**

*   **Định dạng JSON:** Phải tuân thủ đúng cú pháp JSON (dấu ngoặc kép `"` cho key và value dạng chuỗi, dấu phẩy `,` giữa các phần tử, dấu ngoặc nhọn `{}` cho đối tượng, dấu ngoặc vuông `[]` cho mảng).
*   **Đường dẫn ảnh:** Sử dụng đường dẫn tương đối bắt đầu từ thư mục gốc của trang web (ví dụ: `images/my-logo.png`).
*   **Ký tự đặc biệt:** Nếu nội dung có dấu ngoặc kép `"`, bạn cần thêm dấu `\` phía trước (ví dụ: `"Đây là \"trích dẫn\""`). Nếu nội dung cần xuống dòng trong phần mô tả (như ở `about.json`), sử dụng `\n`.
*   **Kiểm tra sau khi sửa:** Sau khi sửa xong, bạn nên kiểm tra lại trang web (tốt nhất là trên môi trường deploy) để đảm bảo nội dung hiển thị đúng và không bị lỗi cú pháp JSON.

## Xem trước và Deploy

### Xem trước Local (Có thể gặp lỗi)

Bạn có thể mở file `index.html` trực tiếp bằng trình duyệt. Tuy nhiên, do cơ chế bảo mật của trình duyệt (CORS), JavaScript có thể **không** fetch được các file JSON khi mở trực tiếp từ file hệ thống (`file:///...`).

Bạn có thể chạy một server HTTP cục bộ đơn giản:

1.  Mở terminal hoặc command prompt trong thư mục `car_service_json_site`.
2.  Chạy lệnh: `python3 -m http.server 8000` (hoặc `python -m http.server 8000` nếu dùng Python 2, hoặc một cổng khác).
3.  Mở trình duyệt và truy cập `http://localhost:8000`.

**Lưu ý quan trọng khi chạy Local Server:** Một số server HTTP đơn giản (như `python -m http.server`) có thể không trả về đúng kiểu MIME (`application/json`) cho file `.json`. Điều này có thể khiến JavaScript không phân tích được dữ liệu và trang web hiển thị lỗi hoặc trang trắng. **Nếu gặp lỗi này khi chạy local, đừng lo lắng, hãy thử deploy lên các nền tảng bên dưới.**

### Deploy lên Vercel/Netlify (Khuyến nghị)

Cách tốt nhất để xem trước và chia sẻ trang web này là deploy lên các nền tảng hosting tĩnh miễn phí như Vercel hoặc Netlify. Các nền tảng này xử lý đúng kiểu MIME và cung cấp môi trường hoạt động ổn định.

1.  **Upload lên GitHub/GitLab/Bitbucket:** Đưa toàn bộ thư mục dự án `car_service_json_site` lên một repository Git.
2.  **Kết nối với Vercel/Netlify:**
    *   Đăng nhập vào Vercel hoặc Netlify.
    *   Chọn "Import Project" hoặc "New site from Git".
    *   Kết nối với tài khoản Git của bạn và chọn repository chứa mã nguồn.
    *   Vercel/Netlify thường tự nhận diện đây là dự án tĩnh, bạn chỉ cần giữ nguyên cài đặt mặc định và nhấn "Deploy".
3.  **Truy cập:** Sau vài phút, bạn sẽ có một đường link công khai để truy cập trang web.

Khi bạn cập nhật bất kỳ file JSON nào trong thư mục `data/` và đẩy thay đổi lên Git, Vercel/Netlify sẽ tự động deploy lại phiên bản mới.

Chúc bạn quản lý và vận hành trang web hiệu quả!

