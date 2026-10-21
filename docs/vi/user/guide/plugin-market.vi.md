# Chợ plugin

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md)

## Tóm tắt

Một chợ plugin (plugin market) là một tệp chỉ mục JSON duy nhất liệt kê các bundle DSH có thể cài đặt cùng với tiêu đề, biểu tượng, tác giả và phiên bản của chúng. Hãy bật bundle thử nghiệm **Chợ plugin tùy chỉnh** để duyệt các chợ trong tab **Khám phá** trên trang Plugin và cài đặt một phiên bản được liệt kê sau khi xác nhận. Để xuất bản một chợ, hãy viết hoặc tạo một tệp chỉ mục và phục vụ nó cùng với các tệp biểu tượng từ bất kỳ máy chủ tĩnh nào.

## Mục lục

- [Bật tính năng Khám phá](#turn-on)
- [Duyệt và cài đặt](#browse-and-install)
- [Xuất bản một chỉ mục](#publish-an-index)
- [Tạo chỉ mục bằng bộ tạo tham chiếu](#generate-an-index)
- [Tài liệu tham khảo định dạng chỉ mục](#index-format)
- [Tìm hiểu thêm](#further-exploration)

<a id="turn-on"></a>
## Bật tính năng Khám phá

Mở **Plugin**, chọn **Thêm** bên cạnh **Plugin thử nghiệm**, tìm **Chợ plugin tùy chỉnh**, và bật nó lên. Một tab **Khám phá** xuất hiện bên cạnh **Đã cài đặt**, và Chế độ nhà sáng tạo có thêm công cụ chỉ đọc `plugin_market`. Tắt gói này sẽ xóa bỏ cả hai.

DSH không đóng gói sẵn bất kỳ nguồn chỉ mục nào. Chọn **Khám phá**, chọn **Thêm nguồn chỉ mục**, và nhập URL của một tệp chỉ mục. URL phải sử dụng `http:` hoặc `https:` và không được chứa tên người dùng, mật khẩu hoặc fragment `#`. Bất kỳ ai trên đường truyền mạng đều có thể thay đổi một chỉ mục `http:`, bao gồm cả các thông số cài đặt mà nó liệt kê, vì vậy hãy sử dụng `https:` cho một chợ được truy cập qua mạng mà bạn không kiểm soát. Mỗi nguồn thuộc về profile hiện tại.

<a id="browse-and-install"></a>
## Duyệt và cài đặt

Menu chợ ở bên trái thanh công cụ cho phép chuyển đổi giữa các nguồn và mở **Quản lý nguồn chỉ mục…**, nơi mỗi nguồn hiển thị lỗi gần nhất của nó. Tính năng tìm kiếm khớp với tên, tác giả, từ khóa, cùng với tiêu đề, mô tả, danh mục và nhãn ở mọi ngôn ngữ, đồng thời chấp nhận lỗi chính tả nhẹ; kết quả hiển thị theo thứ tự khớp nhất cho đến khi bạn chọn thứ tự khác. Menu **Nhãn**, các thẻ danh mục, và menu **Sắp xếp** sử dụng các danh mục, nhãn và khóa sắp xếp do chợ khai báo, và **Ngày phát hành** sắp xếp theo phiên bản mới nhất của từng plugin.

Mỗi thẻ hiển thị phiên bản khuyến nghị của plugin: phiên bản ổn định cao nhất tương thích với DSH đang chạy; nếu không có phiên bản ổn định tương thích, thẻ hiển thị bản phát hành trước cao nhất. **Cài đặt** mở một hộp thoại xác nhận với nguồn của phiên bản đó: gói npm và registry, hoặc kho lưu trữ Git, commit và thư mục. Việc xác nhận sẽ bắt đầu quá trình cài đặt plugin bình thường, bao gồm việc kiểm tra tính tương thích và registry; không có gì được cài đặt nếu không có xác nhận đó.

Chọn một thẻ để mở trang của plugin đó. Danh sách **Phiên bản** hiển thị mọi phiên bản được liệt kê cùng với tính tương thích của nó và cung cấp nút **Cài đặt** cho bất kỳ phiên bản nào mà DSH chấp nhận, bao gồm cả các bản phát hành cũ hơn và các bản phát hành trước. Một thẻ hiển thị **Đã cài đặt**, **Có bản cập nhật**, hoặc **Do DSH cung cấp** sẽ mở bundle đã cài đặt thay thế.

Các chợ là nội dung của bên thứ ba. Một chợ tự chọn tiêu đề, mô tả, biểu tượng, tác giả và nguồn của từng plugin; DSH chỉ kiểm tra định dạng tệp chứ không xác minh những thông tin đó. Chỉ thêm các nguồn bạn tin cậy, và kiểm tra nguồn trong hộp thoại xác nhận trước khi cài đặt.

<a id="publish-an-index"></a>
## Xuất bản một chỉ mục

Một chỉ mục là một tệp JSON UTF-8, mặc định tối đa 128 MiB, được phân phối với mã trạng thái 2xx và không có chuyển hướng (redirect). Hãy đặt nó trên bất kỳ máy chủ tĩnh nào, ví dụ như GitLab Pages, GitHub Pages, hoặc một dịch vụ lưu trữ đối tượng phục vụ qua HTTPS.

Biểu tượng có thể ở dạng nội tuyến (inline) hoặc tệp riêng biệt. Biểu tượng nội tuyến là một URL `data:` base64 trong chỉ mục; nó không cần yêu cầu mạng bổ sung nhưng làm cho chỉ mục lớn hơn. Biểu tượng riêng biệt là một URL. Một biểu tượng tương đối sẽ phân giải dựa trên URL của chỉ mục, tương tự như cách một hình ảnh trong trang web phân giải theo trang web: đối với một chỉ mục tại `https://market.example/dsh/index.json`, `"icon": "icons/foo.svg"` sẽ tải `https://market.example/dsh/icons/foo.svg`. Do đó, việc xuất bản chỉ mục và một thư mục `icons/` cạnh nhau hoạt động trên bất kỳ máy chủ nào mà không cần chỉnh sửa tệp. Một URL biểu tượng tuyệt đối trên một origin khác (giao thức, máy chủ và cổng) bắt buộc phải sử dụng `https:`.

Đây là một chỉ mục tối giản với một plugin npm và một plugin từ một monorepo Git:

```json
{
  "format": 1,
  "title": { "en": "Team plugins", "zh": "团队插件" },
  "plugins": [
    {
      "name": "dsh-plugin-foo",
      "title": "Foo",
      "description": "Adds the foo tool",
      "icon": "icons/foo.svg",
      "author": "Jane Doe",
      "homepage": "https://github.com/jane/dsh-plugin-foo#readme",
      "repository": { "url": "https://github.com/jane/dsh-plugin-foo" },
      "versions": [
        { "version": "1.1.0", "publishTimestamp": 1790476800, "source": { "type": "npm" }, "engines": { "dsh": ">=0.2.0-rc.2" } },
        { "version": "1.0.0", "publishTimestamp": 1788000000, "source": { "type": "npm" } }
      ]
    },
    {
      "name": "@team/dsh-bar",
      "versions": [
        {
          "version": "0.3.0",
          "publishTimestamp": 1789000000,
          "source": {
            "type": "git",
            "url": "https://gitlab.example.com/team/dsh-plugins",
            "commit": "3f9c2e1d8a4b6c0e7f1a2b3c4d5e6f708192a3b4",
            "path": "packages/bar"
          }
        }
      ]
    }
  ]
}
```

DSH sẽ từ chối toàn bộ chỉ mục khi bất kỳ quy tắc nào bên dưới bị vi phạm và hiển thị lý do, kèm theo đường dẫn JSON của giá trị vi phạm, bên dưới nguồn trong mục **Quản lý nguồn chỉ mục…**.

<a id="generate-an-index"></a>
## Tạo chỉ mục bằng bộ tạo tham chiếu

Kho lưu trữ bao gồm một [bộ tạo tham chiếu](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/plugin-market-generator/README.md) giúp xây dựng một chỉ mục từ danh sách thuần túy. Viết một tên gói npm hoặc URL kho lưu trữ Git https trên mỗi dòng; các dòng trống và các dòng bắt đầu bằng `#` sẽ bị bỏ qua:

```text
@team/dsh-foo
https://gitlab.example.com/team/dsh-plugins
```

Chạy nó từ một bản checkout DSH:

```sh
pnpm --filter @deepseek-ai/dsh-plugin-market-generator start --input plugins.txt --output site/index.json --title "Team plugins"
```

Đối với gói npm, chỉ mục liệt kê mọi phiên bản chưa bị deprecated và có khai báo `dsh.bundle`. Đối với kho lưu trữ Git, nó tìm các gói bundle trên nhánh mặc định và liệt kê các phiên bản của chúng tại các thẻ (tag) `vX.Y.Z`, `X.Y.Z`, và `<name>@X.Y.Z`, cộng với phiên bản của từng gói trên nhánh mặc định. Tiêu đề, mô tả, biểu tượng, tác giả và trang chủ được lấy từ phiên bản cao nhất của từng plugin. Các đường dẫn là tương đối so với thư mục nơi bạn chạy pnpm.

Bộ tạo chỉ tải xuống và đọc các tệp; nó không bao giờ cài đặt các gói hoặc chạy mã của chúng. Nó duy trì một bộ nhớ cache trong `.plugin-market-cache` bên cạnh danh sách, do đó lần chạy lặp lại chỉ tải xuống các phiên bản và commit mới. Hãy xuất bản thư mục đầu ra, `index.json` cùng với thư mục `icons/` của nó, như được mô tả ở trên.

<a id="index-format"></a>
## Tài liệu tham khảo định dạng chỉ mục

Các trường văn bản được đánh dấu `LocalizedText` là một chuỗi hoặc một đối tượng gồm các chuỗi có khóa là mã ngôn ngữ viết thường, chẳng hạn như `{ "en": "Foo", "zh": "甲" }`; một đối tượng bắt buộc phải chứa `en`. Các thuộc tính mà DSH không biết sẽ bị bỏ qua.

| Trường chỉ mục | Bắt buộc | Ý nghĩa |
|---|---|---|
| `format` | có | `1`. |
| `title`, `description` | chỉ `title` | Tên chợ và mô tả, `LocalizedText`. |
| `metadata.categories`, `metadata.labels` | không | Đối tượng ánh xạ một id tới `{ "title": LocalizedText }`. |
| `metadata.sortKeys` | không | Đối tượng ánh xạ một id tới `{ "title": LocalizedText, "order": "asc" \| "desc" }`; `order` là hướng ban đầu. |
| `plugins` | có | Danh sách plugin theo thứ tự mặc định của chợ. |

| Trường plugin | Bắt buộc | Ý nghĩa |
|---|---|---|
| `name` | có | Tên gói npm, là duy nhất trong chỉ mục. |
| `title`, `description` | không | `LocalizedText`; thẻ hiển thị `name` nếu không có tiêu đề. |
| `icon` | không | URL `data:` nội tuyến (SVG, PNG, JPEG, hoặc WebP, tối đa 32 KiB) hoặc URL, như được mô tả ở trên. |
| `author` | không | Văn bản hiển thị. |
| `homepage` | không | URL `https:` hoặc `http:` tuyệt đối của trang giới thiệu về plugin; trang plugin sẽ liên kết tới nó. |
| `repository` | không | `{ "url": string, "directory"?: string }`: trang web của kho lưu trữ nguồn, và thư mục gói bên trong nó. Trang plugin liên kết tới nó dưới dạng **Mã nguồn**. |
| `metadata.category` | không | Một id danh mục đã khai báo. |
| `metadata.labels` | không | Các id nhãn đã khai báo. |
| `metadata.sortKeys` | không | Đối tượng ánh xạ các id khóa sắp xếp đã khai báo tới các số, chẳng hạn như lượt tải xuống hoặc xếp hạng. |
| `versions` | có | Ít nhất một phiên bản, theo bất kỳ thứ tự nào. |

| Trường version | Bắt buộc | Ý nghĩa |
|---|---|---|
| `version` | có | Phiên bản SemVer chính xác, là duy nhất trong phạm vi plugin. |
| `publishTimestamp` | có | Thời gian phát hành theo giây Unix. |
| `source` | có | `{ "type": "npm", "registry"?: url }`, hoặc `{ "type": "git", "url": https-url, "commit": 40-hex-sha, "path"?: directory }`. |
| `engines.dsh` | không | Dải SemVer của các phiên bản DSH mà phiên bản này chạy được; vắng mặt nghĩa là bất kỳ phiên bản nào. |

DSH cài đặt một phiên bản npm dưới dạng `name@version`, hỏi `registry` trước khi có mặt, và một phiên bản Git dưới dạng `git+<url>.git#<commit>` kèm theo `&path:/<path>` đối với gói nằm trong thư mục con. `engines.dsh` nên khớp với `engines.dsh` của chính gói đó, điều mà DSH sẽ kiểm tra lại khi cài đặt; một gói không có trường này sẽ được kiểm tra dựa trên các peer dependencies `@deepseek-ai/dsh*` của nó. [Ghi chú định dạng](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-10-02-plugin-market-index-format.md) định nghĩa mọi quy tắc.

<a id="further-exploration"></a>
## Tìm hiểu thêm

- [Tài liệu tham khảo tab Khám phá](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-plugin-market/README.md) mô tả các điều khiển và trạng thái của tab.
- [Dịch vụ chợ plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-market/README.md) đề cập đến các giới hạn tìm nạp, bộ nhớ cache và công cụ `plugin_market`.
- [Trình xác thực chỉ mục](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/util/plugin-market-index/README.md) là thư viện mà các bộ tạo có thể sử dụng để kiểm tra chỉ mục trước khi xuất bản.

## Ghi chú cho nhà phát triển

Không có.
