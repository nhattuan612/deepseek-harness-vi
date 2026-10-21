# DeepSeek Harness — Tiếng Việt

Gói ngôn ngữ tiếng Việt cho giao diện web DeepSeek Harness, kèm hướng dẫn sử dụng tiếng Việt. Plugin dùng API language-pack chính thức của Harness: đăng ký locale `vi` và các từ điển giao diện qua `ctx.locale`, không vá tệp của Harness. Vì vậy cập nhật Harness không ghi đè bản dịch; CI của repo theo dõi khóa và chuỗi nguồn upstream, rồi báo lỗi nếu cần cập nhật bản dịch.

## Cài đặt

```sh
dsh plugin --profile web add github:nhattuan612/deepseek-harness-vi
dsh web
```

Sau khi khởi động lại, mở **Settings → General → Language** và chọn **Tiếng Việt**.

## Tài liệu tiếng Việt

Mở [hướng dẫn sử dụng](docs/vi/README.md) để xem tài liệu người dùng và [cách dùng CLI](docs/vi/cli.md). Tài liệu giữ nguyên lệnh, cờ và tên API để có thể sao chép khi làm theo.

Để cài từ checkout local:

```sh
dsh plugin --profile web add /đường/dẫn/deepseek-harness-vi
```

## Cập nhật bản dịch

Gói gồm 2.910 chuỗi trong 65 namespace giao diện client. `bun run check` kiểm tra khóa, placeholder và vòng đời plugin. GitHub Actions đối chiếu từ điển, 20 trang hướng dẫn người dùng và nguồn trợ giúp CLI với upstream; khi nội dung đổi, CI báo lỗi để cập nhật bản dịch trước khi phát hành.

Sau khi cập nhật và rà soát bản dịch tài liệu, ghi nhận nguồn mới bằng `bun scripts/check-docs.mjs <đường-dẫn-upstream> --write`, rồi chạy `bun run check:docs -- <đường-dẫn-upstream>`.

## Phạm vi

Plugin bao phủ chuỗi giao diện web do các từ điển client của Harness sở hữu. Nội dung do người dùng tạo, phản hồi từ model và dữ liệu/nhãn bên thứ ba vẫn hiển thị theo nội dung nguồn của chúng.

CLI upstream hiện chưa có API locale. Tài liệu CLI đã được dịch, nhưng `dsh --help`, thông báo lỗi và đầu ra do binary tạo vẫn theo ngôn ngữ của upstream.

## Tương thích

Gói dùng API locale của DSH `0.2.x`, không phụ thuộc vào số phiên bản của từng package giao diện. Khi upstream thay đổi API hoặc từ điển, gate CI sẽ yêu cầu rà soát trước khi bản dịch được cập nhật.

Các chuỗi nguồn được trích từ [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), phát hành theo MIT; bản dịch và plugin được giữ cùng giấy phép.
