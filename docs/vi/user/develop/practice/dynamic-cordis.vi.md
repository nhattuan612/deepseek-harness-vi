# Cấu hình plugin bền vững từ lời nhắc

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/practice/dynamic-cordis.md)

Chế độ Creator cung cấp [Plugin Manager](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md) và [khảo sát runtime](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/extensions/tool-cordis/README.md) ở chế độ chỉ đọc. Cấu hình plugin thuộc về profile hiện tại, ảnh hưởng đến các phiên của profile đó và vẫn tồn tại qua các lần khởi động lại tiến trình.

## Kết nối một MCP server

Khởi động profile Web và chọn chế độ Creator. Với một Streamable HTTP MCP server có thể tiếp cận và cung cấp công cụ `ping`, hãy gửi lời nhắc này cùng endpoint thực tế của server:

> Configure the MCP server at `<endpoint>` in this profile as `demo`. Make its tools available now, then call its ping tool and tell me the result.

Agent sẽ ghi một bundle chỉ chứa cấu hình với bản vá chèn `@deepseek-ai/dsh-mcp-client`, sau đó cài đặt nó bằng `plugin_manager install_bundle`. Khi bật HMR, các công cụ sẽ xuất hiện trong chính phiên đang chạy. Hãy xác minh cả kết quả quản lý (`application: applied`) lẫn lệnh gọi `mcp__demo__ping` thành công. Một mục đã lưu có trạng thái `restart-required` tức là chưa được kích hoạt; một mục thất bại cần được sửa lại cấu hình.

Hãy đọc bản vá bundle trước khi chỉnh sửa cấu hình của nó. Sử dụng Plugin Manager để vô hiệu hóa các mục hoặc gỡ bỏ bundle. Xem [tài liệu tham khảo MCP client](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md) để biết các cấu hình được chấp nhận và hành vi khi kết nối thất bại.
