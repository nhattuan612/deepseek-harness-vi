# Cấu hình mô hình

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/providers.md)

Hướng dẫn này giả định bạn đã khởi động giao diện web theo [README ở thư mục gốc](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md#run). Các thay đổi đối với mô hình sẽ có hiệu lực ngay ở yêu cầu tiếp theo mà không cần khởi động lại máy chủ.

## Cấu hình DeepSeek

Mở **Cài đặt → Mô hình**. Thẻ DeepSeek hiển thị một trường khóa API; hãy nhập khóa và lưu lại.

![Trang Mô hình: thẻ DeepSeek và nút Thêm nhà cung cấp mô hình](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/master/docs/user/guide/providers-models-page.png)

Khóa API chỉ được ghi một chiều; sau khi lưu, không thể đọc lại giá trị gốc. Trang web chỉ nhận được mô tả đã che sau khi lưu; bí mật không bao giờ được trả về ở dạng văn bản thuần. Khóa được lưu trong `$DSH_HOME/.credentials.yaml`, trong khi phần cài đặt chỉ giữ lại tham chiếu thông tin xác thực của nó.

## Thêm một nhà cung cấp bên thứ ba

Chọn **Thêm nhà cung cấp mô hình**. Thẻ mở ra ở **Nhà cung cấp mô hình bên thứ ba**: hãy chọn một nhà cung cấp mà DSH đóng gói sẵn — danh sách hiển thị các id nhà cung cấp như `anthropic`, `openai`, `moonshotai` cho Kimi, hoặc `zai` cho GLM — nhập khóa API của nhà cung cấp đó và lưu lại. Danh mục được cài đặt sẵn sẽ cung cấp endpoint, giao thức và danh sách mô hình.

Biểu tượng xác thực **?** giải thích mức độ ưu tiên của thông tin xác thực đã lưu và các phương án dự phòng bằng biến môi trường. Để trống trường khóa API để sử dụng thông tin xác thực đã lưu hoặc thử các biến môi trường được liệt kê. Gợi ý màu xanh lá cây biểu thị một biến môi trường đã được phát hiện. Gợi ý màu vàng có nghĩa là không phát hiện thấy biến thông tin xác thực nào; hãy nhập một khóa API hoặc cấu hình biến được liệt kê. Gợi ý chưa được xác nhận nghĩa là việc đọc trạng thái bị thất bại. Việc phát hiện không xác thực tính hợp lệ của thông tin xác thực cũng như không kiểm tra kết nối. Các tệp thông tin xác thực do nhà cung cấp quản lý, bao gồm các profile AWS và thông tin xác thực mặc định của ứng dụng Google (ADC), nằm ngoài phạm vi kiểm tra này. Các nhà cung cấp không có tính năng xác thực bằng khóa gốc, chẳng hạn như `openai-codex`, sẽ không hiển thị trường khóa API trừ khi profile chỉ định rõ ràng một tham chiếu thông tin xác thực.

Một thông tin xác thực đã lưu sẽ sử dụng văn bản gợi ý **Để trống để dùng thông tin xác thực đã lưu**, và không có văn bản trạng thái nào bên dưới ô nhập liệu. Phương án dự phòng môi trường sử dụng **Để trống để dùng biến môi trường để xác thực** và một gợi ý phát hiện khi ô nhập liệu còn trống. Một ô nhập liệu không rỗng sẽ không hiển thị văn bản trạng thái xác thực. Các biến cấu hình địa chỉ xuất hiện dưới mục **URL cơ sở** và không được tính là thông tin xác thực.

Một ô nhập khóa không rỗng sẽ có nút hình con mắt. Chọn **Hiển thị khóa bí mật** để kiểm tra nội dung bạn đã nhập, và **Ẩn khóa bí mật** để ẩn lại. Việc thay đổi nội dung nhập sẽ tự động ẩn lại. Thông tin xác thực đã lưu không thể đọc lại.

## Thêm một API mô hình tùy chỉnh

Chuyển thẻ sang **API mô hình tùy chỉnh** nếu bạn dùng trạm chuyển tiếp, cổng mạng nội bộ công ty, máy chủ tự lưu trữ hoặc nhà cung cấp không có trong danh mục tích hợp sẵn. Cung cấp ID nhà cung cấp viết thường, tên hiển thị, URL cơ sở, giao thức API, thông tin xác thực và ít nhất một mô hình. **Giao thức API** phải là giao thức mà cổng kết nối của bạn hỗ trợ, và bộ chọn cung cấp ba giao thức: OpenAI Chat Completions, OpenAI Responses, và Anthropic Messages, được lưu trong tệp `cordis.patch.yml` của profile đang hoạt động dưới dạng `openai-completions`, `openai-responses`, và `anthropic-messages`. Một nhà cung cấp chỉ hỗ trợ một giao thức, vì vậy một cổng kết nối phục vụ hai giao thức sẽ cần hai nhà cung cấp.

![Biểu mẫu API mô hình tùy chỉnh: ID nhà cung cấp, tên hiển thị, URL cơ sở, giao thức API và khóa API](https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/master/docs/user/guide/providers-custom-form.png)

ID nhà cung cấp là cố định vì các yêu cầu, phiên đã lưu, mặc định mô hình, và các tham chiếu thông tin xác thực đều sử dụng nó. Để đổi tên một nhà cung cấp, hãy thêm một nhà cung cấp mới và xóa nhà cung cấp cũ. Tên hiển thị, URL cơ sở, giao thức, thông tin xác thực, và các mô hình vẫn có thể chỉnh sửa được.

### Khám phá các mô hình

Bên dưới mục **Danh mục mô hình**, chọn **Lấy các mô hình khả dụng** để yêu cầu endpoint cho biết nó đang phục vụ những mô hình nào. Yêu cầu sử dụng URL cơ sở, giao thức và khóa hiện có trong biểu mẫu, hoặc khóa đã lưu của một nhà cung cấp đã lưu, và phản hồi sẽ mở ra một bộ chọn có thể tìm kiếm: tìm kiếm, đánh dấu chọn các mô hình bạn muốn, và chọn **Thêm các mục đã chọn**. Không có thông tin nào được lưu trữ cho đến khi bạn lưu hoặc tạo nhà cung cấp.

Tính năng khám phá đọc các định dạng danh sách mà các gateway phổ biến phân phối, nhưng không phải mọi endpoint đều trả lời theo một trong các định dạng đó, vì vậy hãy coi đây là một tiện ích thay vì một sự đảm bảo: khi nó thất bại hoặc không liệt kê được gì, hãy thêm các id mô hình bằng tay và chúng vẫn hoạt động bình thường. Một nhà cung cấp tích hợp sẵn luôn được phản hồi từ danh mục cài đặt sẵn, ngay cả khi URL cơ sở của nó trỏ tới một cổng kết nối, vì vậy hãy tìm nạp thông qua một nhà cung cấp tùy chỉnh để xem cổng kết nối thực sự phục vụ những gì.

## Chọn một mô hình

Các nhà cung cấp đã cấu hình sẽ xuất hiện trong bộ chọn mô hình. Việc chọn một mô hình cũng đặt nó làm mặc định cho các phiên mới. Một phiên đã gửi yêu cầu sẽ giữ nguyên mô hình được ghi lại trong nhật ký riêng của nó.

Nếu một mặc định đã lưu chỉ định một nhà cung cấp đã bị xóa, khung soạn thảo sẽ hiển thị **Chọn mô hình** và chặn nhập liệu cho đến khi một mô hình khác được chọn.

## Cấu hình nâng cao

[Danh mục cấu hình plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md) được tạo tự động liệt kê mọi trường được hỗ trợ và giá trị mặc định cho từng plugin; [`dsh-llm-pi-ai`](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md#deepseek-aidsh-llm-pi-ai) là phần nhà cung cấp mà trang này cấu hình. Các tài liệu tham khảo [`dsh-llm-pi-ai`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/llm/llm-pi-ai/README.md) và [`dsh-llm-deepseek`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/llm/llm-deepseek/README.md) quản lý cấu hình trực tiếp trong `cordis.patch.yml`, việc phân giải danh mục, kiểm soát suy luận (reasoning), thông tin xác thực, và các lỗi của adapter.

::: tip Cài đặt bổ sung
Trang Mô hình hiển thị khóa API, tên hiển thị, URL cơ sở, giao thức API, cùng với id, tên hiển thị, ngữ cảnh (context window), số token đầu ra tối đa (max output tokens) và các kiểu đầu vào (input types) của từng mô hình, cộng với các mức độ suy luận của một mô hình trên một nhà cung cấp API mô hình tùy chỉnh. Cấu hình các mức độ suy luận cho mô hình của nhà cung cấp tích hợp sẵn, các công tắc tương thích yêu cầu, header, thời gian chờ (timeout) và chính sách thử lại trong `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, cùng một tệp mà trang web ghi vào. Bạn có thể chỉnh sửa trực tiếp, hoặc khi trình duyệt chạy trên cùng một máy với máy chủ, hãy mở nó bằng **Open configuration file** ở tiêu đề trang Settings; các adapter sẽ đọc lại nó ở yêu cầu tiếp theo, do đó không cần khởi động lại. Các mục con bên dưới đề cập đến các trường mà hầu hết các gateway cần đến.

Đối với việc khởi chạy giao diện web tiêu chuẩn bằng `dsh web`, `<profile>` là `web`, do đó đường dẫn là `$DSH_HOME/profiles/web/cordis.patch.yml`. Nếu bạn khởi chạy một profile tùy chỉnh, hãy sử dụng tên được chọn khi khởi động thay thế.
:::

### Đầu vào hình ảnh

Trong **Cài đặt → Mô hình**, chỉnh sửa nhà cung cấp, mở **Cài đặt tùy chỉnh**, và mở rộng mục **Tùy chọn mô hình** của mô hình. **Loại đầu vào** nằm ở một hàng riêng bên dưới các trường dung lượng. Chọn **Hình ảnh** cho mô hình chấp nhận hình ảnh, và lưu lại. **Văn bản** mặc định được chọn sẵn cho một mô hình tùy chỉnh mới không kế thừa khả năng xử lý hình ảnh. Ít nhất ít nhất một loại đầu vào phải được chọn; hãy chọn Hình ảnh trước khi bỏ chọn Văn bản đối với một mô hình chỉ xử lý hình ảnh.

Các checkbox sẽ lưu `input` cho các mô hình pi-ai và `inputModalities` cho adapter DeepSeek trực tiếp. Bạn cũng có thể chỉnh sửa mô hình trong `$DSH_HOME/profiles/<profile>/cordis.patch.yml`; ví dụ, nhà cung cấp pi-ai tùy chỉnh này khai báo một mô hình chỉ xử lý văn bản và một mô hình vision:

Các ví dụ này hiển thị các trường cấu hình bên trong một bản vá profile. Một cấu hình ghi đè Cordis sẽ thay thế toàn bộ cấu hình mục; hãy giữ lại các nhà cung cấp và trường khác khi chỉnh sửa một cấu hình ghi đè hiện có.

```yaml
- id: llm-pi-ai
  config:
    providers:
      my-gateway:
        apiKeyEnv: GATEWAY_API_KEY
        api: openai-completions
        baseURL: https://gateway.example/v1
        models:
          - id: legacy-chat
          - id: vision-preview
            input: [text, image]
```

`input` của pi-ai chấp nhận `text` và `image` và chỉ áp dụng cho riêng mô hình đó. Một lựa chọn không rỗng rõ ràng sẽ được ưu tiên. Một `input` bị bỏ qua hoặc trống sẽ kế thừa các kiểu đầu vào của danh mục đã cài đặt, sau đó là `defaultInput` của route, vốn mặc định là `[text]`. Các checkbox sẽ hiển thị các giá trị kế thừa này mà không lưu ghi đè khi bạn chỉ đơn thuần mở hàng ra.

DeepSeek coi một `inputModalities` bị bỏ qua là chỉ xử lý văn bản và từ chối một danh sách trống. Việc bỏ chọn Image cũng đồng thời xóa `imagePixelBudget` và `imageMaxBytes` của mô hình đó, vì DeepSeek từ chối giới hạn hình ảnh trên một mô hình chỉ xử lý văn bản. Hãy đặt lại các giới hạn đó nếu sau này bạn bật lại hình ảnh và cần các giới hạn tùy chỉnh.

Để khôi phục tính kế thừa sau khi chỉnh sửa các checkbox, hãy xóa trường `input` hoặc `inputModalities` của mô hình khỏi `cordis.patch.yml`. **Restore defaults** sẽ xóa toàn bộ ghi đè danh mục mô hình, bao gồm cả các chỉnh sửa mô hình khác, vì vậy chỉ sử dụng nó khi bạn muốn khôi phục toàn bộ danh mục.

Nếu mọi mô hình bạn nhập bằng tay đều nhận hình ảnh, hãy đặt giá trị dự phòng một lần trên route thay vì trên từng mô hình:

```yaml
- id: llm-pi-ai
  config:
    providers:
      vision-gateway:
        apiKeyEnv: GATEWAY_API_KEY
        api: openai-completions
        baseURL: https://vision.example/v1
        defaultInput: [text, image]
        models:
          - id: first-model
          - id: second-model
```

`defaultInput` là một giá trị dự phòng (fallback), không phải ghi đè (override), và mặc định là `[text]`: trên một nhà cung cấp tích hợp sẵn, nó chỉ có tác dụng đối với các mô hình mà danh mục của nó không mô tả, do đó nó không bao giờ loại bỏ hình ảnh khỏi một mô hình danh mục vốn có hình ảnh. Hãy thu hẹp một trong số các mô hình đó bằng chính trường `input` của mô hình. Khi một nhà cung cấp tích hợp sẵn không có danh sách `models` tường minh, hãy viết nó dưới `modelOverrides`, theo khóa là id mô hình:

```yaml
- id: llm-pi-ai
  config:
    providers:
      anthropic:
        modelOverrides:
          claude-sonnet-4-5:
            input: [text]
```

Trong cấu hình pi-ai, mọi danh sách phải chỉ định ít nhất một modality, ngoại trừ trường `input` của chính mô hình, nơi một danh sách trống có ý nghĩa tương đương với việc bỏ qua nó. Một modality không xác định sẽ bị từ chối ở bất cứ nơi nào nó được viết.

Cả hai trường đều thể hiện một lời khẳng định về endpoint của bạn chứ không kiểm tra nó. Một mô hình khai báo hình ảnh mà endpoint của nó không thực sự phục vụ sẽ không bị phát hiện ở đây; thay vào đó, nhà cung cấp sẽ từ chối yêu cầu.

### Các mô hình tài khoản DeepSeek

Một tài khoản DeepSeek đã đăng nhập sẽ liệt kê các mô hình của nó từ dịch vụ tài khoản, do đó trang Mô hình không cung cấp trình chỉnh sửa mô hình cho nó. Hãy điều chỉnh một mô hình đơn lẻ bằng `modelOverrides` trong `$DSH_HOME/profiles/<profile>/cordis.patch.yml`; các trường khớp với một mục `models` của DeepSeek, và các trường không thiết lập sẽ giữ nguyên giá trị được liệt kê:

```yaml
- id: llm-deepseek-account
  config:
    modelOverrides:
      deepseek-flash:
        contextWindow: 524288
        maxTokens: 131072
```

Một mô hình cần DeepSeek Harness mới hơn sẽ thất bại với `CLIENT_UPGRADE_REQUIRED`, trong đó nêu tên phiên bản cần cài đặt. [Tài liệu tham khảo nhà cung cấp tài khoản](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/llm/llm-deepseek-account/README.md) quản lý các quy tắc liệt kê, dự phòng và kiểm soát truy cập (gating).

### Mức độ suy luận

Bộ chọn mô hình cung cấp menu **Effort** cho một mô hình có khai báo các mức độ suy luận. Các mô hình của nhà cung cấp tích hợp sẵn kế thừa mức độ của chúng từ danh mục đã cài đặt, và các mô hình của DeepSeek giữ nguyên các mức độ của adapter. Một mô hình bạn nhập bằng tay sẽ không khai báo mức nào cho đến khi bạn thêm chúng, vì vậy cho đến lúc đó, mục Effort không xuất hiện trong menu và mặc định của chính endpoint sẽ quyết định xem mô hình có suy nghĩ hay không.

Trên một nhà cung cấp API mô hình tùy chỉnh, hãy khai báo các mức độ trong **Cài đặt → Mô hình**: chỉnh sửa nhà cung cấp, mở **Cài đặt tùy chỉnh**, mở rộng **Tùy chọn mô hình** của mô hình, và bật **Mức độ suy luận**. Các hàng bắt đầu với off, low, medium, và high. Mỗi hàng ghép một mức độ với **Giá trị API** được gửi đi cho mức độ đó, mặc định là tên mức độ; chỉ thay đổi giá trị này khi tài liệu API của nhà cung cấp mô hình viết mức độ theo cách khác. Thêm hoặc xóa các hàng để khớp với những gì endpoint hỗ trợ, giữ lại ít nhất một mức bên cạnh off, và lưu lại. Tắt công tắc sẽ xóa bỏ khai báo.

Trang web sẽ ghi `reasoningEfforts` vào `$DSH_HOME/profiles/<profile>/cordis.patch.yml`, nơi bạn cũng có thể khai báo trực tiếp các mức độ:

```yaml
- id: llm-pi-ai
  config:
    providers:
      my-gateway:
        apiKeyEnv: GATEWAY_API_KEY
        api: openai-completions
        baseURL: https://gateway.example/v1
        reasoning: high
        models:
          - id: my-reasoner
            reasoningEfforts:
              off:
              high: high
              max: max
```

Mỗi khóa là một mức độ mà menu cung cấp, và giá trị của nó là chuỗi ký tự được gửi qua đường truyền dưới dạng `reasoning_effort`, vì vậy `max: xhigh` sẽ đổi tên một mức độ cho một cổng kết nối có tập từ vựng riêng. Chỉ có `off` mới có thể để trống, vì đối với hầu hết các endpoint, không suy nghĩ đồng nghĩa với sự vắng mặt của tham số. `reasoning` của route là mức độ được sử dụng khi phiên chưa chọn mức nào; việc chọn một effort trong bộ chọn sẽ lưu nó, cùng với mô hình, làm mặc định cho các phiên mới.

Một `off` để trống sẽ không gửi gì, điều này chỉ dừng một mô hình suy nghĩ theo yêu cầu; một `off` có giá trị sẽ gửi giá trị đó dưới dạng `reasoning_effort`. Một mô hình luôn suy nghĩ trừ khi được yêu cầu không làm vậy — chẳng hạn như DeepSeek V4 phía sau một cổng kết nối tương thích OpenAI — cần `compat.thinkingFormat: deepseek`, điều này khiến `off` gửi `thinking: {type: disabled}` và mọi mức độ khác gửi `thinking: {type: enabled}` bên cạnh effort:

```yaml
        models:
          - id: deepseek-v4-pro
            compat:
              thinkingFormat: deepseek
            reasoningEfforts:
              off:
              high: high
              max: max
```

Một mô hình của nhà cung cấp tích hợp sẵn mà gateway của nó không hỗ trợ suy luận sẽ mất các mức độ của nó với cấu hình `reasoningEfforts: false` bên dưới `modelOverrides`; việc chọn một effort cho nó sau đó sẽ bị từ chối với lỗi `UNSUPPORTED_REASONING_EFFORT`. Route của chính DeepSeek không cần điều này: các mô hình của nó đã cung cấp sẵn `off`, `low`, `high`, và `max`, và `llm-deepseek.reasoningEffort` thiết lập giá trị mặc định mà bộ chọn bắt đầu:

```yaml
- id: llm-deepseek
  config:
    reasoningEffort: max
```

### Tính tương thích của yêu cầu

Một gateway có thể có một khóa hoạt động tốt tại một địa chỉ kết nối được nhưng vẫn từ chối mọi yêu cầu. pi-ai quyết định định dạng của một yêu cầu — vai trò nào mang lời nhắc hệ thống, trường nào giới hạn đầu ra, mức độ suy nghĩ được truyền đi như thế nào — từ URL của endpoint, và một địa chỉ mà nó không nhận ra sẽ được gửi yêu cầu như thể đó chính là OpenAI. Hầu hết các gateway tương thích OpenAI đều từ chối ít nhất một điều mà OpenAI chấp nhận.

Hai nguyên nhân chiếm phần lớn trong số đó: Một mô hình khai báo suy luận sẽ có lời nhắc hệ thống được gửi dưới dạng `role: "developer"`, điều mà nhiều gateway từ chối thẳng thừng, và giới hạn đầu ra được gửi dưới dạng `max_completion_tokens`, điều mà một máy chủ chỉ biết `max_tokens` sẽ từ chối. Biểu mẫu không có trường nào cho hai mục này; hãy sửa chúng trên route trong `$DSH_HOME/profiles/<profile>/cordis.patch.yml`:

```yaml
- id: llm-pi-ai
  config:
    providers:
      my-gateway:
        apiKeyEnv: GATEWAY_API_KEY
        api: openai-completions
        baseURL: https://gateway.example/v1
        compat:
          supportsDeveloperRole: false
          maxTokensField: max_tokens
        models:
          - id: my-model
```

`compat` của một route là mặc định cho các mô hình của nó, và cấu hình của chính mô hình sẽ được ưu tiên theo từng trường, do đó một mô hình có thể được điều chỉnh mà không cần khai báo lại route:

```yaml
        models:
          - id: my-model
          - id: my-reasoner
            compat:
              thinkingFormat: deepseek
```

Những gì cả hai đều không thiết lập sẽ giữ giá trị của danh mục đã cài đặt cho mô hình đó, và những gì danh mục không mô tả sẽ tuân theo tính năng phát hiện của pi-ai. Hãy gán giá trị cho mọi công tắc bạn nêu ra: một khóa để trống (`supportsDeveloperRole:`) sẽ bị từ chối thay vì bị bỏ qua, vì một giá trị trống sẽ xóa bỏ những gì danh mục đã biết trong khi không đưa ra giá trị thay thế. Một tên mà không có giao thức nào chấp nhận cũng sẽ bị từ chối, và thông báo sẽ liệt kê các tên khả dụng.

Mỗi công tắc thuộc về các giao thức khai báo nó, do đó một công tắc hợp lệ trên `api` này có thể bị từ chối trên một `api` khác — thông báo sẽ nêu rõ những gì giao thức đó thực sự cung cấp. Giống như `input` ở trên, một công tắc thể hiện một lời khẳng định về endpoint của bạn chứ không kiểm tra nó: việc thiết lập một công tắc mà cổng kết nối của bạn không thực sự cần sẽ chỉ đơn giản là gửi đi một yêu cầu khác.

Mọi công tắc, các giá trị được chấp nhận và các giao thức hỗ trợ nó đều được liệt kê dưới mục `PiAiCompatProfile` trong [tài liệu tham khảo cấu hình `dsh-llm-pi-ai` được tạo tự động](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/config-catalog.md#deepseek-aidsh-llm-pi-ai) — tài liệu này được tạo ra từ mã nguồn, do đó nó không thể bị lạc hậu so với những gì adapter chấp nhận.

## Xử lý sự cố

- **`MISSING_CREDENTIAL`** — Lưu khóa của nhà cung cấp thông qua trang Mô hình hoặc cung cấp biến môi trường được tham chiếu.
- **`UNKNOWN_MODEL`** — Chọn một mô hình đã cấu hình hoặc thêm mô hình còn thiếu vào nhà cung cấp tùy chỉnh.
- **Tìm nạp các mô hình khả dụng trả về 401** — Kiểm tra khóa. Tính năng khám phá mô hình gọi endpoint `GET /models` tương thích OpenAI; hãy nhập các mô hình theo cách thủ công đối với các endpoint không cung cấp endpoint này.
- **Tìm nạp các mô hình khả dụng báo cáo không có mảng `data` cũng như đối tượng `models`** — Danh sách của endpoint ở định dạng mà tính năng khám phá không đọc được. Hãy nhập các mô hình bằng tay.
- **Gateway từ chối mọi yêu cầu mặc dù khóa và URL đều đúng** — Định dạng yêu cầu của nó khác với OpenAI. Bắt đầu với `compat.supportsDeveloperRole: false` và `compat.maxTokensField: max_tokens` trên route.
- **Chỉ các mô hình suy luận gặp lỗi** — pi-ai gửi lời nhắc hệ thống của chúng dưới dạng vai trò `developer`, điều mà gateway từ chối. Thiết lập `compat.supportsDeveloperRole: false`.
- **Menu Effort không xuất hiện cho một mô hình bạn nhập bằng tay** — Nó không khai báo mức nào. Trên nhà cung cấp API mô hình tùy chỉnh, hãy bật **Mức độ suy luận** trong **Tùy chọn mô hình** của mô hình; ở những nơi khác, hãy thêm `reasoningEfforts` vào mô hình trong `cordis.patch.yml`.
- **`off` không ngăn mô hình DeepSeek suy nghĩ** — Một `off` trống không gửi trường suy luận nào, và một endpoint suy nghĩ theo mặc định sẽ tiếp tục suy nghĩ. Thiết lập `compat.thinkingFormat: deepseek` trên mô hình hoặc trên route.
- **Một công tắc compat bị từ chối do không có giá trị** — Một khóa được viết mà không có gì phía sau dấu hai chấm. Hãy gán cho nó một giá trị, hoặc xóa khóa đó để giữ giá trị của danh mục đã cài đặt.
- **Hình ảnh bị từ chối trước khi gửi** — Mô hình không khai báo modality hình ảnh. Hãy gán cho mô hình của nhà cung cấp tùy chỉnh `input: [text, image]`; trên route của chính DeepSeek, hãy chọn một mục có khả năng xử lý hình ảnh từ danh mục đã cấu hình (mặc định là `deepseek-flash`) và xác nhận rằng cổng kết nối của bạn phục vụ mô hình đó với đầu vào hình ảnh.
- **Nhà cung cấp từ chối yêu cầu có chứa hình ảnh** — Mô hình khai báo hình ảnh mà endpoint của nó không thực sự phục vụ. Hãy xóa `image` khỏi bất kỳ danh sách nào đã cấp nó — `input` của mô hình, hoặc `defaultInput` của route — sau đó bắt đầu một phiên mới: hình ảnh đính kèm vẫn nằm trong nhật ký phiên, do đó yêu cầu tương tự sẽ lặp lại cho đến khi phiên chuyển sang yêu cầu khác.
