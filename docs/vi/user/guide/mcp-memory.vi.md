# Kết nối máy chủ MCP bộ nhớ của bên thứ ba

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/mcp-memory.md)

Ba **cấu hình tham chiếu mặc định tắt** này kết nối một hệ thống bộ nhớ với DSH thông qua [`@deepseek-ai/dsh-mcp-client`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md). Hãy chọn một cấu hình, hoặc sao chép hàng MCP generic tương tự cho một máy chủ khác.

Các cấu hình của bên thứ ba này chỉ được cung cấp dưới dạng ví dụ về khả năng tương tác. Việc đưa chúng vào đây không hàm ý sự chứng thực, khuyến nghị, quan hệ đối tác hoặc hỗ trợ liên tục từ DeepSeek.

## Những gì DSH thực hiện

DSH phân tích cú pháp lớp phủ Cordis đã chọn, khởi chạy một lệnh stdio đã cấu hình hoặc kết nối tới một URL Streamable HTTP đã cấu hình, phát hiện các công cụ MCP và hiển thị chúng dưới dạng `mcp__<serverName>__<tool>`. DSH **không** tải xuống máy chủ, không khởi tạo cơ sở dữ liệu, không chọn mô hình hoặc nhà cung cấp embedding, không tạo tài khoản đám mây, không di chuyển dữ liệu của nhà cung cấp, hoặc giám sát một dịch vụ HTTP riêng biệt. Đối với stdio, client generic sẽ khởi chạy và dừng tiến trình con cùng với vòng đời plugin DSH; đối với HTTP, dịch vụ upstream phải đang chạy sẵn.

Cầu nối stdio chủ động loại bỏ các biến môi trường mà tên thường dùng để nhận diện thông tin xác thực và toàn bộ các biến `DSH_*` trước khi khởi chạy tiến trình con; các biến môi trường khác vẫn được kế thừa. Mỗi ví dụ chỉ bổ sung cấu hình ghi đè cơ sở mà nó cần. Nếu một tính năng tùy chọn của upstream cần một secret khác, hãy thêm biến đó vào `config.env` của hàng thay vì đặt trực tiếp secret vào YAML.

## Chọn một cấu hình

