# Plugin đầu tiên của bạn

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md)

Hướng dẫn này sẽ tạo một plugin Harness tối thiểu và tải nó vào Web UI. Bắt đầu từ một bản checkout kho mã đã hoàn thành [hướng dẫn chạy từ mã nguồn](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md#run-from-source).

## Tạo một dự án cục bộ

Từ thư mục gốc của kho mã, tạo một dự án nháp cho bài hướng dẫn:

```sh
mkdir -p scratch-plugin/src
```

## Plugin là gì?

Trong Harness, một plugin là một TypeScript module xuất ra một hàm `apply`. Framework sẽ gọi `apply` khi tải plugin và truyền vào một đối tượng ngữ cảnh `ctx`, qua đó plugin đăng ký các năng lực (capabilities):

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'

export function apply(ctx: Context) {
  // Register capabilities here.
}
```

Đó là toàn bộ cấu hình hoàn chỉnh.

## Tạo tệp plugin

Tạo `scratch-plugin/src/my-plugin.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  // Required dependencies are ready before apply runs.
  console.log('[hello-plugin] plugin loaded!')
}
```

## Đăng ký trong cordis.yml

Chạy lệnh `pwd` từ thư mục gốc của kho mã, sau đó tạo `scratch-plugin/cordis.yml` dưới dạng một Web overlay để chèn plugin cục bộ. Thay thế `/absolute/path/to/deepseek-harness` bên dưới bằng đường dẫn được in ra:

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/my-plugin.ts'
```

Đường dẫn plugin bắt buộc phải là đường dẫn tuyệt đối. Một tệp bản vá (patch file) đóng góp cấu hình nhưng không làm thay đổi thư mục profile nơi loader phân giải các đường dẫn module.

Khởi động Web UI với overlay đó:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

Mở `http://127.0.0.1:3080`. Terminal sẽ in ra `[hello-plugin] plugin loaded!` trong quá trình khởi động.

## Tự động dọn dẹp

Bất kỳ thứ gì được đăng ký qua `ctx` — trình lắng nghe sự kiện (event listener), công cụ (tool), hoặc bộ hẹn giờ (timer) — đều được dọn dẹp tự động khi plugin được dỡ tải (unload). Bạn không cần phải gọi removeListener hoặc clearInterval thủ công.

Đối với một tài nguyên cần dọn dẹp tường minh, chẳng hạn như kết nối mạng, hãy sử dụng `ctx.effect()` để cung cấp hàm giải phóng (disposer):

```ts
import type { Context } from '@deepseek-ai/cordis'

export function apply(ctx: Context) {
  ctx.effect(() => {
    const timer = setInterval(() => {
      console.log('heartbeat')
    }, 5000)

    // The returned function runs when the plugin unloads.
    return () => clearInterval(timer)
  })
}
```

## Khai báo dependency

Nếu plugin sử dụng một dịch vụ khác chẳng hạn như `tools` hoặc `llm`, hãy khai báo dịch vụ đó trong `inject`:

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-tool-plugin'
export const inject = ['tools']

export function apply(ctx: Context) {
  // ctx.tools is ready here.
  ctx.tools.register(/* ... */)
}
```

Framework sẽ chờ tất cả các dịch vụ bắt buộc trước khi tải plugin.

## Ba dạng thức của plugin

Ngoài dạng module hàm, một plugin có thể sử dụng dạng đối tượng hoặc dạng lớp.

### Dạng đối tượng

```ts
import type { Context } from '@deepseek-ai/cordis'

export default {
  name: 'my-plugin',
  inject: ['tools'],
  apply(ctx: Context) {
    // ...
  },
}
```

### Dạng lớp

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

export default class MyService extends Service {
  static inject = ['tools']

  constructor(ctx: Context) {
    super(ctx, 'myService')
    // Perform synchronous initialization in the constructor.
  }
}
```

Dạng hàm là đủ cho hầu hết các trường hợp. Sử dụng dạng lớp khi plugin cung cấp một dịch vụ cho các plugin khác; xem [dịch vụ và dependency](../framework/service.vi.md).

## Các bước tiếp theo

- [Xây dựng một công cụ](./tool.vi.md) — tìm hiểu DSL định nghĩa công cụ
- [Cấu hình plugin](./config.vi.md) — tiếp nhận cấu hình từ người dùng
- [Hướng dẫn Cordis](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-tutorial/index.md) — framework plugin bên dưới, được xây dựng từ một thư mục nháp mà không cần API key
