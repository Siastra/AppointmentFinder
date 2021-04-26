$(function () {
    loadData();
    $("#insertAppointment").submit(function (event) {
        var formData = {
            title: $("#title").val(),
            location: $("#location").val(),
            info: $("#info").val(),
            duration: $("#duration").val()
        };
        $.ajax({
            type: "GET",
            url: "../backend/serviceHandler.php",
            cache: false,
            data: { method: "queryInsertAppointment", param: formData },
            dataType: "json",
            success: function (response) {
                console.log(response);
            },
            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
        event.preventDefault();
    });
});
function loadData() {
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointments" },
        dataType: "json",
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                console.log(response[i]);
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}
