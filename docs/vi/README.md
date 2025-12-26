# Chào mừng đến với Synura!

## Synura là gì?
Synura là một ứng dụng đa năng cho phép bạn duyệt nội dung từ nhiều nguồn khác nhau bằng cách sử dụng các ứng dụng nhỏ mạnh mẽ được gọi là "tiện ích mở rộng" (extensions). Hãy nghĩ về nó như một trình duyệt, nhưng thay vì các trang web, bạn sử dụng các tiện ích mở rộng để lấy nội dung ở định dạng ứng dụng gốc sạch sẽ.

## Các khái niệm cốt lõi cho người dùng

*   **Khám phá tiện ích mở rộng**: Nhập một tên miền (ví dụ: `example.com` hoặc `https://example.com`) để tự động tải tệp `synura.js` từ tên miền đó. Nếu không có giao thức nào được cung cấp, `https://` sẽ được sử dụng theo mặc định. Đây là cách chính để cài đặt các tiện ích mở rộng từ các trang web chính thức của chúng.
*   **Cài đặt trực tiếp**: Nhập URL đầy đủ (ví dụ: `https://raw.githubusercontent.com/user/repo/main/synura.js`) để cài đặt một tập lệnh tiện ích mở rộng cụ thể. **Lưu ý bảo mật**: Phương pháp này bị hạn chế đối với các tên miền đáng tin cậy (như GitHub, GitLab, v.v.) để ngăn chặn việc thực thi mã độc hại. Không sử dụng cách này cho các tên miền chung.
*   **Xác thực danh sách trắng**: Các cài đặt URL trực tiếp được xác thực dựa trên danh sách trắng các tên miền được phép để bảo mật. Khám phá tên miền bỏ qua kiểm tra này để cho phép thăm dò.
*   **Tiện ích mở rộng**: Đây là những plugin nhỏ giúp lấy và hiển thị nội dung. Ví dụ: bạn có thể có tiện ích mở rộng cho trang tin tức, nền tảng video hoặc nguồn cấp dữ liệu mạng xã hội. Bạn có thể cài đặt các tiện ích mở rộng mới để mở rộng những gì bạn có thể làm với Synura.
*   **Runtimes (Môi trường chạy)**: Khi bạn mở một tiện ích mở rộng, nó sẽ chạy trong một "runtime". Bạn có thể mở nhiều runtime cùng lúc, giống như có nhiều tab trong trình duyệt web. Mỗi runtime là một phiên bản riêng biệt của một tiện ích mở rộng. Bạn có thể chuyển đổi giữa chúng và thậm chí có nhiều runtime cho cùng một tiện ích mở rộng.
*   **Dấu trang**: Tìm thấy điều gì đó thú vị? Bạn có thể đánh dấu chế độ xem hiện tại để lưu lại sau. Dấu trang lưu trạng thái chính xác của chế độ xem, vì vậy bạn có thể quay lại bất cứ lúc nào.

## Điều hướng trong ứng dụng

### Màn hình chính
Màn hình chính của ứng dụng là nơi bạn quản lý các runtime của mình. Thanh trên cùng (thanh ứng dụng) là công cụ điều hướng chính của bạn.

### Thanh ứng dụng

Thanh ứng dụng có một số biểu tượng giúp bạn điều hướng và quản lý nội dung của mình. Một số biểu tượng có **lối tắt ẩn** được truy cập bằng cách nhấn giữ:

*   **`+` (Thêm)**:
    *   **Nhấn**: Mở một runtime mới. Bạn có thể chọn một tiện ích mở rộng đã cài đặt hoặc nhập tên miền/URL trang web để cài đặt một tiện ích mới.
    *   **Nhấn giữ**: Mở màn hình **Quản lý tiện ích mở rộng** để xem chi tiết về các tiện ích mở rộng đã cài đặt của bạn.
*   **Menu thả xuống (trung tâm)**: Hiển thị runtime đang hoạt động. Nhấn để chuyển đổi giữa các runtime đang mở hoặc vuốt sang trái/phải trên menu thả xuống để chuyển qua lại giữa chúng.
*   **`X` (Đóng)**: Đóng runtime hiện tại.
*   **`↻` (Cập nhật)**: *Chỉ hiển thị trong Chế độ nhà phát triển.* Cập nhật tiện ích mở rộng hiện tại từ nguồn của nó.
*   **`✨` (AI)**:
    *   **Nhấn**: Mở **Menu AI** để thực hiện các hành động nhanh (Tóm tắt, Dịch, v.v.).
    *   **Nhấn giữ**: Mở **Cài đặt AI** để định cấu hình nhà cung cấp và tùy chọn.
*   **`☆` (Thêm dấu trang)**:
    *   **Nhấn**: Lưu chế độ xem hiện tại vào dấu trang của bạn.
    *   **Nhấn giữ**: Đi trực tiếp đến danh sách **Dấu trang** của bạn.
*   **`🔖` (Dấu trang)**: Xem danh sách các dấu trang đã lưu của bạn.
*   **`⚙️` (Cài đặt)**: Mở màn hình cài đặt chính.

Nếu màn hình quá hẹp, một số tùy chọn có thể di chuyển vào menu ba chấm.

### Nút AI (`✨`)
Nhấn vào **nút AI** trên thanh ứng dụng để mở **Hộp thoại Menu AI**. Điều này cung cấp cho bạn các tính năng hỗ trợ AI theo yêu cầu cho chế độ xem hiện tại:

