# Đóng gói và cài đặt một plugin

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)

Các bài hướng dẫn trước đã tải một plugin cục bộ thông qua một overlay `--patch`. Hướng dẫn này sẽ đóng gói nó thành một **bundle** có thể cài đặt, cài đặt nó vào một **profile** bằng `dsh plugin add`, và giải thích thứ tự phân lớp quyết định cấu hình được kết hợp cuối cùng. Bài viết giả định CLI `dsh` đã được cài đặt. Hãy hoàn thành [cấu hình plugin](./config.vi.md) trước.

Nếu muốn sử dụng một bản checkout mã nguồn mới, hãy hoàn thành [phần chạy từ mã nguồn](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md#run-from-source), giữ thư mục `hello-plugin` của bài hướng dẫn này ở thư mục gốc của kho mã, và chạy các lệnh `dsh ...` còn lại từ đó dưới dạng `pnpm dsh ...`. Xem [thực thi từ mã nguồn](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md#source-execution) để biết hành vi của build và launcher.

## Hai khái niệm, hai manifest

Việc cài đặt được xây dựng dựa trên hai khái niệm. Cả hai đều được mô tả bởi một tệp `package.json`, nhưng chúng mang các loại manifest khác nhau dưới khóa `dsh`, và chúng trả lời cho các câu hỏi khác nhau:

- Một **bundle** là một npm package cung cấp một lớp cấu hình. Manifest của nó khai báo `dsh.bundle`, trả lời câu hỏi "package này đóng góp những gì?": một tệp bản vá (patch file) để chèn hoặc ghi đè các hàng plugin.
- Một **profile** là một thư mục nằm dưới `$DSH_HOME/profiles/<name>` mô tả một tổ hợp có thể chạy được. Manifest của nó khai báo `dsh.profile`, trả lời câu hỏi "những bundle nào kết hợp nên cấu hình này, theo thứ tự nào?".

Bundle là thứ bạn tạo ra và phân phối; profile là thứ mà người dùng khởi động bằng `dsh --profile <name>`. Không có thứ gì vừa là bundle vừa là profile.

### Manifest của bundle

Tạo thư mục package:

```sh
mkdir -p hello-plugin
```

```
hello-plugin/
├── package.json       # declares dsh.bundle
├── cordis.patch.yml   # the layer applied when a profile lists this bundle
└── index.js           # plugin modules the patch rows reference
```

Tạo `hello-plugin/package.json`:

```json
{
  "name": "dsh-hello-plugin",
  "version": "0.1.0",
  "type": "module",
  "main": "index.js",
  "files": ["index.js", "cordis.patch.yml"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

Tạo `hello-plugin/index.js` với điểm vào (entry point) của plugin:

```js
export const name = 'hello-plugin'

export function apply() {
  console.log('[hello-plugin] plugin loaded!')
}
```

Tạo `hello-plugin/cordis.patch.yml`. Bản vá này là một mảng YAML giống như các overlay `--patch` bạn đã viết, ngoại trừ việc các hàng plugin tham chiếu package theo tên thay vì đường dẫn nguồn tương đối để cơ chế phân giải của Node tìm thấy mã nguồn đã cài đặt:

```yaml
- insert:
    - id: hello
      name: dsh-hello-plugin
```

`patch` cũng chấp nhận một danh sách tệp có thứ tự, ví dụ `["./base.patch.yml", "./web.patch.yml"]`; launcher sẽ áp dụng chúng theo thứ tự đó như một lớp duy nhất, và các đường dẫn plugin tương đối của mỗi tệp sẽ được phân giải cạnh tệp đó. Một package không có khai báo `dsh.bundle` vẫn cài đặt được, nhưng chỉ như một dependency thông thường: `dsh plugin` sẽ in cảnh báo và không kích hoạt lớp cấu hình nào. Sử dụng định dạng package đó cho thư viện mà các package plugin import vào thay vì một plugin mà người dùng bật lên.

Khai báo các bản phát hành DSH mà bundle hỗ trợ bằng dải SemVer trong `engines.dsh`, ví dụ `"engines": { "dsh": ">=0.2.0 <0.3.0" }`. Việc cài đặt và khởi động profile sẽ từ chối một bundle nếu phiên bản DSH đang chạy không thỏa mãn dải yêu cầu đó; nếu không có `engines.dsh`, chúng sẽ kiểm tra dải peer dependency `@deepseek-ai/dsh*` của bundle để thay thế ([quy tắc](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/app-boot/README.md#profiles)).

### Manifest của profile

Thư mục profile chứa hai tệp:

- `package.json` — các dependency plugin ngoài cây của profile (do pnpm quản lý) cùng manifest `dsh.profile` kèm danh sách `bundles` có thứ tự của nó.
- `cordis.patch.yml` — lớp bản vá của chính người dùng, được áp dụng sau mọi lớp bundle.

Bạn không bao giờ phải viết manifest profile thủ công: `dsh --profile <name> --from-default-profile <template>` có thể tạo hoặc đặt lại một profile từ một application template có sẵn, trong khi `dsh plugin` sẽ tạo một profile dựa trên base và duy trì danh sách bundle đã cài đặt của nó. [Tài liệu tham khảo hành vi CLI](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md#profile-boot) quy định các quy tắc tạo; phần tiếp theo sẽ hướng dẫn quy trình với plugin.

## Cài đặt vào một profile

`dsh plugin --profile <name> <args...>` chuyển tiếp lệnh tới pnpm trong thư mục profile, vì vậy mọi lệnh của pnpm đều hoạt động. Từ thư mục chứa `hello-plugin`, hãy cài đặt bản checkout của package:

```sh
dsh plugin --profile demo add ./hello-plugin
```

Lần sử dụng đầu tiên sẽ khởi tạo profile (với `@deepseek-ai/dsh-base` là bundle đầu tiên), pnpm liên kết (link) bản checkout, và `dsh` nối thêm bundle vào `dsh.profile.bundles` vì package có khai báo `dsh.bundle`:

```json
{
  "name": "dsh-profile-demo",
  "private": true,
  "dependencies": {
    "dsh-hello-plugin": "link:/path/to/hello-plugin"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "dsh-hello-plugin"
      ]
    }
  }
}
```

Một bản checkout được liên kết vẫn giữ `node_modules` của riêng nó. Hãy khai báo các package dsh mà phiên bản của chúng bắt buộc phải chia sẻ với host dưới cả `peerDependencies` lẫn `devDependencies`, tương tự như cách các package của harness thực hiện. Tại vị trí tra cứu của manifest đó, các peer hiện diện trong quá trình phân giải runtime của dsh đang chạy sẽ sử dụng bản sao của bản cài đặt; bản sao devDependency phục vụ cho trình kiểm tra kiểu và các bài kiểm thử độc lập của bạn. Hãy giữ các dependency bên thứ ba có phiên bản độc lập và các tiện ích dsh không trạng thái (stateless) dưới mục `dependencies`.

Các import liên kết thông thường tuân theo thứ tự tổ tiên (ancestor order) của Node và kiểm tra khai báo peer hiện tại của từng thư mục. Một package vật lý ở gần hơn sẽ được ưu tiên trước một khai báo peer ở cấp cao hơn. Đích liên kết có thể không có `package.json`; các peer của tổ tiên vẫn áp dụng, ngay cả khi không có `node_modules` vật lý bên cạnh manifest đó. Lệnh `require.resolve(..., { paths })` tường minh luôn là native, bao gồm cả các đường dẫn bên trong một profile. Các quy tắc này được chia sẻ chung bởi các kiểu khởi chạy npm, Desktop và source; chúng không làm mất hiệu lực các module đã tải hoặc xác thực dải phiên bản peer. Xem [quy tắc phân giải](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/architecture/2026-09-19-profile-resolution-lookup-order.md) để biết hành vi truy vấn phạm vi và tệp.

Việc liên kết một bản checkout diện rộng không áp dụng cơ chế chặn peer (peer interception) cho các thư mục package của chính bản cài đặt đang chạy. Các liên kết có đích nằm bên trong profile, bao gồm cả pnpm store của nó, vẫn là nội dung cài đặt thuộc sở hữu của profile chứ không phải các gốc liên kết bên ngoài. Các liên kết bên ngoài chồng chéo không làm thay đổi thứ tự tra cứu: mỗi yêu cầu vẫn bắt đầu từ thư mục của bên import.

Xác minh lớp cấu hình mà không cần khởi động, sau đó khởi động:

```sh
dsh --profile demo --dump-config   # shows a "# == dsh-hello-plugin" layer
dsh --profile demo
```

`dsh plugin --profile demo remove dsh-hello-plugin` sẽ xóa cả dependency lẫn lớp cấu hình đó.

## Thứ tự tải

Cấu hình thực tế được kết hợp trên một gốc rỗng bằng cách áp dụng tuần tự theo thứ tự sau:

1. Từng bản vá bundle được nêu tên trong danh sách `dsh.profile.bundles` của profile, theo thứ tự trong danh sách — `@deepseek-ai/dsh-base` trước tiên, sau đó là từng bundle đã cài đặt theo thứ tự chúng được thêm vào.
2. Tệp `cordis.patch.yml` của chính profile.
3. Tệp `$DSH_HOME/cordis.patch.yml` cấp home — các tùy chọn cục bộ của máy được chia sẻ cho mọi profile.
4. Từng overlay `--patch <path>`, theo thứ tự argv.

Các đối số của ứng dụng (app arguments) không phải là một lớp bản vá khác. Một surface bundle có thể phân giải chúng thông qua một dịch vụ thông thường thuộc sở hữu của ứng dụng, được mô tả bên dưới.

Các lớp phía sau sẽ chiến thắng trên từng hàng, và một bản vá sẽ thay thế toàn bộ giá trị `config` của một hàng thay vì gộp sâu (deep-merge) các khóa. Hai hệ quả dành cho tác giả bundle:

- Bản vá của bạn có thể ghi đè các hàng từ các lớp trước đó theo `id` — tương tự cách [bundle dsh-web-app](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/web-app/cordis.patch.yml) ghi đè các hàng của `dsh-base` — nhưng phải nêu lại toàn bộ các khóa mà hàng đó cần, chứ không chỉ riêng khóa đã thay đổi.
- Người dùng có thể ghi đè các hàng của bạn trong tệp `cordis.patch.yml` của profile mà không cần chạm vào package của bạn, vì vậy hãy ưu tiên các giá trị cấu hình mặc định mà người dùng có xu hướng giữ lại và để schema đảm nhận phần còn lại.

Các tên bundle tích hợp sẵn (in-box) luôn được phân giải từ chính bản cài đặt dsh; pnpm chỉ quản lý các package ngoài cây, do đó bundle của bạn có thể tin cậy rằng `@deepseek-ai/dsh-base` luôn hiện diện và ở bản mới nhất.

## Cung cấp dòng lệnh riêng cho surface bundle

Một bundle định nghĩa một ứng dụng có thể chạy được sẽ gắn một plugin provider thông thường:

```yaml
- id: hello-startup
  name: 'dsh-hello-plugin/startup'
