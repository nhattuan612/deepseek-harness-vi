# Plugin và vòng đời

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/index.md)

Trang này mô tả mô hình plugin của Cordis và máy trạng thái vòng đời.

## Máy trạng thái Fiber

Mỗi plugin được tải đều sở hữu một phạm vi **Fiber** với các trạng thái sau:

```
PENDING → LOADING → ACTIVE
                 ↘ FAILED
ACTIVE → UNLOADING → DISPOSED
```

| Trạng thái | Ý nghĩa |
|------|------|
| PENDING | Đã khai báo, nhưng các phần phụ thuộc bắt buộc chưa sẵn sàng |
| LOADING | Các phần phụ thuộc đã sẵn sàng và `apply` đang chạy |
| ACTIVE | Plugin đang chạy |
| FAILED | `apply` đã ném ra lỗi |
| UNLOADING | Plugin đang dỡ tải và giải phóng tài nguyên |
| DISPOSED | Plugin đã được dỡ tải hoàn toàn |

## Tải theo phần phụ thuộc

Một plugin có `inject` sẽ đợi mọi dịch vụ bắt buộc trước khi tải:

```ts ignore-check
export const inject = ['tools', 'llm']

export function apply(ctx: Context) {
  // ctx.tools and ctx.llm are ready here.
}
```

Nếu một dịch vụ bắt buộc biến mất, ví dụ như trong quá trình thay thế nhà cung cấp, plugin sẽ tự động dỡ tải (ACTIVE → DISPOSED) và tải lại khi dịch vụ xuất hiện trở lại.

## Tự động dọn dẹp

Mọi đăng ký được thực hiện qua `ctx` sẽ được hoàn tác khi plugin dỡ tải:

```ts ignore-check
export function apply(ctx: Context) {
  // Event listener: removed automatically on unload.
  ctx.on('some-event', handler)

  // Custom resource: the returned disposer runs on unload.
  ctx.effect(() => {
    const connection = createConnection()
    return () => connection.close()
  })
}
```

Framework theo dõi và giải phóng tất cả các thao tác này:
- `ctx.on(event, handler)` — listener sự kiện
- `ctx.tools.register(tool)` — đăng ký công cụ
- `ctx.llm.registerAdapter(names, adapter)` — đăng ký adapter LLM
- `ctx.effect(() => cleanup)` — tài nguyên tuỳ chỉnh

Trong quá trình dỡ tải, việc gọi disposer bắt đầu theo thứ tự ngược lại với lúc đăng ký, nhưng nhiều async disposer sẽ chạy đồng thời và không đảm bảo hoàn thành tuần tự. Hãy đặt quá trình dọn dẹp phụ thuộc thứ tự vào trong một disposer duy nhất được trả về từ một `ctx.effect()` và await các bước của nó một cách tuần tự tại đó.

## Ngữ cảnh lồng nhau

`ctx.plugin()` tạo ra một Fiber con kế thừa ngữ cảnh cha nhưng có vòng đời độc lập:

```ts ignore-check
export function apply(ctx: Context) {
  // Register a child plugin.
  ctx.plugin(childPlugin)

  // The child has its own Fiber and unloads with its parent.
}
```

## Ngữ nghĩa dispose

Để dừng sớm một thể hiện plugin:

```ts
import type { Context } from '@deepseek-ai/cordis'

declare const ctx: Context
declare function myPlugin(ctx: Context): void

const fiber = ctx.plugin(myPlugin)

// Dispose it manually later.
await fiber.dispose()
```

`dispose` đảm bảo:
1. Tất cả đăng ký do plugin sở hữu đều bị gỡ bỏ.
2. Các plugin con được dỡ tải đệ quy.
3. Promise trả về sẽ phân giải sau khi toàn bộ quá trình dọn dẹp bất đồng bộ hoàn tất.

## Thay thế nóng (HMR)

Khi `@deepseek-ai/dsh-hmr` được tải từ `cordis.yml`, việc chỉnh sửa tệp nguồn của plugin sẽ kích hoạt:

1. Dỡ tải plugin cũ và dọn dẹp các đăng ký của nó.
2. Tải mã mới.
3. Chạy `apply` mới.

Vì các đăng ký của plugin tự dọn dẹp, thay thế nóng không giữ lại bất kỳ đăng ký nào từ thể hiện cũ.

## Ví dụ vòng đời

```ts ignore-check
export function apply(ctx: Context) {
  console.log('plugin loading')

  ctx.effect(() => {
    console.log('effect registered')
    return () => console.log('effect cleaned up')
  })
}
```

Khi tải sẽ in ra:
```
plugin loading
effect registered
```

Khi dỡ tải sẽ in ra:
```
effect cleaned up
```

## Các bước tiếp theo

- [Dịch vụ và phần phụ thuộc](./service.vi.md) — hiển thị năng lực cho các plugin khác
- [Hệ thống sự kiện](./events.vi.md) — giao tiếp giữa các plugin
- [Hướng dẫn Cordis](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/index.md) — cùng vòng đời, dịch vụ và sự kiện được xây dựng từng bước trên runtime Cordis
