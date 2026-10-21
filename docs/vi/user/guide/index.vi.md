# Sử dụng giao diện web

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.md)

Khởi động giao diện web thông qua [README ở thư mục gốc](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md#run); lệnh này sẽ in ra URL của giao diện. Hướng dẫn này bắt đầu sau khi máy chủ đó đã chạy. Tiến trình `dsh` sử dụng thư mục gọi lệnh làm vị trí hệ thống tệp mặc định, nhưng một giao diện web mới sẽ chưa có không gian làm việc nào được chọn cho đến khi bạn thêm một không gian làm việc.

## Cấu hình mô hình

Mở **Cài đặt → Mô hình**, nhập một [khóa API DeepSeek](https://platform.deepseek.com/), và lưu lại. Định tuyến mô hình có thể sử dụng được ngay lập tức mà không cần khởi động lại máy chủ.

Bài [hướng dẫn cấu hình mô hình](./providers.vi.md) đề cập đến các nhà cung cấp khác và các endpoint tùy chỉnh tương thích OpenAI.

## Chọn một không gian làm việc

Nhấp vào **Chọn không gian làm việc**, thêm thư mục dự án nơi bạn đã khởi chạy `dsh`, rồi chọn thư mục đó. Khung soạn thảo phiên sẽ tiếp tục không khả dụng cho đến khi bạn chọn một không gian làm việc.

## Chạy một tác vụ

Bắt đầu một phiên và gửi:

> Tóm tắt kho mã này và liệt kê các gói chính.

Tác tử có thể đọc và chỉnh sửa các tệp trong không gian làm việc, chạy lệnh, ủy quyền công việc, và duy trì một kế hoạch. Giao diện web sẽ hỏi trước các thao tác yêu cầu phê duyệt theo chính sách quyền hạn đang hoạt động.

## Tiếp tục

- [Cấu hình mô hình](./providers.vi.md)
- [Sử dụng Python SDK](./python-sdk.vi.md)
- [Xuất bản giao diện web phía sau một reverse proxy](./public-deployments.vi.md)
- [Sử dụng các chế độ CLI khác](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/README.md)
- [Phát triển plugin](../develop/basic/index.vi.md)
