# Thiết kế năng lực ba vai trò

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/practice/index.md)

Trang này gồm hai phần: tài liệu tham khảo khái niệm cho mẫu thiết kế năng lực ba vai trò, tiếp theo là hướng dẫn nâng cao để xây dựng một năng lực. Hãy hoàn thành [lộ trình plugin cơ bản](../basic/index.vi.md) và [hướng dẫn dịch vụ](../framework/service.vi.md) trước.

## Tài liệu tham khảo khái niệm

Khi một năng lực đủ tổng quát để cần các nhà cung cấp có thể thay thế được, chẳng hạn như thực thi Bash, Harness phân tách thành ba vai trò: một **Định nghĩa dịch vụ (Service Definition)**, một **Nhà cung cấp dịch vụ (Service Provider)**, và một **Bên tiêu thụ (Consumer)**. Đặt các vai trò vào các package riêng biệt khi chúng cần phát triển hoặc thay thế độc lập; mặt khác một package có thể sở hữu nhiều hơn một vai trò. Toàn bộ năng lực hoàn chỉnh chính là đường nối (seam) của nó. Không có vai trò đơn lẻ nào là một seam.

## Ví dụ về Bash

Năng lực thực thi Bash bao gồm:

- **Định nghĩa dịch vụ** (`dsh-shell`) — định nghĩa dịch vụ Cordis cùng các kiểu yêu cầu và kết quả của Bash
- **Nhà cung cấp dịch vụ** (`dsh-bash-local`) — thực thi các lệnh trên máy cục bộ
- **Bên tiêu thụ** (`dsh-tool-bash`) — hiển thị năng lực dưới dạng công cụ mà mô hình có thể gọi

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  dsh-shell   │────▶│  dsh-bash-local  │     │ dsh-tool-bash│
│(definition) │     │    (provider)     │     │(consumer/tool)│
└─────────────┘     └──────────────────┘     └──────────────┘
       ▲                                            │
       └────────────────────────────────────────────┘
                    inject: ['shell']
```

## Lợi ích của việc phân tách

### Thay thế các nhà cung cấp

Một Định nghĩa dịch vụ có thể có nhiều nhà cung cấp được lựa chọn thông qua `cordis.yml`:

```yaml
# Local execution
- name: '@deepseek-ai/dsh-bash-local'

# Replace this row with another package that provides the same service.
```

Định nghĩa dịch vụ và công cụ vẫn không thay đổi trong khi nhà cung cấp thay đổi.

### Phát triển độc lập

- Định nghĩa dịch vụ hiếm khi thay đổi sau khi các bên gọi đã phụ thuộc vào hợp đồng của nó.
- Các Nhà cung cấp dịch vụ có thể cải thiện hiệu năng và bảo mật một cách độc lập.
- Các Bên tiêu thụ có thể thay đổi cách hiển thị năng lực cho mô hình.

### Tách rời các phần phụ thuộc

- Nhà cung cấp dịch vụ phụ thuộc vào Định nghĩa dịch vụ.
- Bên tiêu thụ phụ thuộc vào Định nghĩa dịch vụ.
- Nhà cung cấp dịch vụ và Bên tiêu thụ **không phụ thuộc vào nhau**.

[Tài liệu tham khảo capability-seam](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md) nắm giữ các họ tích hợp sẵn hiện tại và các liên kết package.

## Hướng dẫn: phát triển một năng lực ba vai trò

### Bước 1: viết Định nghĩa dịch vụ

```ts ignore-check
// packages/my-cap/my-cap/src/index.ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    myCap: MyCapService
  }
}

export abstract class MyCapService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'myCap')
  }

  /** Execute the capability. */
  abstract execute(request: MyCapRequest): Promise<MyCapResult>
}

export interface MyCapRequest {
  input: string
}

export interface MyCapResult {
  output: string
}
```

### Bước 2: viết Nhà cung cấp dịch vụ

```ts ignore-check
// packages/my-cap/my-cap-local/src/index.ts
import type { Context } from '@deepseek-ai/cordis'
import { MyCapService, type MyCapRequest, type MyCapResult } from '@deepseek-ai/dsh-my-cap'

class MyCapLocal extends MyCapService {
  async execute(request: MyCapRequest): Promise<MyCapResult> {
    // Local provider behavior.
    return { output: request.input.toUpperCase() }
  }
}

export const name = 'my-cap-local'

export function apply(ctx: Context) {
  ctx.plugin(MyCapLocal)
}
```

### Bước 3: viết bên tiêu thụ

```ts ignore-check
// packages/my-cap/tool-my-cap/src/index.ts
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'tool-my-cap'
export const inject = ['tools', 'myCap']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'my_cap',
    description: 'Execute my capability.',
    parameters: {
      input: { type: 'string', required: true },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      const result = await ctx.myCap.execute({ input: args.input })
      return result.output
    },
  }))
}
```

### Kết hợp chúng trong cordis.yml

```yaml
- name: '@deepseek-ai/dsh-my-cap-local'
- name: '@deepseek-ai/dsh-tool-my-cap'
```

## Các điểm lưu ý trong thiết kế

- **Không phân tách quá sớm** — chỉ sử dụng các package riêng biệt khi các vai trò cần phát triển độc lập. Một plugin công cụ đơn giản thì không cần.
- **Định nghĩa dịch vụ nắm giữ các kiểu Request/Result** — Nhà cung cấp dịch vụ và Bên tiêu thụ chỉ phụ thuộc vào package Định nghĩa dịch vụ.
- **Rõ ràng > ngầm định** — xử lý các giá trị mặc định trong một bước `resolve(request): Spec` rõ ràng thay vì ẩn các biểu thức `?? default` bên trong `run()`.

## Các bước tiếp theo

- [Bộ điều hợp LLM](./llm-adapter.vi.md) — triển khai một nhà cung cấp LLM
