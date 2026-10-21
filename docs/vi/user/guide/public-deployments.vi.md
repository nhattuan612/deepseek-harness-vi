# Xuất bản Web UI phía sau một proxy ngược

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/public-deployments.md)

`dsh --profile web` phục vụ GUI trên một cổng loopback, do đó trình duyệt trên máy khác không thể truy cập được, và tiến trình hoàn toàn không biết địa chỉ thực tế mà bạn sử dụng. Một proxy ngược đặt phía trước nó sẽ đảm nhận chặng kết nối bên ngoài đó — tên host công khai, TLS, và tiền tố đường dẫn (path prefix) mà proxy loại bỏ trước khi chuyển tiếp tiếp tới listener — và `--public-url` sẽ cho DSH biết địa chỉ mà các trình duyệt sử dụng:

```sh
dsh --profile web --public-url https://app.example/ui/ --trusted-host app.example
```

## Những gì `--public-url` công bố

`--public-url` chấp nhận một gốc `http://` hoặc `https://` với một tiền tố mount tùy chọn và chuẩn hóa nó để kết thúc bằng `/`. Nó cung cấp URL khởi động được in ra và mở tự động, biến môi trường `DSH_WEB_URL`, và URL Web GUI trong runtime context của agent. Web server vẫn tiếp tục phục vụ các đường dẫn gốc (origin-root) và không bao giờ cần biết về mount prefix. Trường cấu hình `publicUrl` cũng công bố thông tin tương tự.

## Những việc proxy bắt buộc phải làm

- **Bảo toàn `Host` mà trình duyệt gửi lên.** Cơ chế kiểm tra (fence) so sánh header `Host` nhận được với các authority được chấp nhận, do đó proxy phải chuyển tiếp nguyên vẹn thay vì viết lại thành địa chỉ của listener.
- **Loại bỏ tiền tố đường dẫn.** Máy chủ chỉ phản hồi các đường dẫn gốc, do đó một yêu cầu gửi tới `/ui/api/...` phải đến máy chủ dưới dạng `/api/...`.
- **Chuyển tiếp các nâng cấp kết nối (forward upgrades).** Mọi yêu cầu và nâng cấp WebSocket mà trang web mở ra đều phải đến được listener với các header `Upgrade` và `Connection` nguyên vẹn; TLS sẽ kết thúc tại chặng bên ngoài của proxy khi phục vụ HTTPS.
- **Viết lại phạm vi cookie (rewrite cookie scope).** Một backend phục vụ HTTP thông thường sẽ phát hành cookie host-only có `Path=/` mà không có thuộc tính `Secure`; proxy sau đó phải viết lại `Path` thành đường dẫn mount (`/ui/`) và thêm `Secure` trên chặng HTTPS của nó. Một backend máy chủ tự phục vụ TLS của riêng nó đã đánh dấu cookie là `Secure`, vì vậy proxy chỉ cần viết lại `Path`.
- **Chuyển hướng đường dẫn mount trần (redirect bare mount).** `/ui/` là điểm vào duy nhất: chỉ riêng nó mới đổi launch token lấy session cookie, và nó hoặc `/ui/index.html` sẽ phục vụ tài liệu cho trình duyệt đã nắm giữ cookie đó, bởi vì tài liệu được phục vụ sẽ phân giải URL tương đối dựa trên thư mục của chính nó. Yêu cầu gửi tới `/ui` phải đến dưới dạng `/ui/`, và backend đã bị loại bỏ tiền tố không thể tái tạo lại đường dẫn bên ngoài đó.

## Cho phép địa chỉ trình duyệt sử dụng

Cơ chế fence chấp nhận loopback, địa chỉ bind của chính listener, và mọi authority được đặt tên trong `--trusted-host`. Trình duyệt truy cập bản triển khai dưới bất kỳ authority nào khác sẽ nhận lỗi 403 cho mọi lệnh gọi API, bất kể proxy được cấu hình đúng ra sao, do đó hãy khai báo authority hiển thị với trình duyệt bằng `--trusted-host`; việc chỉ công bố nó qua `--public-url` chỉ mang tính hiển thị và không cấp quyền truy cập. Một mục cấu hình không có cổng sẽ khớp với bất kỳ cổng nào, rất phù hợp cho tunnel liên kết với một cổng khác nhau mỗi lần chạy. Cơ chế fence chỉ tiếp nhận yêu cầu; launch token trong URL được in ra và session cookie đã ký sẽ chịu trách nhiệm xác thực. TLS, dù kết thúc ở đâu, cũng không thay đổi điều này: chứng chỉ xác thực máy chủ với trình duyệt, chứ không phải trình duyệt với máy chủ.

Cả URL được công bố lẫn cơ chế fence đều không bảo vệ chính cổng đang lắng nghe, vì vậy hãy giới hạn cổng đó chỉ cho proxy hoặc mạng đáng tin cậy.

## Bảo mật chặng kết nối bên ngoài

Kết thúc TLS tại proxy, tại chính listener, hoặc cả hai; `--public-url` vẫn chỉ là thông tin công bố. Một gốc `http://` hiển thị với trình duyệt sẽ làm lộ launch token dưới dạng văn bản thuần (plaintext). Một gốc proxy `https://` bảo vệ chặng từ trình duyệt đến proxy; việc mã hóa giữa proxy và listener phụ thuộc vào cấu hình TLS của listener.

Để kết thúc TLS ngay trên listener, truyền `--tls-cert` và `--tls-key`, mỗi tham số là một đường dẫn được phân giải theo thư mục làm việc của tiến trình: tệp chứng chỉ chứa chuỗi đầy đủ (full chain) và tệp khóa chứa khóa riêng PEM không mã hóa. DSH không bao giờ tự lấy, gia hạn hay theo dõi chứng chỉ, và carrier chỉ đọc các tệp này một lần, vì vậy hãy thay thế chúng và tải lại máy chủ hoặc khởi động lại tiến trình để áp dụng thay đổi; quá trình khởi động sẽ thất bại nếu cặp tệp bị thiếu hoặc không hợp lệ và không bao giờ tự lùi về HTTP. Trình duyệt áp dụng trust store và quy tắc kiểm tra tên của riêng nó, do đó chứng chỉ phải bao gồm hostname hoặc IP bạn mở. Cổng mặc định vẫn là 3080. TLS native không cần proxy, nhưng việc triển khai qua proxy và `--public-url` vẫn được hỗ trợ độc lập. Một TLS listener sẽ đánh dấu các session cookie là `Secure`; hãy giữ cho chặng công khai hiển thị với trình duyệt là HTTPS để các trình duyệt có thể gửi lại những cookie đó.

URL được in ra mang theo thông tin xác thực của tiến trình, vì vậy chỉ chia sẻ nó với những người dùng dự kiến.

[Tài liệu tham khảo Web app](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/web-app/README.md#public-deployments) ghi lại chi tiết các tùy chọn dòng lệnh `--public-url`, `--trusted-host`, và `--tls-cert`/`--tls-key`. Trong profile Web, `publicUrl` định cấu hình cho hàng `web-runtime`, `trustedHosts` định cấu hình cho [hàng Connection](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/connection/README.md), và `tls` định cấu hình cho [hàng webserver](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/web-server.md#config).