| Hệ thống | Phiên bản đã kiểm thử | Giao thức truyền tải (Transport) | Điều kiện tiên quyết upstream |
|---|---:|---|---|
| [Memorix](https://github.com/AVIDS2/memorix) | `memorix@1.3.0` (`500792cad3144142293bfbb20acb4841c9f7fcfa`) | stdio | Node 22.18+ và `npm install --global memorix@1.3.0` |
| [MCP Reference Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) | `@modelcontextprotocol/server-memory@2026.7.4` (`6dd0a683e198783e30feabf7abaf42f925bd18b1`) | stdio | `npm install --global @modelcontextprotocol/server-memory@2026.7.4` |
| [Engram](https://github.com/Gentleman-Programming/engram) | `v1.20.0` (`ba9e46ced152c37a7cb9e576153c41995873e2fc`) | stdio | Go 1.25.10+ và `go install github.com/Gentleman-Programming/engram/cmd/engram@v1.20.0`, hoặc tệp binary phát hành tương ứng |

## Kích hoạt một cấu hình

Truyền một lớp phủ vào DSH:

```sh
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/memorix.cordis.yml"
```

Thay thế tên tệp bằng `mcp-reference-memory.cordis.yml` hoặc `engram.cordis.yml`. Đường dẫn có thể trỏ tới một tệp đã sao chép ở bất kỳ đâu trên đĩa. Không có máy chủ bộ nhớ nào hiện diện trong cấu hình đóng gói sẵn, vì vậy việc bỏ qua `--patch` sẽ giữ cho cả ba máy chủ ở trạng thái tắt.

Để duy trì lựa chọn qua các lần chạy, hãy hợp nhất bản vá `insert` đơn lẻ của tệp đã chọn vào một lớp bản vá người dùng — `$DSH_HOME/profiles/<name>/cordis.patch.yml` cho một profile, hoặc `$DSH_HOME/cordis.patch.yml` cho mọi profile trên máy. Không sao chép đè lên tệp hiện có: tệp đó có thể đã chứa các bản vá người dùng không liên quan khác.

## Cài đặt nhà cung cấp

### Memorix

```sh
npm install --global memorix@1.3.0
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/memorix.cordis.yml"
```

Memorix hoạt động ở chế độ heuristic cục bộ mà không cần dịch vụ LLM hay embedding. Hãy cấu hình các nhà cung cấp tùy chọn trong tệp `~/.memorix/config.toml` của chính Memorix hoặc `memorix.toml` của dự án. Ví dụ này giữ nguyên định danh dự án Git của Memorix từ thư mục làm việc của DSH và sử dụng mặc định `~/.memorix/data` của Memorix. Đặt biến `MEMORIX_DATA_DIR` trước khi khởi động DSH để ghi đè.

### MCP Reference Memory

```sh
npm install --global @modelcontextprotocol/server-memory@2026.7.4
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/mcp-reference-memory.cordis.yml"
```

Máy chủ tham chiếu này lưu trữ một đồ thị tri thức cục bộ và cung cấp các công cụ thực thể (entity), quan hệ (relation), quan sát (observation), đọc (read), tìm kiếm (search), và mở (open). Nó không cần dịch vụ mô hình hay embedding. Ví dụ này lưu tệp JSONL của nó tại `$HOME/.dsh-mcp-reference-memory.jsonl` thay vì thư mục gói npm đã cài đặt. Đặt `MEMORY_FILE_PATH` trước khi khởi động DSH để ghi đè.

Tìm kiếm là việc so khớp chuỗi con không phân biệt chữ hoa chữ thường trên tên thực thể, kiểu và quan sát, không phải truy xuất ngữ nghĩa (semantic retrieval). Máy chủ không bổ sung embedding, tóm tắt tự động, giải quyết xung đột hay chính sách quên (forgetting policy).

### Engram

```sh
go install github.com/Gentleman-Programming/engram/cmd/engram@v1.20.0
dsh web --patch "$PWD/apps/cli/config/examples/mcp-memory/engram.cordis.yml"
```

Engram tự quản lý việc lưu trữ và lựa chọn dự án: nó mặc định sử dụng `~/.engram`, phát hiện dự án Git từ thư mục làm việc của DSH, và chấp nhận `ENGRAM_DATA_DIR` hoặc `ENGRAM_PROJECT` làm các ghi đè môi trường.

## Chỉ dẫn mô hình dùng chung tùy chọn

Thêm chỉ dẫn ngắn gọn, độc lập với nhà cung cấp này vào các chỉ dẫn mô hình hiện tại của bạn nếu phần mô tả công cụ của máy chủ không kích hoạt việc sử dụng bộ nhớ một cách đáng tin cậy:

> When the user asks you to remember something, call a memory write tool. When historical information may be relevant, search memory and use relevant results.

Đây chỉ là hướng dẫn bổ sung. Các ví dụ không thay thế persona system-prompt của DSH.

## Xác minh ghi, nhớ lại trong phiên mới và sử dụng

Sử dụng một giá trị duy nhất và giữ nguyên phạm vi lưu trữ của nhà cung cấp trong suốt quá trình:

1. Trong phiên DSH A, hãy hỏi: `Remember that my validation drink is lapsang-<unique suffix>.` Xác nhận rằng mô hình đã gọi công cụ ghi của nhà cung cấp và công cụ trả về thành công.
2. Tạo phiên DSH B trong cùng Host đang chạy. Không sao chép cuộc hội thoại của phiên A. Hãy hỏi: `What is my validation drink? Check memory.` Xác nhận rằng mô hình đã gọi công cụ tìm kiếm hoặc nhớ lại của nhà cung cấp và trả về giá trị.
3. Vẫn trong phiên B, hãy hỏi: `Use that preference to suggest one drink for the meeting.` Xác nhận rằng câu trả lời sử dụng giá trị đã nhớ lại.

Cần tạo một phiên DSH mới; không cần khởi động lại Host. Một tiến trình MCP con bị sập sẽ kích hoạt việc tự động kết nối lại kèm theo cơ chế hoãn lùi (backoff) và đồng bộ lại công cụ; các công cụ vẫn được liệt kê và các lệnh gọi chỉ thất bại trong thời gian ngừng hoạt động, và sau khi hết ngân sách thử kết nối lại, các công cụ sẽ bị hủy đăng ký và quá trình kết nối lại dừng lại cho đến khi tải lại hoặc khởi động lại. Quá trình phát hiện ban đầu là bất đồng bộ, vì vậy hãy đợi các công cụ `mcp__...` của nhà cung cấp xuất hiện trước khi gửi prompt xác minh đầu tiên.

## Kết nối một máy chủ MCP khác

Sao chép các trường mục tương tự và sử dụng một `id` và `serverName` duy nhất:

```yaml
- insert:
    - id: memory-my-server
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: my-memory
        transport: stdio
        command: my-memory-mcp
        args: []
        env: {}
        cwd: !!js process.cwd()
```

Đối với máy chủ từ xa, hãy sử dụng `transport: streamable-http`, `url`, và `headers` thay thế. Việc cài đặt, định danh, xác thực, mô hình, embedding, tính bền vững và cấp phép theo từng nhà cung cấp vẫn là trách nhiệm của nhà cung cấp đó.
