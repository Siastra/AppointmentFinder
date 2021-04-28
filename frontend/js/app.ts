let timeslots:string[] = [];
let sections:string[] = ['dashboard', 'newAppoint', 'details'];

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
                    console.log(response);
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
            clearForm();
        }else {
            alert("No timeslots added!");
        }

        event.preventDefault();
    });


    $("#voteSlots").on("submit", function (event) {
        let checkbox;
        for(let i=0;i<3;i++) {
             checkbox =document.getElementById("voted"+i);
            // @ts-ignore
            if(checkbox.checked){
                let votedTimeslots = {
                    // @ts-ignore
                   appointId: document.getElementById("slot"+i).getAttribute("appointid"),
                    // @ts-ignore
                    time: document.getElementById("slot"+i).getAttribute("start"+i),
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

    $("#timeslotForm").on("submit", function (event) {
        let timeslot: string = $("#timeslot").val() + "";
        timeslots.push(timeslot);
        timeslot.substr(0, timeslot.indexOf("T"));
        $("#timeslotTable").append("<tr><td>" + timeslot.substr(0, timeslot.indexOf("T")) + "</td>" +
            "<td>" + timeslot.substr(timeslot.indexOf("T") + 1) + "</td></tr>");
        event.preventDefault();
    });

});

function switchSec(_section:string) {
    for (const i in sections) {
        if (sections[i] == _section) {
            $('#' + _section).show();
        }else {
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
        data: {method: "queryAppointments"},
        dataType: "json",
        success: function (response) {
            dashboard(response);

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
        let detailButton = document.createElement("button");
        detailButton.className = "details";
        detailButton.id = "detail";
        detailButton.setAttribute("number", "" + (i));
        let appointId: number = parseInt(<string>detailButton.getAttribute("number"));
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
            let title = {
               title:(response[i])[0]
            };
            $.ajax({
                'async': false,

                type: "GET",
                url: "../backend/serviceHandler.php",
                cache: false,
                data: {method: "getId",param: title},
                dataType: "json",
                success: function (responsee) {
                            id=responsee["id"];
                            console.log("userId");
                },
                error: function (request, status, error) {
                    console.log(request.responseText);
                }
            });
            console.log(id);
            // @ts-ignore
            let resp:string=(response[this.getAttribute("number")]);
            detailAppoint(resp[4], id);

        }
        let details = response[i];
        for (let y = 0; y < response[i].length; y++) {
            newAppoint.innerHTML = newAppoint.innerHTML + "<br>" + details[y];
        }
        // @ts-ignore
        document.getElementById("appointments").appendChild(newAppoint);
        // @ts-ignore
        document.getElementById("appointments").appendChild(detailButton);

    }
}

function fillCommentSection(id: number){
    let allComments:Array<string>;
    let  appointmentId= {
        appointmentId: id
    };
    $.ajax({
        'async': false,

        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "getComment",param: appointmentId},
        dataType: "json",
        success: function (comments) {
            console.log(comments);
            allComments=comments;
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
    let commentSection=document.getElementById("commentSection");
}
function detailAppoint(appoint: string, id: number) {
    console.log(id);
    for (let i = 0; i < appoint.length; i++) {
        let timeslots = document.createElement("div");
        timeslots.setAttribute(("start"+[i]), "" + appoint[i]);
        timeslots.setAttribute(("appointid"), ""+id );
        timeslots.id="slot"+i;
        timeslots.className = "timeslots";
        timeslots.innerHTML = ("" + appoint[i] + "<br>");
        let voteButton = document.createElement("input");
        voteButton.type = "checkbox";
        voteButton.id = "voted" + i;
        fillCommentSection(id);
        // @ts-ignore
        document.getElementById("Timeslots").appendChild(timeslots);
        // @ts-ignore
        document.getElementById("Timeslots").appendChild(voteButton);
    }
}


