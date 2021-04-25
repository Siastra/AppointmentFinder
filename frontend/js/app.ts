$(function() {
    loaddata();
});

function loaddata() {
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointments" },
        dataType: "json",
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                console.log(response[i]);
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}