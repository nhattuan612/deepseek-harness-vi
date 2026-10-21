# Chạy DSH phía sau một proxy mạng

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/network-proxy.md)

DSH định tuyến các yêu cầu gửi đi của nó — gọi mô hình, tìm kiếm web, nạp trang web, và các máy chủ MCP qua HTTP — thông qua proxy được chỉ định bởi các biến môi trường proxy tiêu chuẩn. Nó đọc chúng khi khởi chạy; không cần cấu hình thêm điều gì khác. Một vài đường dẫn vẫn đi trực tiếp theo thiết kế hoặc do giới hạn runtime, được liệt kê trong mục "Những gì đi trực tiếp" bên dưới.

## Khai báo biến môi trường

```sh
export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
```

Đặt cả hai dòng vào shell profile của bạn để mọi lần gọi `dsh` đều kế thừa chúng, hoặc trong `$DSH_HOME/.env` (mặc định là `~/.dsh/.env`) bên cạnh API key của bạn; một biến được export luôn được ưu tiên hơn tệp đó. Tệp `.env` của chính dự án không thể thiết lập chúng: nó đi kèm với lệnh `git clone`, và DSH thà từ chối khởi động còn hơn để một kho lưu trữ quyết định nơi lưu lượng mạng của bạn đi tới.

Một proxy cần thông tin xác thực sẽ nhận chúng trong URL: `http://user:password@proxy.example:8080`. DSH không bao giờ in lại URL: thông báo chẩn đoán sẽ nêu tên biến mà nó đã từ chối, do đó cả tên người dùng và mật khẩu đều không xuất hiện ở bất cứ đâu.

## Vì sao trình duyệt dùng proxy nhưng terminal không dùng proxy của trình duyệt

Đây là điều gây bất ngờ phổ biến nhất, và nó không chỉ riêng với DSH. Không có một "system proxy" duy nhất mà mọi phần mềm đều tuân theo — có ba cơ chế không liên quan đến nhau:

| Cơ chế | Đối tượng tuân theo |
|---|---|
| Cài đặt proxy của hệ điều hành | Safari, hầu hết ứng dụng native trên macOS, Chrome và Edge |
| Các biến môi trường `HTTP_PROXY` / `HTTPS_PROXY` | `curl`, `git`, `npm`, `pip`, và DSH |
| Chế độ TUN (giao diện mạng ảo) | Mọi thứ, một cách trong suốt |

Công tắc "system proxy" trong một ứng dụng proxy như Clash chỉ ghi cơ chế đầu tiên. Các trình duyệt nhận biết được nó; các công cụ dòng lệnh không bao giờ nhìn thấy nó. Đó là lý do tại sao việc khai báo biến môi trường là một bước riêng biệt, và tại sao bật chế độ TUN giúp cả hai hoạt động mà không cần bất kỳ biến nào.

DSH không đọc cài đặt proxy của hệ điều hành. Hãy export các biến, hoặc sử dụng chế độ TUN.

## Chọn những gì đi trực tiếp

`NO_PROXY` liệt kê các host cần tiếp cận trực tiếp:

```sh
export NO_PROXY=internal.example.com,.corp.example.com,registry.local
```

Một mục chỉ định một host và khớp với nó cùng với mọi subdomain bên dưới: `NO_PROXY=example.com` cũng gửi `api.example.com` trực tiếp. Dấu `.` hoặc `*.` ở đầu được chấp nhận và có ý nghĩa tương tự. Một mục có thể mang theo `:port`, và `*` sẽ bỏ qua proxy cho tất cả.

**Dải mạng CIDR không hoạt động.** Danh sách bỏ qua của hệ điều hành thường chứa các mục như `10.0.0.0/8` hoặc `192.168.0.0/16`; việc sao chép chúng vào `NO_PROXY` sẽ không có tác dụng. Thay vào đó, hãy sử dụng tên host hoặc hậu tố tên miền.

Bạn không cần liệt kê `localhost` hoặc `127.0.0.1`. DSH luôn bỏ qua loopback, vì Web UI và các máy chủ cục bộ của chính nó nếu không sẽ định tuyến qua proxy và bị lặp vòng.

## Những giới hạn cần biết

**Proxy SOCKS không được hỗ trợ.** Một giá trị `socks5://` sẽ được báo cáo khi khởi động và bị bỏ qua, và DSH kết nối trực tiếp cho scheme đã đặt giá trị đó — việc đặt `HTTPS_PROXY=socks5://…` cùng với một `HTTP_PROXY` dùng được sẽ khiến `https:` đi trực tiếp thay vì dùng ké proxy HTTP. Thay vào đó, hãy trỏ các biến tới cổng HTTP của ứng dụng proxy của bạn — hầu hết ứng dụng đều mở cả hai, và cổng HTTP thường là số cổng lân cận.

