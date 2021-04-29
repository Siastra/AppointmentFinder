var timeslots = [];
var amountTimeslots;
var sections = ['dashboard', 'newAppoint', 'details'];
$(function () {
    loadData();
    $("#insertAppointment").on("submit", function (event) {
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
                    loadData();
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
    $("#voteSlots").on("submit", function (event) {
        var checkbox;
        var _loop_1 = function (i) {
            checkbox = document.getElementById("voted" + i);
            // @ts-ignore
            if (checkbox.checked) {
                var votedTimeslots_1 = {
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
                    data: { method: "queryVoteChoice", param: votedTimeslots_1 },
                    dataType: "json",
                    success: function (response) {
                        fillCommentSection(Number(votedTimeslots_1["appointId"]));
                        fillVotesSection(Number(votedTimeslots_1["appointId"]));
                    },
                    error: function (request, status, error) {
                        console.log(request.responseText);
                    }
                });
                event.preventDefault();
            }
        };
        for (var i = 0; i < amountTimeslots; i++) {
            _loop_1(i);
        }
        clearDetail();
    });
    $("#timeslotForm").on("submit", function (event) {
        var timeslot = $("#timeslot").val() + "";
        if (!timeslots.includes(timeslot)) {
            timeslots.push(timeslot);
            timeslot.substr(0, timeslot.indexOf("T"));
            $("#timeslotTable").append("<tr><td>" + timeslot.substr(0, timeslot.indexOf("T")) + "</td>" +
                "<td>" + timeslot.substr(timeslot.indexOf("T") + 1) + "</td></tr>");
        }
        event.preventDefault();
    });
});
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
function clearDetail() {
    $("#name").val("");
    $("#comment").val("");
    var checkbox;
    for (var i = 0; i < amountTimeslots; i++) {
        checkbox = document.getElementById("voted" + i);
        // @ts-ignore
        if (checkbox.checked) {
            $('#voted' + i).prop("checked", false);
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
    $("#appointments").html("");
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: "queryAppointments" },
        dataType: "json",
        success: function (response) {
            if (response[0] == "No Entries") {
                $('#appointments').html("No Entries");
            }
            else {
                dashboard(response);
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}
function dashboard(response) {
    var id;
    var _loop_2 = function (i) {
        var newAppoint = document.createElement("div");
        newAppoint.className = "appointment";
        var deleteButton = document.createElement("button");
        deleteButton.id = "delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteAppointment(response[i][0]);
        };
        var detailButton = document.createElement("button");
        detailButton.className = "details";
        detailButton.id = "detail";
        detailButton.setAttribute("number", "" + (i));
        var appointId = parseInt(detailButton.getAttribute("number"));
        appointId++;
        detailButton.textContent = "Details";
        detailButton.className = "btn btn-success";
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
                success: function (response) {
                    id = response["id"];
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
            // @ts-ignore
            var resp = (response[this.getAttribute("number")]);
            detailAppoint(resp[5], id, resp[4]);
        };
        var details = response[i];
        var exp_date = new Date(details[4]);
        newAppoint.innerHTML += "<div class='row' style='background-color: lightblue;'><h1 class='col-auto'>" + details[0] + "</h1></div>" +
            "<div class='row'><label class='col-4'>Info:</label><span class='col-8'>" + details[1] + "</span></div>" +
            "<div class='row'><label class='col-4'>Location:</label><span class='col-8'>" + details[2] + "</span></div>" +
            "<div class='row'><label class='col-4'>Duration:</label><span class='col-8'>" + details[3] + " min</span></div>" +
            "<div class='row'><label class='col-4'>Vote open until:</label><span class='col-8'>" +
            ((exp_date > new Date()) ? details[4] : "Closed") + "</span></div>";
        var timeslots_1 = "<div class='row'><label class='col-4'>Timeslots:</label><span class='col-8'>";
        for (var j = 0; j < details[5].length; j++) {
            timeslots_1 += "<label class='times'>" + details[5][j] + "</label>";
        }
        timeslots_1 += "</span>";
        newAppoint.innerHTML += timeslots_1;
        newAppoint.innerHTML += "<div class='row'><div class='col-4' id='btnDiv" +
            i + "'></div><div class='col-8 col-offset'></div>";
        // @ts-ignore
        document.getElementById("appointments").appendChild(newAppoint);
        // @ts-ignore
        document.getElementById("btnDiv" + i).appendChild(detailButton);
        // @ts-ignore
        document.getElementById("btnDiv" + i).appendChild(deleteButton);
    };
    for (var i = 0; i < response.length; i++) {
        _loop_2(i);
    }
}
function deleteAppointment(appointTitle) {
    var title = {
        title: appointTitle
    };
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: "deleteAppoint", param: title },
        dataType: "json",
        success: function (response) {
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    loadData();
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
            if (comments[0] === "EMPTY-NO Comments") {
                allComments = comments[0];
            }
            else {
                allComments = comments;
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    var commentSection = document.getElementById("commentSection");
    // @ts-ignore
    commentSection.innerHTML = "";
    // @ts-ignore
    if (allComments[0] == "E") {
    }
    else {
        // @ts-ignore
        for (var i = 0; i < allComments.length; i++) {
            var comment = document.createElement("p");
            // @ts-ignore
            var textToAdd = document.createTextNode(allComments[i][1] + ":" + allComments[i][0]);
            comment.appendChild(textToAdd);
            // @ts-ignore
            commentSection.appendChild(comment);
        }
    }
}
function fillVotesSection(id) {
    var allVotes;
    var appointmentId = {
        appointmentId: id
    };
    $.ajax({
        'async': false,
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: "getVotesById", param: appointmentId },
        dataType: "json",
        success: function (votes) {
            allVotes = votes;
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    var voteSection = document.getElementById("voteSection");
    // @ts-ignore
    voteSection.innerHTML = "";
    // @ts-ignore
    if (allVotes[0] == "No-Votes") {
    }
    else {
        // @ts-ignore
        for (var i = 0; i < allVotes.length; i++) {
            var vote = document.createElement("p");
            // @ts-ignore
            var voteToAdd = document.createTextNode("For the start Time:" + allVotes[i]["startTime"] + " are " + allVotes[i]["votes"] + " votes!");
            vote.appendChild(voteToAdd);
            // @ts-ignore
            voteSection.appendChild(vote);
        }
    }
}
function detailAppoint(appoint, id, datetime) {
    var cancelDate = new Date(datetime);
    if (new Date() < cancelDate) {
        $('#user').show();
        var appointId = {
            // @ts-ignore
            appointId: id
        };
        $.ajax({
            'async': false,
            type: "GET",
            url: "../backend/serviceHandler.php",
            cache: false,
            data: { method: "getTimeslots", param: appointId },
            dataType: "json",
            success: function (amount) {
                amountTimeslots = amount["Anz"];
            },
            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
        for (var i = 0; i < appoint.length; i++) {
            var timeslots_2 = document.createElement("div");
            timeslots_2.setAttribute(("start" + [i]), "" + appoint[i]);
            timeslots_2.setAttribute(("appointid"), "" + id);
            timeslots_2.id = "slot" + i;
            timeslots_2.className = "timeslots";
            timeslots_2.innerHTML = ("" + appoint[i] + "<br>");
            var voteButton = document.createElement("input");
            voteButton.type = "checkbox";
            voteButton.id = "voted" + i;
            // @ts-ignore
            document.getElementById("Timeslots").appendChild(timeslots_2);
            // @ts-ignore
            document.getElementById("Timeslots").appendChild(voteButton);
        }
    }
    else {
        $('#user').hide();
    }
    fillCommentSection(id);
    fillVotesSection(id);
}
