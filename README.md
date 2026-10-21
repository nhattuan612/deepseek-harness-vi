# DeepSeek Harness — Tiếng Việt

[![Kiểm tra](https://github.com/nhattuan612/deepseek-harness-vi/actions/workflows/check.yml/badge.svg?branch=main)](https://github.com/nhattuan612/deepseek-harness-vi/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Gói ngôn ngữ cộng đồng, đưa giao diện Web của [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) sang tiếng Việt.

Plugin đăng ký catalog `vi` qua API locale native của DeepSeek Harness. Gói không sửa hoặc ghi đè mã nguồn upstream.

## Tính năng

- Việt hoá các mục giao diện Web có trong catalog.
- Dùng hệ thống locale của Harness để tương thích với các gói giao diện.
- Giữ nguyên ngôn ngữ nội dung hội thoại, câu trả lời của mô hình và đầu ra CLI.
- Có CI kiểm tra catalog và tác vụ hằng ngày phát hiện thay đổi chuỗi/khóa từ upstream.

## Cài đặt

Yêu cầu Node.js `>=22` và DeepSeek Harness CLI. Lệnh dưới đây cài plugin vào profile `web`; thay `web` bằng tên profile bạn đang sử dụng nếu khác.

```sh
dsh plugin --profile web add github:nhattuan612/deepseek-harness-vi
dsh --profile web
```

Trong giao diện, mở **Settings → General → Language** và chọn **Tiếng Việt**.

## Cập nhật

```sh
dsh plugin --profile web update deepseek-harness-vi
dsh --profile web
```

Khởi động lại profile để nạp phiên bản mới. Lệnh cập nhật lấy commit mới nhất của nhánh mặc định trên GitHub.

## Gỡ cài đặt

```sh
dsh plugin --profile web remove deepseek-harness-vi
```

## Tương thích và thay đổi upstream

Phiên bản DSH được kiểm tra gần nhất là `0.2.1-rc.2`. Các dải phiên bản được plugin khai báo trong trường `engines.dsh` của [package.json](package.json). Plugin chỉ hỗ trợ những phiên bản trong dải đó.

Tác vụ GitHub Actions hằng ngày so sánh catalog với upstream và báo khi có khóa hoặc chuỗi thay đổi. Tác vụ này không tự dịch, không tự cập nhật plugin và không đảm bảo tương thích với API của một phiên bản DSH mới hơn. Khi upstream thay đổi, cần rà soát catalog, cập nhật bản dịch và xác nhận dải tương thích trước khi phát hành.

## Phát triển

```sh
bun run check
bun run check:upstream -- ../deepseek-harness-upstream
```

Catalog nguồn, catalog tiếng Việt và quy ước đồng bộ được mô tả trong [`catalog/README.md`](catalog/README.md).

## Giấy phép

Plugin và bản dịch dùng giấy phép MIT; các chuỗi nguồn thuộc DeepSeek Harness được ghi nhận trong [LICENSE](LICENSE). Đây là plugin cộng đồng, không phải sản phẩm chính thức của DeepSeek.