*   **Tóm tắt**: Nhận bản tóm tắt nội dung trên màn hình do AI tạo nhanh chóng.
*   **Dịch**: Dịch nội dung sang ngôn ngữ đích của bạn (được định cấu hình trong Cài đặt AI).
*   **Lời nhắc tùy chỉnh**: Nhập hướng dẫn của riêng bạn để AI phân tích nội dung.
*   **Chia sẻ với AI bên ngoài**: Xuất nội dung của chế độ xem hiện tại sang các ứng dụng AI bên ngoài như ChatGPT hoặc Gemini trên thiết bị của bạn.
*   **Chuyển đổi bộ nhớ đệm**: Kiểm soát xem có sử dụng kết quả AI đã lưu trong bộ nhớ đệm hay buộc phân tích mới.

Để định cấu hình AI chi tiết, hãy đi tới **Cài đặt > Cài đặt AI**, nơi bạn có thể:
*   Định cấu hình nhà cung cấp AI ưa thích của bạn (Gemini, OpenAI, DeepSeek, Claude).
*   Đặt ngôn ngữ nguồn và đích cho bản dịch.
*   Chọn phạm vi tìm kiếm phân tích (Sâu chỉ có trong Chế độ xem danh sách) và hồ sơ (Tóm tắt, Giải thích, Đơn giản hóa, Kiểm tra sự thật, Phê bình, Thông tin chi tiết).
*   Điều chỉnh tùy chọn độ dài tóm tắt.
*   Xem thống kê sử dụng token.
*   Quản lý khóa API cho từng nhà cung cấp.

### Dấu trang
Màn hình dấu trang hiển thị tất cả các chế độ xem đã lưu của bạn.

*   **Ảnh chụp nhanh chế độ xem**: Nhấn vào dấu trang sẽ mở ra **ảnh chụp nhanh được lưu trong bộ nhớ đệm** của trang giống như khi bạn lưu nó. Điều này rất tốt để tham khảo nhanh thông tin mà không cần kết nối internet.
*   **Khôi phục chế độ xem**: Để tương tác lại với trang (ví dụ: nhấp vào liên kết, làm mới dữ liệu), hãy tìm **biểu tượng khôi phục**. Nhấn vào đây sẽ kết nối lại với tiện ích mở rộng và đưa chế độ xem trở lại hoạt động trong một runtime mới.

## Cài đặt (`⚙️`)

Màn hình cài đặt cho phép bạn tinh chỉnh hầu hết mọi khía cạnh trong trải nghiệm Synura của mình.

### Tiện ích mở rộng
*   **Cài đặt tiện ích mở rộng mới**: Nhấn vào nút **`+`** trên thanh ứng dụng và nhập tên miền trang web (ví dụ: `https://example.com`). Nếu trang web hỗ trợ Synura, tiện ích mở rộng sẽ tự động được phát hiện và cài đặt.
*   **Quản lý tiện ích mở rộng**: Nhấn vào **Quản lý** để xem danh sách các tiện ích mở rộng đã cài đặt của bạn, nơi bạn có thể cập nhật hoặc xóa chúng.

### Giao diện
*   **Điều chỉnh mật độ nội dung**: Sử dụng thanh trượt để làm cho nội dung có vẻ giãn cách hơn hoặc gọn gàng hơn. Bạn sẽ thấy bản xem trước trực tiếp về cách nó ảnh hưởng đến danh sách và thẻ.
*   **Chủ đề màu sắc**: Cá nhân hóa giao diện của ứng dụng bằng cách chọn giữa các phối màu **Sáng**, **Tối** và **Monokai**.
*   **Độ đậm phông chữ**: Điều chỉnh độ đậm của văn bản theo sở thích của bạn (ví dụ: mảnh, thường, đậm).
*   **Ngôn ngữ**: Đặt ngôn ngữ ứng dụng. Bạn có thể chọn một ngôn ngữ cụ thể hoặc để nó theo mặc định của hệ thống.

### Hành vi
*   **Thời gian chờ mạng**: Đặt thời gian ứng dụng sẽ đợi phản hồi từ yêu cầu mạng, từ 1 đến 60 giây.
*   **Cài đặt proxy**: Định cấu hình máy chủ proxy cho các yêu cầu mạng.
*   **Cài đặt bộ nhớ đệm**: Quản lý bộ nhớ đệm của ứng dụng, bao gồm xóa dữ liệu đã lưu trong bộ nhớ đệm để giải phóng dung lượng.
*   **Hoạt ảnh GIF**: Kiểm soát cách phát GIF động: **Tắt** (hình ảnh tĩnh), **Một lần** (phát một lần) hoặc **Lặp lại** (phát liên tục).

### Video & Âm thanh
*   **Tự động phát video**: Một công tắc để kiểm soát xem video có bắt đầu phát tự động khi chúng xuất hiện trên màn hình hay không.
*   **Phát video nền**: Bật tính năng này để tiếp tục nghe âm thanh từ video ngay cả sau khi điều hướng đi nơi khác hoặc chuyển sang ứng dụng khác.
*   **Trộn với âm thanh khác**: Cho phép âm thanh từ Synura phát cùng lúc với âm thanh từ các ứng dụng khác.
*   **Giờ DVR phát trực tiếp**: Đối với các luồng trực tiếp, hãy chọn số giờ phát sóng cần giữ để tua lại (từ 0 đến 6 giờ).

### Quyền riêng tư & Bảo mật
*   **Quản lý cài đặt**: Định cấu hình các tùy chọn quyền riêng tư và bảo mật khác nhau để kiểm soát dữ liệu nào được lưu trữ và chia sẻ.

### Giới thiệu
*   **Giấy phép nguồn mở**: Xem giấy phép của phần mềm nguồn mở giúp vận hành Synura.

---
*Tài liệu này dành cho người dùng cuối. Đối với tài liệu dành cho nhà phát triển, vui lòng xem [Bắt đầu](getting_started.md), [Tham khảo API](api_reference.md) và [Ví dụ](examples.md).*