```

Plugin này xuất ra `inject = ['cmdlineArgs']`, gọi `parseCmdline` từ [`@deepseek-ai/dsh-cmdline`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/cmdline/README.md) với chương trình commander của riêng nó, và cung cấp dịch vụ thuộc sở hữu ứng dụng từ action của chương trình. Launcher trao cho mọi plugin cùng các đối số bất biến sau các cờ launcher, vì vậy các cờ đặc thù của ứng dụng không cần thay đổi launcher và nhiều plugin có thể cùng phân tích snapshot đó. Hàng Loader không cần đánh dấu launcher hay loại đặc biệt nào.

Các hàng được định cấu hình bởi những đối số đó sẽ inject dịch vụ của provider và đọc nó từ các tùy chọn `!!js` của chính chúng, với giá trị triển khai đặt bên cạnh làm phương án dự phòng:

```yaml
- id: my-app
  name: '@example/my-app'
  inject: [myAppStartup]
  config:
    port: !!js ctx.myAppStartup.port ?? 8080
```

Khi chạy với `--help`, provider không phát hành dịch vụ nào, do đó các hàng đó không bao giờ kích hoạt. Loader gắn tổ hợp một lần, chờ các injection thông thường của từng hàng, và chỉ khi đó mới đánh giá cấu hình `!!js` của hàng đó theo ngữ cảnh đã inject.

## Cài đặt từ GitHub: lưu ý về script bản dựng

Việc phát hành lên registry là không bắt buộc — người dùng có thể cài đặt trực tiếp từ một git host:

```sh
dsh plugin --profile demo add github:you/hello-plugin
```

Tuy nhiên, cài đặt qua git sẽ lấy về **mã nguồn, chứ không phải artifact đã biên dịch**: không có gì chạy script `build` của bạn, do đó một package TypeScript tải về sẽ không có đầu ra trong `lib/` và không thể tải được. Hai việc bắt buộc phải diễn ra, mỗi bên một việc:

- **Tác giả** cung cấp một script `prepare` — pnpm sẽ chạy script này sau khi cài đặt qua git — để build các điểm vào đã công bố từ mã nguồn theo cách độc lập: nó không được giả định ngữ cảnh chỉ dành cho phát triển như một monorepo liền kề. Cấu hình tsdown chuyên dụng có thể biên dịch `src/` mà không cần tham chiếu dự án (project references) hay kiểm tra kiểu.
- **Người dùng** đưa bản build vào danh sách cho phép (allowlist). pnpm ≥10 từ chối chạy script `prepare` của một git dependency cho đến khi nó được cho phép tường minh, vì vậy lệnh `add` đầu tiên sẽ thất bại; `dsh` sẽ chỉ ra cách khắc phục — sao chép chính xác package key mà pnpm đã in vào tệp `pnpm-workspace.yaml` của profile:

  ```yaml
  allowBuilds:
    dsh-hello-plugin: true
  ```

  và chạy lại lệnh `add`.

Hãy coi sự cho phép đó là **quyền thực thi mã của package trên máy của bạn tại thời điểm cài đặt**, nằm ngoài bất kỳ sandbox nào mà agent đang chạy. Chỉ cho phép các package mà bạn tin tưởng mã nguồn của chúng, và hãy ghim một commit (`github:you/hello-plugin#<sha>`) để một lần push sau này không thể âm thầm thay đổi những gì sẽ chạy.

Nếu bạn không muốn yêu cầu người dùng cấp quyền đó, hãy phân phối các artifact đã biên dịch sẵn — cả hai hình thức đều không cần bất kỳ quyền build nào:

- **Phát hành lên npm** với thư mục `lib/` được build tại thời điểm `pnpm publish`; lệnh `dsh plugin add your-package` sau đó sẽ cài đặt mã đã biên dịch sẵn.
- **Phân phối file tarball** từ `pnpm pack`; người dùng chạy `dsh plugin add ./hello-plugin-0.1.0.tgz`.

## Các bước tiếp theo

- [Plugin và vòng đời](../framework/index.vi.md) — toàn bộ vòng đời của plugin
- [Tài liệu tham khảo hành vi CLI](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md) — độ ưu tiên phân lớp chính xác, các cờ và cơ chế hoạt động của profile