**Chỉ riêng `ALL_PROXY` là đủ.** DSH dùng nó làm phương án dự phòng cho cả hai scheme, mặc dù Node và curl có cách xử lý khác nhau về điều này. Tuy nhiên, việc đặt `HTTPS_PROXY` một cách tường minh vẫn rõ ràng hơn.

**Proxy doanh nghiệp chặn bắt TLS cần chứng chỉ của nó.** Nếu các yêu cầu thất bại với lỗi chứng chỉ sau khi proxy đã có thể kết nối được, hãy trỏ Node tới gói CA bundle của tổ chức bạn trước khi khởi chạy:

```sh
export NODE_EXTRA_CA_CERTS=/path/to/corporate-ca.pem
```

Node chỉ đọc biến đó khi bắt đầu tiến trình, vì vậy hãy export nó trước khi chạy `dsh`.

**Các công cụ mà DSH chạy cho bạn tuân theo cùng một proxy.** Các lệnh trong công cụ bash, `git`, `gh`, và các máy chủ MCP được khởi động dưới dạng tiến trình con đều kế thừa các biến này. Một tiến trình con bản thân là một chương trình Node chỉ tuân theo chúng trên Node 22.21 trở lên; phiên bản Node cũ hơn sẽ kết nối trực tiếp. Nếu một trong các biến proxy của bạn chứa giá trị mà DSH đã từ chối — chẳng hạn như URL SOCKS — các công cụ dựa trên Node cũng sẽ kết nối trực tiếp thay vì thất bại khi khởi động, trong khi `curl` và `git` vẫn đọc giá trị đó.

**Mật khẩu trong URL proxy cũng truyền tới các công cụ đó.** `HTTPS_PROXY=http://alice:s3cret@proxy.example:8080` là một biến môi trường bình thường, vì vậy mọi lệnh mà DSH chạy — bao gồm cả những lệnh do mô hình viết — đều có thể đọc nó, và một lệnh in ra môi trường của nó sẽ đưa mật khẩu vào đầu ra được lưu lại. Đây là cách biến này hoạt động với mọi thứ khác trong shell của bạn. Nếu điều đó đáng ngại, hãy cấp cho proxy một điểm truy cập không cần thông tin xác thực, hoặc xác thực nó theo cách khác thay vì đặt trong URL.

## Những gì đi trực tiếp

Không phải mọi yêu cầu mà DSH tạo ra đều đi qua proxy:

- **Bất kỳ thứ gì trên máy này.** Vòng lặp nội bộ (loopback) luôn đi trực tiếp: `localhost`, toàn bộ dải `127.0.0.0/8`, `::1`, và `0.0.0.0`. Một proxy không thể tiếp cận một cách hữu ích tới một dịch vụ chỉ lắng nghe cục bộ.
- **Mã do mô hình viết.** Các workflow worker và tiến trình Node ptc-runtime không nhận cài đặt proxy, do đó các script do mô hình tạo ra không thể đọc URL proxy vốn có thể chứa mật khẩu. Các yêu cầu trực tiếp phải tự cấu hình bất kỳ proxy bắt buộc nào và tiếp tục chịu sự kiểm soát của sandbox thực thi.
- **Dữ liệu đo từ xa về việc sử dụng (Usage telemetry).** Bộ xuất OTLP sử dụng chính HTTP client của Node thay vì client do proxy cấu hình, do đó telemetry kết nối trực tiếp và chỉ đơn giản là thất bại ở những nơi lưu lượng ra trực tiếp bị chặn. Không có tác vụ nào bạn làm trong DSH phụ thuộc vào nó. Đặt `DSH_TELEMETRY_MODE=DISABLED` để tắt hoàn toàn.
- **`web_fetch` tới một địa chỉ riêng dạng chuỗi ký tự (literal private address).** Một URL chỉ định một địa chỉ như `http://10.0.0.5/` sẽ bị từ chối thay vì bàn giao cho proxy, tương tự như sự từ chối khi không cấu hình proxy.

## Kiểm tra xem nó đã hoạt động chưa

Yêu cầu agent nạp một trang và theo dõi nhật ký kết nối của ứng dụng proxy của bạn:

```sh
dsh --profile headless "fetch https://example.com and tell me the page title"
```

Nếu yêu cầu không xuất hiện ở đó, hãy xác nhận các biến vẫn còn tồn tại trong môi trường của chính DSH:

```sh
env | grep -i proxy
```
