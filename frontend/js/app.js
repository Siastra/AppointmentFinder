var timeslots = [];
$(function () {
    loadData();
    $("#insertAppointment").submit(function (event) {
        if (timeslots.length > 0) {
            var formData = {
                title: $("#title").val(),
                location: $("#location").val(),
                info: $("#info").val(),
                duration: $("#duration").val(),
                expiration_date: $("#expiration_date").val(),
                timeslots: timeslots
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
            clearForm();
        }
        else {
            alert("No timeslots added!");
        }
        event.preventDefault();
    });
    $("#timeslotForm").submit(function (event) {
        var timeslot = $("#timeslot").val() + "";
        timeslots.push(timeslot);
        timeslot.substr(0, timeslot.indexOf("T"));
        $("#timeslotTable").append("<tr><td>" + timeslot.substr(0, timeslot.indexOf("T")) + "</td>" +
            "<td>" + timeslot.substr(timeslot.indexOf("T") + 1) + "</td></tr>");
        event.preventDefault();
    });
});
function clearForm() {
    $("#title").val("");
    $("#location").val("");
    $("#info").val("");
    $("#duration").val("");
    $("#expiration_date").val("");
    $("#timeslot").val("");
    $("#timeslotTable").html("");
}
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
