# Dịch vụ và phần phụ thuộc

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/framework/service.md)

Dịch vụ là năng lực mà một plugin hiển thị cho các plugin khác. `inject` khai báo các dịch vụ mà một plugin yêu cầu.

## Dịch vụ là gì?

Trong Harness, `tools`, `llm`, và `agents` là các dịch vụ. Mỗi dịch vụ là một năng lực có tên được gắn vào `ctx`:

```ts ignore-check
ctx.tools    // ToolRuntime service
ctx.llm      // LLM service
ctx.agents   // Agent service
```

Bất kỳ plugin nào cũng có thể cung cấp dịch vụ để các plugin khác sử dụng.

## Sử dụng dịch vụ

Khai báo `inject` để sử dụng dịch vụ hiện có:

```ts ignore-check
export const inject = ['tools']

export function apply(ctx: Context) {
  // ctx.tools exists and is ready here.
  ctx.tools.register(/* ... */)
}
```

Khi `apply` chạy, mọi dịch vụ được khai báo bởi `inject` đều đã sẵn sàng. Nếu một dịch vụ chưa sẵn sàng, plugin sẽ đợi thay vì chạy.

## Cung cấp dịch vụ

### Kế thừa Service

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

export default class MetricsService extends Service {
  static inject = ['llm']  // A service may depend on other services.

  constructor(ctx: Context) {
    super(ctx, 'metrics')  // 'metrics' is the service name.
  }

  // Public service method.
  record(event: string, value: number) {
    // ...
  }
}
```

Sau khi tải plugin này, các consumer truy cập dịch vụ dưới dạng `ctx.metrics`:

```ts ignore-check
export const inject = ['metrics']

export function apply(ctx: Context) {
  ctx.metrics.record('tool_call', 1)
}
```

### Khai báo kiểu của dịch vụ

Sử dụng gộp khai báo (declaration merging) của TypeScript để định kiểu cho `ctx.metrics`:

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    metrics: MetricsService
  }
}

export default class MetricsService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'metrics')
  }

  record(event: string, value: number) { /* ... */ }
}
```

## Hành vi phần phụ thuộc

### Phần phụ thuộc bắt buộc và tuỳ chọn

```ts ignore-check
// Required: the plugin does not load while the service is absent.
export const inject = ['tools']

// Optional: omit inject and query with ctx.get() at the use site.
export function apply(ctx: Context) {
  const metrics = ctx.get('metrics')
  metrics?.record('plugin_loaded', 1)
}
```

### Khi một dịch vụ biến mất

Nếu một dịch vụ bắt buộc biến mất trong khi ứng dụng đang chạy, ví dụ vì nhà cung cấp của nó dỡ tải:

1. Các plugin phụ thuộc sẽ tự động dispose.
2. Chúng sẽ tải lại khi dịch vụ xuất hiện trở lại.

Điều này ngăn một plugin gọi vào một dịch vụ không còn tồn tại.

## Cô lập dịch vụ

`cordis.yml` có thể cô lập các dịch vụ để các nhóm plugin riêng biệt nhìn thấy các thể hiện riêng biệt của cùng một dịch vụ:

```yaml
- id: group-a
  name: '@deepseek-ai/cordis-plugin-group'
  group: true
  isolate:
    shell: true
  config:
    - name: '@deepseek-ai/dsh-bash-local'
      config:
        timeoutMs: 5000
    - name: './src/plugin-a.ts'

- id: group-b
  name: '@deepseek-ai/cordis-plugin-group'
  group: true
  isolate:
    shell: true
  config:
    - name: '@deepseek-ai/dsh-bash-local'
      config:
        timeoutMs: 60000
    - name: './src/plugin-b.ts'
```

`plugin-a` và `plugin-b` mỗi bên nhìn thấy thể hiện Bash trong nhóm riêng của mình, không gây ảnh hưởng chéo giữa các nhóm.

## Các dịch vụ tích hợp sẵn của Harness

Kho lưu trữ tự động tạo tên dịch vụ, các phương thức public và vị trí nguồn vào [trang hệ thống con](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/core.md) của từng dịch vụ. Hãy sử dụng các vùng được tạo tự động đó cùng giao diện TypeScript của dịch vụ trong khi phát triển plugin; không duy trì danh sách tĩnh thứ hai.

## Các bước tiếp theo

- [Hệ thống sự kiện](./events.vi.md) — giao tiếp giữa các plugin mà không bị ghép nối chặt chẽ
- [Phân tầng năng lực](../practice/index.vi.md) — sử dụng dịch vụ làm giao diện năng lực
