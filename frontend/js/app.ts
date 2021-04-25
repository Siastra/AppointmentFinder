$(function() {
    loaddata();
});

function loaddata() {

    $.ajax({
        type: "GET",
        url: "../../backend/serviceHandler.php",
        cache: false,
        data: {method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            console.log(response);
        }

    });
}