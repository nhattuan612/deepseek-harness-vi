# Cấu hình plugin

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/config.md)

Tiếp nhận cấu hình được cung cấp qua `cordis.yml`.

## Định nghĩa kiểu Config

Xuất một kiểu `Config` và một schema Schemastery cùng tên. Đặt các giá trị mặc định trực tiếp trên các trường của schema:

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export const name = 'my-plugin'

export interface Config {
  greeting: string
  maxRetries: number
  verbose?: boolean
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
  maxRetries: Schema.number().default(3),
  verbose: Schema.boolean().default(false),
})

export function apply(ctx: Context, config: Config) {
  console.log(config.greeting)  // User value or schema default.
}
```

Thêm cấu hình vào hàng plugin cục bộ đã chèn trong `scratch-plugin/cordis.yml`:

```yaml
- insert:
    - id: hello
      name: './src/my-plugin.ts'
      config:
        greeting: 'Hi there'
        maxRetries: 5
```

Khi tải plugin, Cordis sử dụng schema được xuất ra để xác thực cấu hình và điền các giá trị mặc định. Không xuất một plain object làm `Config`; nó không triển khai giao diện Standard Schema theo yêu cầu của Cordis.

## Xác thực bằng schema

Sử dụng Schemastery để biểu đạt các quy tắc xác thực chặt chẽ hơn:

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export const name = 'validated-plugin'

export interface Config {
  apiKey: string
  timeout: number
  mode: 'fast' | 'accurate'
}

export const Config = Schema.object({
  apiKey: Schema.string().required(),
  timeout: Schema.number().default(30000),
  mode: Schema.union(['fast', 'accurate']).default('fast'),
})

export function apply(ctx: Context, config: Config) {
  // config is validated and type-safe.
}
```

Schema sẽ chạy trong quá trình plugin tải. Cấu hình không hợp lệ sẽ làm thất bại quá trình tải với một thông báo lỗi rõ ràng để xử lý.

## Nguyên tắc thiết kế

### Không ghi cứng các giá trị có thể tinh chỉnh

Harness yêu cầu **bất kỳ thứ gì mà hai bản triển khai khác nhau có thể muốn thiết lập khác nhau đều phải là một trường cấu hình**.

```ts
// Wrong: hardcoded timeout.
const TIMEOUT = 30000

// Correct: configurable.
export interface Config {
  timeoutMs: number  // Defaults to 30000.
}
```

Tiêu chí kiểm tra là liệu `cordis.yml` có thể thay đổi giá trị đó mà không cần chỉnh sửa mã nguồn hay không.

### Báo lỗi rõ ràng khi cấu hình không hợp lệ

Biểu đạt các ràng buộc độc lập bên trong schema để cấu hình không hợp lệ sẽ báo lỗi ngay khi plugin tải. Việc tham chiếu đến các dịch vụ hoặc tài nguyên đã đăng ký đòi hỏi kỹ thuật dependency injection; [hướng dẫn về dịch vụ](../framework/service.vi.md) giới thiệu về quy ước này.

## Hoạt động với HMR

Một chỉnh sửa cấu hình sẽ thực hiện thay thế nóng (hot-replace) plugin: framework dỡ tải (unload) instance cũ và tải một instance mới. Do các đăng ký là các effect và tự động dọn dẹp chính mình, quá trình thay thế sẽ không giữ lại các đăng ký của instance cũ.

## Các bước tiếp theo

- [Đóng gói và cài đặt một plugin](./publish.vi.md) — phát hành plugin dưới dạng một package có thể cài đặt
- [Plugin và vòng đời](../framework/index.vi.md) — hiểu về vòng đời hoàn chỉnh của plugin
- [Dịch vụ và dependency](../framework/service.vi.md) — cung cấp một dịch vụ cho các plugin khác
