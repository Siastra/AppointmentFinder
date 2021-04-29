let timeslots: string[] = [];
let amountTimeslots: number;
let sections: string[] = ['dashboard', 'newAppoint', 'details'];

$(function () {
    loadData();

    $("#insertAppointment").on("submit", function (event) {
        if (timeslots.length > 0) {
            let formData = {
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
                data: {method: "queryInsertAppointment", param: formData},
                dataType: "json",
                success: function (response) {
                    loadData();
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
            clearForm();
        } else {
            alert("No timeslots added!");
        }

        event.preventDefault();
    });


    $("#voteSlots").on("submit", function (event) {
        let checkbox;
        for (let i = 0; i < amountTimeslots; i++) {
            checkbox = document.getElementById("voted" + i);
            // @ts-ignore
            if (checkbox.checked) {
                let votedTimeslots = {
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
                    data: {method: "queryVoteChoice", param: votedTimeslots},
                    dataType: "json",
                    success: function (response) {
                        fillCommentSection(Number(votedTimeslots["appointId"]));
                        fillVotesSection(Number(votedTimeslots["appointId"]));
                    },

                    error: function (request, status, error) {
                        console.log(request.responseText);
                    }
                });
                event.preventDefault();
            }
        }
        clearDetail();


    });

    $("#timeslotForm").on("submit", function (event) {
        let timeslot: string = $("#timeslot").val() + "";
        if (!timeslots.includes(timeslot)) {
            timeslots.push(timeslot);
            timeslot.substr(0, timeslot.indexOf("T"));
            $("#timeslotTable").append("<tr><td>" + timeslot.substr(0, timeslot.indexOf("T")) + "</td>" +
                "<td>" + timeslot.substr(timeslot.indexOf("T") + 1) + "</td></tr>");
        }
        event.preventDefault();
    });

});

function switchSec(_section: string) {
    for (const i in sections) {
        if (sections[i] == _section) {
            $('#' + _section).show();
        } else {
            $('#' + sections[i]).hide();
        }
    }
}

function clearDetail() {
    $("#name").val("");
    $("#comment").val("");
    let checkbox;
    for (let i = 0; i < amountTimeslots; i++) {
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
        data: {method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            if (response[0] == "No Entries") {
                $('#appointments').html("No Entries");
            } else {
                dashboard(response);
            }

        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}

function dashboard(response: Array<string>) {
    let id: number;
    for (let i = 0; i < response.length; i++) {
        let newAppoint = document.createElement("div");
        newAppoint.className = "appointment";
        let deleteButton = document.createElement("button");
        deleteButton.id = "delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteAppointment(response[i][0])
        };
        let detailButton = document.createElement("button");
        detailButton.className = "details";
        detailButton.id = "detail";
        detailButton.setAttribute("number", "" + (i));
        let appointId: number = parseInt(<string>detailButton.getAttribute("number"));
        appointId++;
        detailButton.textContent = "Details";
        detailButton.className = "btn btn-success";
        detailButton.onclick = function () {
            // @ts-ignore
            document.getElementById("Timeslots").innerHTML = "";
            let x = document.getElementById("dashboard");
            let y = document.getElementById("details");
            // @ts-ignore
            x.style.display = "none";
            // @ts-ignore
            y.style.display = "flex";
            let title = {
                title: (response[i])[0]
            };
            $.ajax({
                'async': false,

                type: "GET",
                url: "../backend/serviceHandler.php",
                cache: false,
                data: {method: "getId", param: title},
                dataType: "json",
                success: function (response) {
                    id = response["id"];
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
            // @ts-ignore
            let resp: string = (response[this.getAttribute("number")]);
            detailAppoint(resp[5], id, resp[4]);

        }
        let details = response[i];
        let exp_date: Date = new Date(details[4]);
        newAppoint.innerHTML += "<div class='row' style='background-color: lightblue;'><h1 class='col-auto'>" + details[0] + "</h1></div>" +
            "<div class='row'><label class='col-4'>Info:</label><span class='col-8'>" + details[1] + "</span></div>" +
            "<div class='row'><label class='col-4'>Location:</label><span class='col-8'>" + details[2] + "</span></div>" +
            "<div class='row'><label class='col-4'>Duration:</label><span class='col-8'>" + details[3] + " min</span></div>" +
            "<div class='row'><label class='col-4'>Vote open until:</label><span class='col-8'>" +
            ((exp_date > new Date()) ? details[4] : "Closed") + "</span></div>";
        let timeslots = "<div class='row'><label class='col-4'>Timeslots:</label><span class='col-8'>";
        for (let j = 0; j < details[5].length; j++) {
            timeslots += "<label class='times'>" + details[5][j] + "</label>";
        }
        timeslots += "</span>";
        newAppoint.innerHTML += timeslots;
        newAppoint.innerHTML += "<div class='row'><div class='col-4' id='btnDiv" +
            i + "'></div><div class='col-8 col-offset'></div>";
        // @ts-ignore
        document.getElementById("appointments").appendChild(newAppoint);
        // @ts-ignore
        document.getElementById("btnDiv" + i).appendChild(detailButton);
        // @ts-ignore
        document.getElementById("btnDiv" + i).appendChild(deleteButton);


    }
}

function deleteAppointment(appointTitle: string) {
    let title = {
        title: appointTitle
    };
    $.ajax({

        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "deleteAppoint", param: title},
        dataType: "json",
        success: function (response) {

        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    })
    loadData();
}

function fillCommentSection(id: number) {
    let allComments: string[];
    let appointmentId = {
        appointmentId: id
    };
    $.ajax({
        'async': false,

        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "getComment", param: appointmentId},
        dataType: "json",
        success: function (comments) {
            if (comments[0] === "EMPTY-NO Comments") {
                allComments = comments[0];
            } else {
                allComments = comments;
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    let commentSection = document.getElementById("commentSection");
    // @ts-ignore
    commentSection.innerHTML = "";
    // @ts-ignore
    if (allComments[0] == "E") {

    } else {


        // @ts-ignore
        for (let i = 0; i < allComments.length; i++) {
            let comment = document.createElement("p");
            // @ts-ignore
            var textToAdd = document.createTextNode(allComments[i][1] + ":" + allComments[i][0]);
            comment.appendChild(textToAdd);
            // @ts-ignore
            commentSection.appendChild(comment);
        }
    }
}

function fillVotesSection(id: number) {
    let allVotes: Array<any>;
    let appointmentId = {
        appointmentId: id
    };
    $.ajax({
        'async': false,
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "getVotesById", param: appointmentId},
        dataType: "json",
        success: function (votes) {


            allVotes = votes;


        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    let voteSection = document.getElementById("voteSection");
    // @ts-ignore
    voteSection.innerHTML = "";
    // @ts-ignore
    if (allVotes[0] == "No-Votes") {

    } else {

        // @ts-ignore
        for (let i = 0; i < allVotes.length; i++) {
            let vote = document.createElement("p");
            // @ts-ignore
            var voteToAdd = document.createTextNode("For the start Time:" + allVotes[i]["startTime"] + " are " + allVotes[i]["votes"] + " votes!");
            vote.appendChild(voteToAdd);
            // @ts-ignore
            voteSection.appendChild(vote);
        }
    }
}

function detailAppoint(appoint: string, id: number, datetime: string) {
    let cancelDate: Date = new Date(datetime);
    if (new Date() < cancelDate) {
        $('#user').show();
        let appointId = {
            // @ts-ignore
            appointId: id,
        }
        $.ajax({
            'async': false,
            type: "GET",
            url: "../backend/serviceHandler.php",
            cache: false,
            data: {method: "getTimeslots", param: appointId},
            dataType: "json",
            success: function (amount) {
                amountTimeslots = amount["Anz"];
            },

            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
        for (let i = 0; i < appoint.length; i++) {
            let timeslots = document.createElement("div");
            timeslots.setAttribute(("start" + [i]), "" + appoint[i]);
            timeslots.setAttribute(("appointid"), "" + id);
            timeslots.id = "slot" + i;
            timeslots.className = "timeslots";
            timeslots.innerHTML = ("" + appoint[i] + "<br>");
            let voteButton = document.createElement("input");
            voteButton.type = "checkbox";
            voteButton.id = "voted" + i;
            // @ts-ignore
            document.getElementById("Timeslots").appendChild(timeslots);
            // @ts-ignore
            document.getElementById("Timeslots").appendChild(voteButton);
        }
    } else {
        $('#user').hide();
    }

    fillCommentSection(id);
    fillVotesSection(id);


}


