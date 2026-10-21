# Dùng CLI DSH

Các lệnh bên dưới giữ nguyên cú pháp tiếng Anh của CLI để có thể chạy trực tiếp. Phần giải thích bằng tiếng Việt.

## Khởi chạy profile

```sh
dsh web
```

Tên profile đứng ngay sau `dsh` là cách viết tắt của `dsh --profile <name>`. Ví dụ, `dsh tui` khởi chạy profile `tui`. Tham số phía sau cờ của launcher được chuyển nguyên vẹn cho ứng dụng trong profile.

```sh
dsh --profile web --help
dsh web --dump-config
```

Lệnh đầu chuyển `--help` cho ứng dụng Web. Lệnh sau in cấu hình profile đã ghép rồi thoát.

## Quản lý plugin

```sh
dsh plugin --profile web add <package>
dsh plugin --profile web remove <package>
```

`dsh plugin` chuyển các tham số còn lại cho pnpm trong thư mục profile. Dùng `add`, `remove` hoặc lệnh pnpm phù hợp để quản lý plugin của profile.

## Cờ của launcher

| Cờ | Tác dụng |
| --- | --- |
| `--profile <name>` | Chọn profile cần chạy. |
| `--from-default-profile <name>` | Tạo lại profile tuỳ chỉnh từ một mẫu profile có sẵn. |
| `--patch <path>` | Áp dụng thêm một tệp patch sau các lớp của profile; có thể lặp lại. |
| `--dump-config` | In cấu hình đã ghép rồi thoát. |
| `--dump-default-config` | In cấu hình từ các lớp bundle, bỏ lớp người dùng và cờ `--patch`. |
| `--dump-config-schema` | In JSON Schema của cấu hình profile và patch. |
| `--version` | In phiên bản DSH. |

Không kết hợp nhiều cờ `--dump-*` trong cùng lệnh. Các lệnh dump không nhận tham số của ứng dụng.

## Ví dụ

```sh
dsh web
dsh --profile web --patch ./extra.yml
dsh web --dump-default-config
dsh plugin --profile web add github:nhattuan612/deepseek-harness-vi
```

Sau khi cài language pack, khởi chạy lại profile Web rồi chọn **Settings → General → Language → Tiếng Việt**.
