# Hệ thống sự kiện

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/events.md)

Sự kiện là cơ chế giao tiếp cốt lõi giữa các plugin Cordis. Harness sử dụng sự kiện rộng rãi cho các điểm mở rộng liên kết lỏng (loosely coupled).

## Sử dụng cơ bản

### Lắng nghe sự kiện

```ts ignore-check
ctx.on('event-name', (payload) => {
  // Handle the event.
})
```

### Phát sự kiện

```ts ignore-check
ctx.emit('event-name', payload)
```

## Các chế độ sự kiện

Cordis cung cấp một số chế độ sự kiện cho các hợp đồng tương tác khác nhau.

### emit — phát sự kiện

Mọi listener đều chạy đồng bộ và các giá trị trả về bị bỏ qua:

```ts ignore-check
// Emit
ctx.emit('my-plugin/ready', { id: 'worker-1' })

// Listen
ctx.on('my-plugin/ready', ({ id }) => {
  console.log(`${id} is ready`)
})
```

### bail — ngắt sớm (short circuit)

Các listener chạy theo thứ tự; kết quả đầu tiên khác `null`, `false` hoặc `undefined` sẽ trở thành kết quả cuối cùng:

```ts ignore-check
// Dispatch
const result = ctx.bail('some-check', input)

// Listen: a returned value stops later listeners.
ctx.on('some-check', (input) => {
  if (shouldBlock(input)) return 'blocked'
  // Return null, false, or undefined to continue to the next listener.
})
```

### serial — thực thi tuần tự

Các listener chạy theo thứ tự đăng ký và các kết quả bất đồng bộ được await. Kết quả đầu tiên khác `null`, `false` hoặc `undefined` sẽ dừng việc thực thi tiếp theo:

```ts ignore-check
await ctx.serial('setup-phase', context)
```

### waterfall — xử lý nối tiếp

Mỗi listener có thể bọc kết quả xuôi dòng (downstream) để tạo thành chuỗi xử lý. Một listener **bắt buộc phải gọi `next()` để chuyển giao tiếp xuống hạ nguồn**; việc bỏ qua lệnh gọi này sẽ ngắt sớm đường ống:

```ts ignore-check
// Dispatch
const output = await ctx.waterfall('my-plugin/transform', input, async () => input)

// Listen: next() is mandatory.
ctx.on('my-plugin/transform', async (_input, next) => {
  const downstream = await next()
  return downstream.trim()
})
```

::: warning
Một waterfall listener **bắt buộc phải gọi `next()`**. Việc bỏ qua lệnh gọi này theo thiết kế sẽ làm ngắt sớm đường ống, kích hoạt hành vi đánh chặn (interception) và gateway.
:::

## Sự kiện có kiểu

Harness sử dụng tính năng gộp khai báo (declaration merging) của TypeScript cho các sự kiện an toàn kiểu:

```ts
import '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Events {
    'my-plugin/ready': (payload: { id: string }) => void
    'my-plugin/check': (input: string) => boolean | undefined
    'my-plugin/transform': (input: string, next: () => Promise<string>) => Promise<string>
  }
}

// ctx.on('my-plugin/ready', ...) and ctx.emit('my-plugin/ready', ...)
// are now inferred correctly.
```

## Sự kiện Cordis và bản ghi phiên

Các sự kiện Cordis trong Harness sử dụng tên theo dạng `namespace/action`, bao gồm `agent/pre-step`, `agent/request`, `agent/request-error`, `tools/result`, và `session/event`. Các vùng `cordis-surface` được tạo tự động trên [các trang hệ thống con](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/core.md) ghi lại đầy đủ chữ ký và chế độ.

`turn/*`, `step/*`, `tool/call`, `tool/result`, và `compaction/*` là các loại sự kiện phiên bền vững (durable session-event), không phải các sự kiện Cordis trùng tên. Để quan sát chúng, hãy lắng nghe `session/event` và kiểm tra `event.type`.

## Listener sự kiện là các effect

Một listener được đăng ký bằng `ctx.on()` sẽ tự động bị gỡ bỏ khi plugin của nó dỡ tải:

```ts ignore-check
export function apply(ctx: Context) {
  // This listener is removed when the plugin disposes.
  ctx.on('tools/result', handler)
}
```

## Ví dụ: plugin ghi log

Plugin này ghi log các lệnh gọi công cụ và kết quả:

```ts
import type { Context } from '@deepseek-ai/cordis'
import '@deepseek-ai/dsh-tools'

export const name = 'tool-logger'

export function apply(ctx: Context) {
  ctx.on('tools/result', (exec, result) => {
    console.log(`[tool] ${exec.name}(${JSON.stringify(exec.arguments)})`)
    const text = result.content
      .map(block => block.type === 'text' ? block.text : '')
      .join('')
    console.log(`[tool result] ${text.slice(0, 100)}`)
  })
}
```

## Các bước tiếp theo

- [Phân tầng năng lực](../practice/index.vi.md) — hiểu các sự kiện bên trong giao diện năng lực
- [Bộ điều hợp LLM](../practice/llm-adapter.vi.md) — triển khai một backend LLM hoàn chỉnh
