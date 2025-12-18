# Chào mừng đến với Synura!

## Synura là gì?
Synura là một ứng dụng đa năng cho phép bạn duyệt nội dung từ nhiều nguồn khác nhau bằng cách sử dụng các ứng dụng nhỏ mạnh mẽ được gọi là "tiện ích mở rộng" (extensions). Hãy nghĩ về nó giống như một trình duyệt, nhưng thay vì các trang web, bạn sử dụng các tiện ích mở rộng để lấy nội dung ở định dạng ứng dụng gốc, sạch sẽ.

## Các khái niệm cốt lõi cho người dùng

*   **Khám phá tiện ích mở rộng**: Nhập một miền (ví dụ: `example.com` hoặc `https://example.com`) để tự động lấy tệp `synura.js` từ miền đó. Nếu không có giao thức nào được cung cấp, `https://` sẽ được sử dụng theo mặc định. Đây là cách chính để cài đặt các tiện ích mở rộng từ trang web chính thức của chúng.
*   **Cài đặt trực tiếp**: Nhập URL đầy đủ (ví dụ: `https://raw.githubusercontent.com/user/repo/main/synura.js`) để cài đặt một tập lệnh tiện ích mở rộng cụ thể. **Lưu ý bảo mật**: Phương pháp này bị hạn chế đối với các miền đáng tin cậy (như GitHub, GitLab, v.v.) để ngăn chặn việc thực thi mã độc hại. Không sử dụng phương pháp này cho các miền chung.
*   **Xác thực danh sách trắng**: Các cài đặt URL trực tiếp được xác thực dựa trên danh sách trắng các miền được phép để bảo mật. Khám phá miền bỏ qua kiểm tra này để cho phép khám phá.
*   **Tiện ích mở rộng**: Đây là những plugin nhỏ lấy và hiển thị nội dung. Ví dụ: bạn có thể có tiện ích mở rộng cho trang tin tức, nền tảng video hoặc nguồn cấp dữ liệu mạng xã hội. Bạn có thể cài đặt các tiện ích mở rộng mới để mở rộng những gì bạn có thể làm với Synura.
*   **Thời gian chạy (Runtimes)**: Khi bạn mở một tiện ích mở rộng, nó sẽ chạy trong một "thời gian chạy". Bạn có thể mở nhiều thời gian chạy cùng một lúc, giống như có nhiều tab trong trình duyệt web. Mỗi thời gian chạy là một phiên bản riêng biệt của một tiện ích mở rộng. Bạn có thể chuyển đổi giữa chúng và thậm chí có nhiều thời gian chạy cho cùng một tiện ích mở rộng.
*   **Dấu trang**: Tìm thấy điều gì đó thú vị? Bạn có thể đánh dấu trang chế độ xem hiện tại để lưu lại sau. Dấu trang lưu trạng thái chính xác của chế độ xem, vì vậy bạn có thể quay lại bất cứ lúc nào.

## Điều hướng trong ứng dụng

### Màn hình chính
Màn hình chính của ứng dụng là nơi bạn quản lý thời gian chạy của mình. Thanh trên cùng (thanh ứng dụng) là công cụ điều hướng chính của bạn.

### Thanh ứng dụng

Thanh ứng dụng có một số biểu tượng:

*   **`+` (Thêm)**: Nhấn vào đây để mở một thời gian chạy mới. Bạn có thể chọn một tiện ích mở rộng đã cài đặt hoặc nhập miền trang web để cài đặt một tiện ích mở rộng mới.
*   **Menu thả xuống (giữa)**: Hiển thị thời gian chạy đang hoạt động hiện tại. Nhấn vào nó để xem danh sách tất cả các thời gian chạy đang mở của bạn và chuyển đổi giữa chúng. Bạn cũng có thể vuốt sang trái hoặc phải trên menu thả xuống để chuyển đổi nhanh chóng.
*   **`X` (Đóng)**: Đóng thời gian chạy hiện tại.
*   **`☆` (Thêm dấu trang)**: Nhấn vào đây để lưu chế độ xem hiện tại vào dấu trang của bạn.
*   **`🔖` (Dấu trang)**: Đưa bạn đến danh sách các dấu trang đã lưu.
*   **`⚙️` (Cài đặt)**: Mở màn hình cài đặt, nơi bạn có thể tùy chỉnh Synura.

Nếu màn hình quá hẹp, các tùy chọn này sẽ được thu gọn vào menu ba chấm ở bên phải.

