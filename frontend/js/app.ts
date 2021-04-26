let timeslots:string[] = [];

$(function () {
    loadData();

    $("#insertAppointment").submit(function (event) {
        if (timeslots.length > 0) {
            let formData = {
                title: $("#title").val(),
                location: $("#location").val(),
                info: $("#info").val(),
                duration: $("#duration").val(),
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


    $("#voteSlots").submit(function (event) {
        for(let i=0;i<3;i++) {
            let checkbox =document.getElementById("voted"+i);
            // @ts-ignore
            if(checkbox.checked){
                let votedTimeslots = {
                    // @ts-ignore
                   //appointId: document.getElementById("slot").getAttribute("appointId"+i),
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

    $("#timeslotForm").submit(function (event) {
        let timeslot: string = $("#timeslot").val() + "";
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

function showForm() {
    var x = document.getElementById("dashboard");
    var y = document.getElementById("newAppoint");
    // @ts-ignore
    x.style.display = "none";
    // @ts-ignore
    y.style.display = "flex";
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
        // @ts-ignore
        document.getElementById("Timeslots").appendChild(timeslots);
        // @ts-ignore
        document.getElementById("Timeslots").appendChild(voteButton);
    }

    let backButton = document.getElementById("backButton");
    // @ts-ignore
    backButton.onclick = function () {
        // @ts-ignore
        document.getElementById("appointments").innerHTML = "";
        var x = document.getElementById("dashboard");
        var y = document.getElementById("details");
        // @ts-ignore
        x.style.display = "flex";
        // @ts-ignore
        y.style.display = "none";
        loadData();


    }
}


