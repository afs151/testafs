$.ajaxSetup({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    async: true,
    failure: function (msg) {
        alert(msg);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('Error: ' + textStatus);
    }
});