### Dấu trang
Màn hình dấu trang hiển thị tất cả các chế độ xem đã lưu của bạn.

*   **Ảnh chụp nhanh chế độ xem**: Nhấn vào dấu trang sẽ mở **ảnh chụp nhanh được lưu trong bộ nhớ cache** của trang giống như khi bạn lưu nó. Điều này rất tốt để tham khảo nhanh thông tin mà không cần kết nối internet.
*   **Khôi phục chế độ xem**: Để tương tác lại với trang (ví dụ: nhấp vào liên kết, làm mới dữ liệu), hãy tìm **biểu tượng khôi phục**. Nhấn vào đây sẽ kết nối lại với tiện ích mở rộng và đưa chế độ xem trở lại hoạt động trong thời gian chạy mới.

## Cài đặt (`⚙️`)

Màn hình cài đặt cho phép bạn tinh chỉnh gần như mọi khía cạnh trong trải nghiệm Synura của mình.

### Tiện ích mở rộng
*   **Cài đặt tiện ích mở rộng mới**: Nhấn nút **`+`** trên thanh ứng dụng và nhập miền trang web (ví dụ: `https://example.com`). Nếu trang web hỗ trợ Synura, tiện ích mở rộng sẽ được tự động phát hiện và cài đặt.
*   **Quản lý tiện ích mở rộng**: Nhấn **Quản lý** để xem danh sách các tiện ích mở rộng đã cài đặt của bạn, nơi bạn có thể cập nhật hoặc xóa chúng.

### Giao diện
*   **Điều chỉnh mật độ nội dung**: Sử dụng thanh trượt để làm cho nội dung hiển thị thưa hơn hoặc gọn hơn. Bạn sẽ thấy bản xem trước trực tiếp về cách nó ảnh hưởng đến danh sách và thẻ.
*   **Chủ đề màu sắc**: Cá nhân hóa giao diện của ứng dụng bằng cách chọn giữa các bảng màu **Sáng**, **Tối** và **Monokai**.
*   **Độ đậm phông chữ**: Điều chỉnh độ đậm của văn bản theo sở thích của bạn (ví dụ: nhẹ, thường, đậm).
*   **Ngôn ngữ**: Đặt ngôn ngữ ứng dụng. Bạn có thể chọn một ngôn ngữ cụ thể hoặc để ngôn ngữ đó tuân theo mặc định của hệ thống.

### Hành vi
*   **Thời gian chờ mạng**: Đặt thời gian ứng dụng sẽ đợi phản hồi từ yêu cầu mạng, từ 1 đến 60 giây.
*   **Cài đặt Proxy**: Định cấu hình máy chủ proxy cho các yêu cầu mạng.
*   **Cài đặt bộ nhớ cache**: Quản lý bộ nhớ cache của ứng dụng, bao gồm xóa dữ liệu đã lưu trong bộ nhớ cache để giải phóng dung lượng.
*   **Hoạt ảnh GIF**: Kiểm soát cách phát ảnh GIF động: **Tắt** (hình ảnh tĩnh), **Một lần** (phát một lần) hoặc **Lặp lại** (phát liên tục).

### Video & Âm thanh
*   **Tự động phát video**: Một công tắc để kiểm soát xem video có tự động bắt đầu phát khi chúng xuất hiện trên màn hình hay không.
*   **Phát nền video**: Bật tính năng này để tiếp tục nghe âm thanh từ video ngay cả sau khi bạn điều hướng đi nơi khác hoặc chuyển sang ứng dụng khác.
*   **Trộn với các ứng dụng khác**: Cho phép âm thanh từ Synura phát cùng lúc với âm thanh từ các ứng dụng khác.
*   **Giờ DVR phát trực tiếp**: Đối với các luồng trực tiếp, hãy chọn số giờ phát sóng cần giữ lại để tìm kiếm ngược lại (từ 0 đến 6 giờ).

### Quyền riêng tư & Bảo mật
*   **Quản lý cài đặt**: Định cấu hình các tùy chọn quyền riêng tư và bảo mật khác nhau để kiểm soát dữ liệu nào được lưu trữ và chia sẻ.

### Giới thiệu
*   **Giấy phép nguồn mở**: Xem giấy phép của phần mềm nguồn mở giúp vận hành Synura.

---
*Tài liệu này dành cho người dùng cuối. Đối với tài liệu dành cho nhà phát triển, vui lòng xem [Bắt đầu](getting_started.md), [Tham chiếu API](api_reference.md), và [Ví dụ](examples.md).*