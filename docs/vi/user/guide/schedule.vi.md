# Lên lịch lời nhắc

[Nguồn tiếng Anh](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/schedule.md)

## Tóm tắt

Tạo lời nhắc trong một cuộc hội thoại, sau đó kiểm tra các tác vụ đang hoạt động và không hoạt động, đồng thời chỉnh sửa tên, chỉ dẫn và thời gian chạy của tác vụ đang hoạt động từ trang Tác vụ tự động hóa (Automation tasks). Lời nhắc hàng ngày tuân theo giờ địa phương và múi giờ đã lưu; lời nhắc theo chu kỳ cố định tuân theo khoảng thời gian đã trôi qua. Các tác vụ chạy một lần đã chuyển phát vẫn được lưu giữ cho đến khi bạn chủ động xóa chúng.

## Mục lục

- [Tạo lời nhắc](#create-reminders)
- [Kiểm tra và xóa tác vụ](#manage-tasks)
- [Chỉnh sửa một tác vụ đang hoạt động](#edit-timing)
- [Tham khảo thời gian và chuyển phát](#timing-and-delivery)
- [Tìm hiểu thêm](#further-exploration)

<a id="create-reminders"></a>
## Tạo lời nhắc

Profile Web được cung cấp sẵn đã bao gồm dịch vụ Host Schedule và trang Automation tasks. Hãy định cấu hình nhà cung cấp model trước khi yêu cầu tạo lời nhắc.

Các preset `standard`, `cordis`, và `ptc` khai báo bốn công cụ nhắc nhở cùng context đồng hồ cung cấp cho model thời gian hiện tại và múi giờ của trình duyệt, do đó các preset này cung cấp `schedule_create`, `schedule_list`, `schedule_update`, và `schedule_delete`; preset `minimal` không khai báo cả hai. Một subagent được ủy quyền sẽ không thấy bất kỳ công cụ nào trong bốn công cụ trên, vì các hàng ủy quyền của preset từ chối chúng; một lệnh gọi bằng cách nào đó chạm tới chúng vẫn sẽ bị từ chối.

Yêu cầu model tạo, liệt kê, chỉnh sửa hoặc xóa lời nhắc. Model sẽ sử dụng `schedule_create`, `schedule_list`, `schedule_update`, và `schedule_delete` (thao tác update thay đổi một lời nhắc tại chỗ và giữ nguyên id cùng các bản ghi chuyển phát đã lưu); thao tác New trên trang Automation tasks thay vào đó sẽ mở một New Session để tạo mới, với yêu cầu đã được điền sẵn trong khung soạn thảo. Các tùy chọn được hỗ trợ gồm: độ trễ một lần tính bằng số nguyên giây dương, ngày giờ tuyệt đối, khoảng thời gian cố định tối thiểu một phút, giờ địa phương hàng ngày kèm múi giờ IANA, giờ địa phương hàng tuần kèm múi giờ IANA và các ngày trong tuần theo chuẩn ISO từ Thứ Hai (1) đến Chủ Nhật (7), hoặc biểu thức cron năm trường kèm múi giờ IANA tường minh, được lưu trữ ở dạng chuẩn hóa.

Ví dụ: hãy yêu cầu: “Remind me every day at 23:00 in Asia/Shanghai to check the weather.” Mở Automation tasks và chọn lời nhắc vừa tạo. Kiểm tra để đảm bảo tần suất hiển thị quy tắc hàng ngày và đúng múi giờ được yêu cầu, chứ không phải Once. Lời nhắc một lần không tự động trở thành lặp lại sau khi đã chuyển phát.

<a id="manage-tasks"></a>
## Kiểm tra và xóa tác vụ

Mở Automation tasks từ thanh bên để xem các lời nhắc trên khắp các Session mà không cần kích hoạt cuộc hội thoại của chúng. Tìm kiếm theo tên tác vụ đã lưu, nội dung chỉ dẫn, hoặc id Session nội bộ của tác vụ, và lọc theo một hàng trạng thái duy nhất: All, Enabled, hoặc Inactive. Một hàng Session nhàn rỗi, chưa lưu trữ (unarchived) mà phiên đó có ít nhất một tác vụ đang hoạt động sẽ hiển thị dấu đồng hồ; một hàng đã lưu trữ sẽ để trống ô đó và chỉ hiển thị trạng thái trực tiếp trên hover card. Rê chuột lâu trên một hàng Session có các tác vụ đang hoạt động sẽ liệt kê tối đa hai tác vụ đó cùng tần suất và lần chạy tiếp theo dưới dạng giờ theo múi giờ thiết bị kèm khoảng thời gian tương đối. Phần đầu của Session đang mở sẽ hiển thị biểu tượng đồng hồ nhắc nhở khi tồn tại các lời nhắc đang hoạt động: nó sẽ mở trực tiếp chi tiết tác vụ duy nhất đó, hoặc danh sách các lời nhắc của Session trong trường hợp có nhiều hơn một.

Chọn một tác vụ để mở Rules, sau đó chọn Records để tải 20 bản ghi đã lưu mới nhất. Mỗi bản ghi đã lưu hiển thị như một hàng thu gọn: biểu tượng đồng hồ, thời điểm xảy ra theo múi giờ đã lưu của tác vụ (múi giờ của trình duyệt đối với tác vụ chạy một lần hoặc tác vụ theo chu kỳ), và chỉ dẫn đã lưu nếu có. Các bản ghi không có chỉ dẫn đã lưu sẽ không bao giờ hiển thị chỉ dẫn hiện tại để thay thế. Nút Tải các bản ghi cũ hơn (Load older records) sẽ thêm trang tiếp theo. Các bản ghi tuân theo thứ tự đã lưu từ mới nhất đến cũ nhất ngay cả khi đồng hồ bị lùi lại; chúng không mô tả kết quả thực thi của model. Mục Session gốc nằm trong dải tab chi tiết, vì vậy nó vẫn hiển thị khi cuộn khung nhìn Rules. Các phím mũi tên Trái/Phải không kèm phím bổ trợ cùng Home/End dùng để chuyển đổi tab đang lấy tiêu điểm; các tổ hợp Alt, Ctrl, Meta và Shift sẽ không bị chặn. Việc làm mới tác vụ vẫn giữ nguyên tab đã chọn.

Chế độ xem bản ghi trống có nghĩa là truy vấn thành công nhưng không trả về bản ghi đã lưu nào. Trạng thái đang tải, yêu cầu thất bại, tác vụ không tồn tại và con trỏ bản ghi cũ không hợp lệ đều có các thông báo riêng biệt. Sử dụng Thử lại bản ghi chuyển phát (Retry delivery records) sau khi yêu cầu thất bại hoặc phản hồi không tìm thấy tác vụ; sử dụng Làm mới bản ghi chuyển phát (Refresh delivery records) sau khi gặp con trỏ không hợp lệ để tải lại trang mới nhất. Các bản ghi đã tải trước đó có thể vẫn hiển thị kèm cảnh báo khi yêu cầu thất bại. Một lượt chuyển phát mới nhất sẽ làm mới trang mới nhất. Các phản hồi trễ của một tác vụ hoặc khung nhìn mà bạn đã rời khỏi sẽ không thay thế khung nhìn hiện tại.

Đối với các tác vụ không có lịch sử đã lưu, chỉ có biên nhận mới nhất hiện có mới được hiển thị cho đến khi các lượt chuyển phát mới thêm bản ghi; các lượt chuyển phát sau này không phục hồi lại lịch sử bị thiếu hoặc xóa thông báo về nó. Các bản ghi và snapshot chỉ dẫn trước đó chưa được lưu sẽ không thể phục hồi, và chỉ dẫn hiện tại không được dùng để thay thế cho chỉ dẫn đã lưu bị thiếu. Thông báo về lịch sử trước đó chỉ xuất hiện khi Host đánh dấu các bản ghi trước đó là không khả dụng; các tác vụ mới chưa có lần chuyển phát nào sẽ hiển thị trạng thái trống mà không có thông báo đó.

Các tác vụ đang hoạt động (active) sẽ tham gia vào việc lên lịch. Các tác vụ không hoạt động (inactive) sẽ không lên lịch cho lần chuyển phát tiếp theo. Tác vụ một lần sẽ trở thành không hoạt động sau khi lời nhắc của nó được ghi bền vững vào hộp thư đến (inbox) của cuộc hội thoại; chọn All tasks hoặc Inactive để tìm lại. Danh mục ở phần đầu cuộc hội thoại và `schedule_list` của model chỉ hiển thị các lời nhắc đang hoạt động, do đó việc biến mất khỏi các khung nhìn đó không có nghĩa là tác vụ được lưu giữ đã bị xóa.

Mục Linked session trong dải tab chi tiết sẽ mở cuộc hội thoại gốc khi siêu dữ liệu của nó đã sẵn sàng và Session đang khả dụng cũng như chưa bị lưu trữ. Nếu không, mục này sẽ bị vô hiệu hóa kèm lý do. Chi tiết tác vụ và thao tác xóa vẫn khả dụng ngay cả khi không thể mở Session gốc. Việc duyệt qua các tác vụ không làm hủy lưu trữ (unarchive) các Session.

Chọn Delete task và xác nhận để dừng việc chuyển phát trong tương lai và xóa tác vụ khỏi danh sách, bao gồm cả đối với tác vụ không hoạt động. Thao tác xóa sẽ loại bỏ tác vụ cùng với các bản ghi chuyển phát đã lưu của nó, do đó lịch sử đã lưu của tác vụ sẽ mất đi. Việc xác nhận xóa sẽ đóng bảng điều khiển hoặc tab đã yêu cầu thao tác đó và báo cáo kết quả qua một thông báo chung trên toàn ứng dụng — đã xóa, hoặc thất bại và giữ nguyên tác vụ để thử lại; nó không xóa cuộc hội thoại gốc hoặc thu hồi tin nhắn đã nằm trong hàng đợi tại đó. Hàng sẽ vẫn hiển thị cho đến khi một truy vấn thành công xác nhận các tác vụ còn lại. Nếu truy vấn thất bại, Retry sẽ tải lại danh mục; lỗi không phải là một kết quả rỗng thành công.

<a id="edit-timing"></a>
## Chỉnh sửa một tác vụ đang hoạt động

Trong Automation tasks, chọn một tác vụ đang hoạt động và mở Rules để chỉnh sửa tên, chỉ dẫn và thời gian chạy của nó. Các tác vụ không hoạt động ở chế độ chỉ đọc, và các chỉnh sửa sẽ nằm trong bản nháp cục bộ cho đến khi bạn chọn Lưu thay đổi (Save changes). Việc chỉnh sửa vẫn giữ nguyên id tác vụ, cuộc hội thoại gốc, biên nhận chuyển phát mới nhất và tất cả các bản ghi chuyển phát đã lưu.

- Daily và Weekly: chỉnh sửa Time và Time zone; quy tắc hàng tuần cũng cho phép bật/tắt Weekday. Một hàng đồng hồ hiển thị số nguyên giây, một hàng không chạm tới sẽ giữ nguyên giá trị mili giây đã lưu khi gửi, và múi giờ IANA đã lưu sẽ được bảo toàn. Một quy tắc bị thay đổi sẽ chọn lần xảy ra đầu tiên trong tương lai theo các quy tắc DST bên dưới.
- Every: chọn Every N hours, Every N minutes, hoặc Every N seconds và nhập số lượng theo đơn vị mà hàng quy định; khoảng thời gian nhỏ nhất được chấp nhận là 1 giờ, 1 phút, hoặc 60 giây cho đơn vị tương ứng, và khoảng thời gian được gửi đi là số nguyên giây. Khoảng thời gian đã thay đổi sẽ tính từ thời điểm Host chấp nhận lưu, với mục tiêu đầu tiên là sau một khoảng thời gian mới. Múi giờ không ảnh hưởng đến khoảng thời gian đã trôi qua này.
- One-shot After/At: chỉnh sửa các hàng Date, Time và Time zone riêng biệt. Múi giờ ban đầu là múi giờ đã lưu của bản ghi, hoặc múi giờ của thiết bị này khi bản ghi không lưu múi giờ, và đồng hồ được mồi ban đầu chỉ cùng một thời điểm đã lưu; quy tắc một lần không lưu múi giờ sẽ hiển thị một gợi ý cho biết múi giờ đã chọn dùng để diễn giải ngày và giờ đã nhập. Việc thay đổi múi giờ sẽ giữ nguyên các giá trị đồng hồ đó và làm thay đổi thời điểm thực tế. Mục tiêu đã thay đổi sẽ lưu dưới dạng At với cùng id tác vụ. Múi giờ không được giữ lại làm siêu dữ liệu lặp lại.

Các hàng này chỉ thay đổi một bản nháp cục bộ. Save changes sẽ gửi tên, chỉ dẫn và quy tắc hoàn chỉnh trong một lượt cập nhật, và một thanh lưu sẽ xuất hiện chừng nào bản nháp còn khác biệt với tác vụ đã lưu; Cancel sẽ khôi phục các giá trị đã lưu. Menu Repeat cung cấp các tùy chọn Weekly, Monday to Friday, Every day, Every N hours, Every N minutes, Every N seconds, Once, và Custom (cron), và Host chấp nhận bất kỳ tùy chọn nào trong số đó, vì vậy một After chạy một lần có thể lưu thành At. Một quy tắc tương đương đã chuẩn hóa sẽ không thực hiện ghi hoặc thiết lập lại mục tiêu: cùng một khoảng thời gian Every sẽ không khởi động lại thời gian của nó, và mục tiêu một lần không thay đổi sẽ bảo toàn After hoặc At. Các hàng sẽ bị vô hiệu hóa khi quá trình lưu đang diễn ra. Việc rời khỏi card không làm hoàn tác thao tác ghi của Host đã bắt đầu.

Một lần làm mới danh mục sẽ giữ lại các trường bạn đã chỉnh sửa và lấy mọi trường khác từ bản ghi đã làm mới, vì vậy một thay đổi đồng thời đối với trường khác vẫn tồn tại qua một chỉnh sửa chưa lưu. Dữ liệu nhập không hợp lệ sẽ được báo cáo và chặn việc Save. Nếu việc chuyển phát hoặc một chỉnh sửa khác đã làm thay đổi tác vụ, xung đột sẽ ngăn việc ghi đè lên thay đổi đó; hãy thử lại để chỉnh sửa quy tắc mới nhất. Một cập nhật được chấp nhận sẽ làm mới danh mục. Cập nhật bị từ chối hoặc chưa được xác nhận khác biệt với lỗi tải danh mục: sử dụng Retry để tải lại danh mục, chứ không phải để lặp lại một cập nhật đã được ghi nhận. Nếu bản thân cập nhật không thể xác nhận, hãy kiểm tra tác vụ trước khi thử lại. Các phản hồi trễ sau khi đóng chi tiết hoặc chuyển đổi tác vụ sẽ không thay thế khung nhìn hiện tại.

<a id="timing-and-delivery"></a>
## Tham khảo thời gian và chuyển phát

Các lời nhắc vẫn được lưu trữ ngay cả khi Session của chúng không mở. Trong khi Host đang chạy, nó sẽ khôi phục Session gốc khi một lời nhắc đến hạn và xếp hàng đợi một lượt tiếp theo (follow-up) mà không làm gián đoạn công việc hiện tại. Việc khởi động lại sẽ kiểm tra các tác vụ đã lưu và gửi lời nhắc một lần đã quá hạn hoặc chỉ lần xảy ra bị lỡ mới nhất của từng tác vụ định kỳ. Đóng Host sẽ tạm dừng việc lên lịch cho đến khi nó khởi động lại. Các tác vụ định kỳ đến hạn của cùng một Session có thể chia sẻ chung một tin nhắn.

Lời nhắc theo chu kỳ cố định giữ nguyên sự căn chỉnh theo thời điểm tạo cho đến khi khoảng thời gian của chúng thay đổi; khoảng thời gian bị thay đổi sẽ căn chỉnh theo thời điểm được chấp nhận lưu. Lời nhắc hàng ngày thay vào đó tuân theo giờ địa phương và múi giờ IANA đã lưu. Giờ hoặc ngày địa phương hàng ngày không tồn tại sẽ bị bỏ qua; giờ trùng lặp sẽ sử dụng thời điểm sớm hơn một lần trong ngày đó. Yêu cầu thời gian tuyệt đối sẽ từ chối giờ địa phương không tồn tại và chọn thời điểm sớm hơn khi xảy ra trùng lặp. Trình duyệt cung cấp múi giờ của nó để diễn giải các yêu cầu bằng ngôn ngữ tự nhiên; việc chỉ định rõ múi giờ sẽ tránh được sự mơ hồ. Chi tiết tác vụ giữ múi giờ của quy tắc đồng hồ treo tường đã lưu trong văn bản tần suất và hiển thị mọi mục tiêu tiếp theo dưới dạng đồng hồ theo múi giờ thiết bị; tác vụ một lần chỉ lưu thời điểm UTC, do đó dấu thời gian của nó sử dụng múi giờ của trình duyệt.

Các bản ghi chuyển phát đã lưu xác nhận tin nhắn đã được lưu trữ bền vững trong hộp thư đến của cuộc hội thoại, chứ không phải model đã hoàn thành công việc được yêu cầu. Việc lưu hộp thư đến thất bại hoặc ghi tác vụ thất bại sẽ không thêm bản ghi đã lưu. Sự cố sập hoặc lỗi ghi tác vụ sau khi lưu hộp thư đến có thể khiến tin nhắn đã chuyển phát không được ghi lại và làm lặp lại việc chuyển phát; việc chuyển phát chính xác một lần (exactly-once) không được đảm bảo. Đây không phải là lịch sử thực thi hay một kênh thông báo bên ngoài.

Các bản ghi đã lưu sẽ được dọn dẹp (prune) khi một biên nhận được nối thêm: Host giữ lại các bản ghi có thời gian biên nhận nằm trong khoảng thời gian `deliveryHistoryDays` được cấu hình, tính ngược từ `deliveredAt` của biên nhận được thêm vào, và tối đa là `deliveryHistoryRecords` bản ghi mới nhất. Biên nhận mới nhất luôn tồn tại, và một khoảng bị dọn dẹp sẽ đánh dấu các bản ghi trước đó là không khả dụng. Host giữ lịch sử được giữ lại trong bộ nhớ và ghi lại toàn bộ hàng tác vụ cho mỗi lần xác nhận. Phân trang giới hạn số lượng bản ghi trả về, chứ không phải lịch sử được giữ lại hay dung lượng byte của chỉ dẫn.

Tính năng tạm dừng (pause) và tạo Session mới cho mỗi lần chạy không được hỗ trợ. Việc chỉnh sửa tên, chỉ dẫn và thời gian chạy khả dụng cho model thông qua `schedule_update`, vốn thay đổi lời nhắc tại chỗ và giữ nguyên id cùng các bản ghi chuyển phát đã lưu, và khả dụng trên trang Automation tasks đối với liên kết của tác vụ đã chọn; cả hai đều không phải là quy trình chuyển tiếp giữa các Session. Lời nhắc chỉ được ghi trong nhật ký Session cũ sẽ không được lên lịch tự động; hãy tạo lại những lời nhắc bạn vẫn cần. Các bản ghi tác vụ đã bị xóa trước đó sẽ không được tái tạo.

<a id="further-exploration"></a>
## Tìm hiểu thêm

- [Tài liệu tham khảo Schedule](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/schedule/schedule/README.md) ghi lại chi tiết các bộ chọn thời gian, tính bền vững và giới hạn chuyển phát.
- [Tài liệu tham khảo trang Tác vụ tự động hóa](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-schedule/README.md) mô tả trang toàn cục và danh mục ở phần đầu cuộc hội thoại.

## Ghi chú cho nhà phát triển

Không có.
