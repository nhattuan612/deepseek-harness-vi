# Bộ điều hợp LLM

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/practice/llm-adapter.md)

Hướng dẫn này kết nối một nhà cung cấp LLM mới vào Harness.

## Tổng quan

Một bộ điều hợp (adapter) LLM kế thừa `LlmAdapter` và triển khai `stream()`, chuyển đổi yêu cầu trung lập với nhà cung cấp của Harness thành lệnh gọi API của nhà cung cấp và chuyển đổi phản hồi trở lại thành các chunk của Harness.

## Triển khai tối thiểu

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { LlmAdapter, type GenerateOptions, type StreamChunk } from '@deepseek-ai/dsh-llm'

class MyAdapter extends LlmAdapter {
  private apiKey: string

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    // 1. Convert options.messages to the provider format.
    // 2. Call the streaming API.
    // 3. Convert the response into StreamChunk values.
  }
}

export interface Config {
  apiKey: string
  providers: string[]
}

export const Config: Schema<Config> = Schema.object({
  apiKey: Schema.string().required(),
  providers: Schema.array(Schema.string()).required(),
})

export const name = 'my-llm-adapter'
export const inject = ['llm']

export function apply(ctx: Context, config: Config) {
  const adapter = new MyAdapter(config.apiKey)
  ctx.llm.registerAdapter(config.providers, adapter)
}
```

## Giao thức StreamChunk

`stream()` yield các chunk theo giao thức này:

```ts
import { brandString } from '@deepseek-ai/dsh-brand'
import type { StreamChunk, ToolCallId } from '@deepseek-ai/dsh-llm'

async function* exampleChunks(): AsyncIterable<StreamChunk> {
  // 1. Start each content block with block-start.
  yield { type: 'block-start', index: 0, blockType: 'text' }

  // 2. Stream text through text-delta.
  yield { type: 'text-delta', index: 0, text: 'Hello' }
  yield { type: 'text-delta', index: 0, text: ' world' }

  // 3. End each content block with block-end and the complete block.
  yield {
    type: 'block-end',
    index: 0,
    block: { type: 'text', text: 'Hello world' },
  }

  // 4. Tool-call block.
  yield { type: 'block-start', index: 1, blockType: 'tool-call' }
  yield {
    type: 'tool-call-delta',
    index: 1,
    id: brandString<ToolCallId>('call-123'),
    name: 'bash',
    argumentsDelta: '{"command":"ls"}',
  }
  yield {
    type: 'block-end',
    index: 1,
    block: {
      type: 'tool-call',
      id: brandString<ToolCallId>('call-123'),
      name: 'bash',
      arguments: '{"command":"ls"}',
    },
  }

  // 5. Token usage.
  yield { type: 'usage', usage: { inputTokens: 100, outputTokens: 50 } }

  // 6. Finish reason.
  yield { type: 'finish', reason: { kind: 'stop' } }
  // Alternatively, { kind: 'tool-calls' } requests tool execution.
}
```

### Các quy tắc chính

- Mỗi `block-start` đều có một `block-end` tương ứng.
- `index` tăng dần từ 0 và xác định thứ tự của khối nội dung.
- Một `tool-call-delta` mang văn bản JSON thô trong `argumentsDelta`, có thể truyền tất cả cùng lúc hoặc qua nhiều chunk.
- `finish` là chunk cuối cùng.
- Phát `usage` trước `finish`.

## GenerateOptions

`stream()` nhận kiểu `GenerateOptions` được export. Kiểu này bao gồm model, id nỗ lực suy luận (reasoning-effort) do adapter quản lý, lịch sử cuộc trò chuyện, system prompt, schema công cụ, các tham số sinh văn bản, stop sequences và tín hiệu huỷ bỏ (abort signal); hãy coi kiểu TypeScript được export bởi `@deepseek-ai/dsh-llm` là chuẩn xác. Ánh xạ các trường được hỗ trợ sang API của nhà cung cấp. Nếu nhà cung cấp không thể đáp ứng một trường, hãy ném ra `LlmError` với mã ổn định thay vì âm thầm bỏ qua trường đó.

Ghi đè `resolveModel(provider, model, signal?)` để trả về danh tính nhà cung cấp/model chính xác cùng siêu dữ liệu `context` và `reasoning` tuỳ chọn trong một lần tra cứu. Siêu dữ liệu suy luận chứa các id mờ (opaque) có thứ tự và tên hiển thị kèm giá trị mặc định được cấu hình tuỳ chọn; hãy giữ nguyên danh sách có thể lựa chọn chuẩn xác của adapter, bao gồm `off` khi API năng lực upstream trả về giá trị đó, thay vì nâng các giá trị này thành một enum cốt lõi. Tôn trọng tín hiệu (signal) tuỳ chọn cho việc tra cứu bất đồng bộ để việc huỷ bỏ và giải phóng đạt trạng thái lắng dịu (quiescence). Dịch vụ sẽ xác thực dữ liệu tổng hợp và từ chối các mức nỗ lực rõ ràng không được hỗ trợ trước `stream()`; việc bỏ qua `reasoning` đồng nghĩa model đó không có năng lực chọn mức nỗ lực suy luận.

## Đăng ký một bộ điều hợp

```ts ignore-check
ctx.llm.registerAdapter(['my-provider'], adapter)
```

Đối số đầu tiên liệt kê các tuyến (route) nhà cung cấp do adapter xử lý. `GenerateOptions.provider` chọn adapter đã đăng ký, trong khi `GenerateOptions.model` truyền id model do adapter quản lý mà không cần đăng ký vòng đời. Hãy ghi đè `listModels()` khi adapter có thể thông báo các lựa chọn model cho các bộ chọn.

## Sử dụng từ cordis.yml

```yaml
- id: my-llm
  name: './src/my-llm-adapter.ts'
  config:
    apiKey: !!js process.env.MY_API_KEY
    providers:
      - my-provider

- id: agent-loop
  name: '@deepseek-ai/dsh-agent-loop'
  config:
    agents:
      - id: main
        provider: my-provider
        model: my-model-v1
```

## Các bản triển khai tham khảo

Kho lưu trữ chứa các bản triển khai hoàn chỉnh:

- `packages/llm/llm-deepseek/` — Adapter DeepSeek sử dụng Messages API
- `packages/llm/llm-pi-ai/` — Adapter Pi AI sử dụng định dạng API khác

Hãy so sánh hai adapter đi kèm để thấy cùng một hợp đồng harness được triển khai trên các SDK nhà cung cấp khác nhau.

## Xử lý lỗi

Các adapter ném ra các lỗi truyền tải và giao thức dưới dạng giá trị `LlmError` với các mã ổn định. Vòng lặp agent bảo toàn lỗi và mã cho mục đích chẩn đoán và chính sách; nó không tự động chuyển đổi một `Error` thông thường. Mỗi yêu cầu HTTP của nhà cung cấp cũng phải gộp `attributionHeaders()` và chuyển tiếp `options.signal`.

```ts
import {
  attributionHeaders,
  LlmAdapter,
  LlmError,
  type GenerateOptions,
  type StreamChunk,
} from '@deepseek-ai/dsh-llm'

class HttpAdapter extends LlmAdapter {
  constructor(private readonly endpoint: string) {
    super()
  }

  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...attributionHeaders(),
      },
      body: JSON.stringify({ model: options.model, messages: options.messages }),
      ...options.signal ? { signal: options.signal } : {},
    })
    if (!response.ok) {
      throw new LlmError(`Provider API error: ${response.status}`, 'PROVIDER_HTTP_ERROR')
    }
    // A real adapter parses the response and emits the complete chunk sequence.
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
```
