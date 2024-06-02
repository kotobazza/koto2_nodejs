$(document).ready(function(){
    $(".subscribe").submit(submit_subscription)
    $(".unsubscribe").submit(submit_unsubscription)
    $("#stop_search").click(clear_search_results)
    $("#search_input").on("input", start_search2)
})


function start_search2(){
    clear_searching()
    let val = $("#search_input").val()
    if (val != ""){
        $(".user_link").each(function(){
            if($(this).html().indexOf(val) === -1){
                $("#stop_search").removeClass("hidden")
                $(this).closest(".user").addClass("hidden")
            }
        })
    }
}

function clear_search_results(){
    clear_searching()
    $("#search_input").val("")

}

function clear_searching(){
    $(".user").removeClass("hidden")
    $("#stop_search").addClass("hidden")

}




function submit_subscription(event){
    event.preventDefault();
    const form = $(this)
    const user_id = form.find("button").attr("data-id");
    const formData = new FormData();
    formData.append("subscribe_to", user_id)

    const obj = {
        "subscribe_to": user_id
    }

    fetch('/subscriptions/subscribe', {
        method:"POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Received from server:", data);
        
        let status = data['status'];
        let message = data['message'];
    
        let received = ""
        if(status == "success"){
            received = "<div>" +
                            "<p> Вы подписались на @" +  data['login']+ "</p>"
                        "</div>"
            update_subscribtion(user_id)
        }
        
        showPopup(status, message, received);
    })
    .catch(error => {
        if (error instanceof Response && error.status === 400) {
            showPopup(error.status, "Ошибка 400", "");
        } else {
            showPopup(error.status, "Ошибка", String(error));
            console.log(String(error));
        }

    });    

}

function submit_unsubscription(event){
    event.preventDefault();
    const form = $(this)
    const user_id = form.find("button").attr("data-id");

    const formData = new FormData();
    formData.append("unsubscribe_from", user_id)

    const obj = {
        "unsubscribe_from": user_id
    }



    fetch('/subscriptions/unsubscribe', {
        method:"POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Received from server:", data);
        
        let status = data['status'];
        let message = data['message'];
    
        let received = ""
        if(status == "success"){
            received = "<div>" +
                            "<p> Вы отписались от @" +  data['login']+ "</p>"
                        "</div>"
            update_unsubscribtion(user_id)
        }
        
        showPopup(status, message, received);
    })
    .catch(error => {
        if (error instanceof Response && error.status === 400) {
            showPopup(error.status, "Ошибка 400", "");
        } else {
            showPopup(error.status, "Ошибка", String(error));
            console.log(String(error));
        }

    });    
}



function update_subscribtion(id){
    const subber = $("[data-id="+id+"]").closest(".subber");
    subber.html("<div class = 'status'>Подписан</div>" + 
                    "<form class='unsubscribe'>" + 
                        "<button class = 'tab_bg_button' type='submit' data-id = " + id + ">Отписаться</button>" +
                    "</form>")
    subber.find("form").submit(submit_unsubscription)

}

function update_unsubscribtion(id){
    const subber = $("[data-id="+id+"]").closest(".subber");
    subber.html("<div class = 'status'>Не подписан</div>" + 
                    "<form class='subscribe'>" + 
                        "<button class = 'tab_bg_button' type='submit' data-id = " + id + ">Подписаться</button>" +
                    "</form>")
    subber.find("form").submit(submit_subscription)
}


