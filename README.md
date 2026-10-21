# DeepSeek Harness — Giao diện tiếng Việt

Gói ngôn ngữ native cho giao diện Web của DeepSeek Harness. Gói đăng ký locale `vi` qua API locale của Harness, không sửa hay ghi đè tệp upstream.

## Cài đặt

```sh
dsh plugin --profile web add github:nhattuan612/deepseek-harness-vi
```

Sau khi cài, khởi động lại profile Web bằng `dsh web`. Trong giao diện, vào **Settings → General → Language** và chọn **Tiếng Việt**.

## Cập nhật

```sh
dsh plugin --profile web update deepseek-harness-vi
dsh web
```

Khởi động lại profile Web sau mỗi lần cập nhật để nạp bản dịch mới.

## Phạm vi

Gói dịch giao diện Web do DeepSeek Harness quản lý. Nội dung hội thoại, phản hồi của mô hình và đầu ra CLI giữ nguyên ngôn ngữ nguồn.

## Theo dõi upstream

`bun run check` kiểm tra catalog và vòng đời plugin. `bun run check:upstream -- <đường-dẫn-upstream>` kiểm tra namespace, khóa và chuỗi nguồn. GitHub Actions chạy các kiểm tra này khi có thay đổi và hằng ngày để báo khi upstream đổi.

Các chuỗi nguồn thuộc DeepSeek Harness và giấy phép MIT; plugin và bản dịch cũng dùng giấy phép MIT.
