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
    $("#voteSlots").submit(function (event) {
        var checkbox;
        for (var i = 0; i < 3; i++) {
            checkbox = document.getElementById("voted" + i);
            // @ts-ignore
            if (checkbox.checked) {
                var votedTimeslots = {
                    // @ts-ignore
                    appointId: document.getElementById("slot" + i).getAttribute("appointid"),
                    // @ts-ignore
                    time: document.getElementById("slot" + i).getAttribute("start" + i),
                    username: $("#name").val(),
                    comment: $("#comment").val()
                };
                $.ajax({
                    type: "GET",
                    url: "../backend/serviceHandler.php",
                    cache: false,
                    data: { method: "queryVoteChoice", param: votedTimeslots },
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (request, status, error) {
                        console.log(request.responseText);
                    }
                });
                event.preventDefault();
            }
        }
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
var sections = ['dashboard', 'newAppoint', 'details'];
function switchSec(_section) {
    for (var i in sections) {
        if (sections[i] == _section) {
            $('#' + _section).show();
        }
        else {
            $('#' + sections[i]).hide();
        }
    }
}
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
            dashboard(response);
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}
function dashboard(response) {
    var id;
    var _loop_1 = function (i) {
        var newAppoint = document.createElement("div");
        var detailButton = document.createElement("button");
        detailButton.className = "details";
        detailButton.id = "detail";
        detailButton.setAttribute("number", "" + (i));
        var appointId = parseInt(detailButton.getAttribute("number"));
        appointId++;
        detailButton.textContent = "Details";
        detailButton.onclick = function () {
            // @ts-ignore
            document.getElementById("Timeslots").innerHTML = "";
            var x = document.getElementById("dashboard");
            var y = document.getElementById("details");
            // @ts-ignore
            x.style.display = "none";
            // @ts-ignore
            y.style.display = "flex";
            var title = {
                title: (response[i])[0]
            };
            $.ajax({
                'async': false,
                type: "GET",
                url: "../backend/serviceHandler.php",
                cache: false,
                data: { method: "getId", param: title },
                dataType: "json",
                success: function (responsee) {
                    id = responsee["id"];
                    console.log("userId");
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
            console.log(id);
            // @ts-ignore
            var resp = (response[this.getAttribute("number")]);
            detailAppoint(resp[4], id);
        };
        var details = response[i];
        for (var y = 0; y < response[i].length; y++) {
            newAppoint.innerHTML = newAppoint.innerHTML + "<br>" + details[y];
        }
        // @ts-ignore
        document.getElementById("appointments").appendChild(newAppoint);
        // @ts-ignore
        document.getElementById("appointments").appendChild(detailButton);
    };
    for (var i = 0; i < response.length; i++) {
        _loop_1(i);
    }
}
function fillCommentSection(id) {
    var allComments;
    var appointmentId = {
        appointmentId: id
    };
    $.ajax({
        'async': false,
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: "getComment", param: appointmentId },
        dataType: "json",
        success: function (comments) {
            console.log(comments);
            allComments = comments;
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    var commentSection = document.getElementById("commentSection");
}
function detailAppoint(appoint, id) {
    console.log(id);
    for (var i = 0; i < appoint.length; i++) {
        var timeslots_1 = document.createElement("div");
        timeslots_1.setAttribute(("start" + [i]), "" + appoint[i]);
        timeslots_1.setAttribute(("appointid"), "" + id);
        timeslots_1.id = "slot" + i;
        timeslots_1.className = "timeslots";
        timeslots_1.innerHTML = ("" + appoint[i] + "<br>");
        var voteButton = document.createElement("input");
        voteButton.type = "checkbox";
        voteButton.id = "voted" + i;
        fillCommentSection(id);
        // @ts-ignore
        document.getElementById("Timeslots").appendChild(timeslots_1);
        // @ts-ignore
        document.getElementById("Timeslots").appendChild(voteButton);
    }
}
