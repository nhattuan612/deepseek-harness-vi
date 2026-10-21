# Xây dựng một công cụ

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.md)

Hướng dẫn này sẽ thêm một công cụ `greet` vào Web UI. Hãy hoàn thành [Plugin đầu tiên của bạn](./index.vi.md) trước và giữ lại thư mục `scratch-plugin` của bài đó.

## Tạo plugin công cụ

Thay thế `scratch-plugin/src/my-plugin.ts` bằng:

```ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'The name to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }))
}
```

`inject` yêu cầu Cordis chờ registry công cụ sẵn sàng. `defineTool` suy luận và xác thực `args` từ `parameters`; `execute` trả về giá trị chuẩn hóa (canonical value) được khai báo bởi `output.schema`, và `output.render` chuyển đổi giá trị đó thành nội dung hiển thị cho model.

## Chạy và gọi công cụ

Khởi động lại lệnh phát triển nếu nó chưa chạy:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

Mở `http://127.0.0.1:3080` và yêu cầu: `Use the greet tool to greet Ada.` Model có thể gọi `greet` và nhận `Hello, Ada!` làm kết quả công cụ.

## Các bước tiếp theo

- [Cấu hình plugin](./config.vi.md) — cho phép tùy chỉnh lời chào.
- [Tài liệu tham khảo tạo công cụ](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/adding-a-tool.md) — tra cứu về schema lồng nhau, giá trị chuẩn hóa, tác vụ nền, hook chính sách, chế độ PTC và thẻ UI.
- [Phân lớp năng lực](../practice/index.vi.md) — tách một năng lực có thể thay thế thành các package Service Definition, Service Provider và Consumer.
