$(document).ready(function() {
    $(".like").click(like)
    $(".unlike").click(unlike)
})

function update_likes(id, likes_counter){
    $("[data-id="+id+"]").first().next(".likes_counter").first().text(likes_counter);

}

function set_button_like(id){
    $("[data-id="+id+"]").first().removeClass("unlike").off("click").addClass("like").click(like).text("Лайк")

}

function set_button_unlike(id){
    $("[data-id="+id+"]").first().removeClass("like").off("click").addClass("unlike").click(unlike).text("Отменить")
}

function like(event){
    let button = $(this);
    const publication_id = event.target.dataset['id'];

    let obj = {
        "like_it":publication_id
    }

    fetch('/publications/like', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("gotAnswer:", data)
        let received = "";
        if(data['status'] == 'success'){
            received = 
                "<div>"+
                    "<p> Вы лайкнули публикацию: " + data["publication_title"]+"</p>"+
                "</div>";
            update_likes(publication_id, data["likes_counter"])
            set_button_unlike(publication_id)
        }
        let status = data['status'];
        let message = data['message'];
        
        showPopup(status, message, received);
    })
    .catch(error => {
        if (error instanceof Response && error.status === 400) {
            showPopup(error.status, "Ошибка 400", "");
        } else {
            showPopup(error.status, "Ошибка", String(error));
            console.log(String(error));
        }

    })
}







function unlike(event){
    const publication_id = event.target.dataset['id'];

    let obj = {
        "unlike_it":publication_id
    }

    fetch('/publications/unlike', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("gotAnswer:", data)
        let received = "";
        if(data['status'] == 'success'){
            received = 
                "<div>"+
                    "<p> Вы сняли лайк с публикации: " + data["publication_title"]+"</p>"+
                "</div>";
            update_likes(publication_id, data["likes_counter"])
            set_button_like(publication_id)
        }
        let status = data['status'];
        let message = data['message'];
        
        showPopup(status, message, received);
    })
    .catch(error => {
        if (error instanceof Response && error.status === 400) {
            showPopup(error.status, "Ошибка 400", "");
        } else {
            showPopup(error.status, "Ошибка", String(error));
            console.log(String(error));
        }

    })
}


