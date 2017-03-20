$(function(){
    var url = '/api/quote';
    function getLists() {
        jQuery.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                if(data.status == 'success') {
                    var html = '<table><thead><tr><th>ID</th><th>Author</th><th>Text</th><th>Operations</th></tr></thead><tbody>',
                        lists = data.data,
                        length = lists.length;

                    for(var i = 0; i < length; i++) {
                        html += '<tr>';
                        html += '   <td>'+lists[i].id+'</td>';
                        html += '   <td>'+lists[i].author+'</td>';
                        html += '   <td>'+lists[i].text+'</td>';
                        html += '   <td class="ops"><a class="editBtn" data-id="'+lists[i].id+'">编辑</a> | <a class="deleteBtn" data-id="'+lists[i].id+'">删除</a></td>';
                        html += '</tr>';
                    }
                    html += '</tbody></table>';
                    $('#lists').html(html);
                }
            },
            error: function (jqXHR, status) {
            }
        });
    };
    getLists();
    $('#newBtn').on('click', function(){
        jQuery.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({author: 'Jobs', text: 'Iphone Ipod Ipad', background: 'iphone.jpg'}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                if(data.status == 'success') {
                    getLists();
                }
            },
            error: function (jqXHR, status) {
              // error handler
            }
        });
    });

    $('#lists').on('click', '.editBtn', function(){
        var id = $(this).attr('data-id');
        $.ajax({
            type: "PUT",
            url: url + '/' + id,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({author: 'Joo', text: 'test only'}),
            dataType: "json",
            success: function (data, status, jqXHR) {
                if(data.status == 'success') {
                    getLists();
                }
            },
            error: function (jqXHR, status) {

            }
        });
    });

    $('#lists').on('click', '.deleteBtn', function(){
        var id = $(this).attr('data-id');
        $.ajax({
            type: "DELETE",
            url: url + '/' + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                getLists(); // 204成功没有返回数据， 直接调用列表刷新页面
            },
            error: function (jqXHR, status) {
                alert('该资源不存在');
            }
        });
    });
});
