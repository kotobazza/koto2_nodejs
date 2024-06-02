$(document).ready(function() {
    $("#create_form").submit(function(event){
        event.preventDefault();
        const formData = new FormData(event.target);

        for(key of formData.keys()){
            if(formData.get(key) == ""){
                let status = "error";
                let message = "Не все поля заполнены";
                let received = "Поле '"+ (key == "publication_title" ? "Название публикации ": "Текст публикации") + "' не заполнено"
                showPopup(status, message, received);
                return;
            }
        }
        
        $.ajax({
            url: '/create',
            type: 'POST', 
            data: formData, 
            processData: false, 
            contentType: false, 
            success: function(response) { 
                console.log("received")
                let data = response

                let status = data['status'];
                let message = data['message'];
                console.log(data);
                console.log(data['got_image'])
               
                let received =
                    "<div>" +
                        "<p> Создана публикация: " +  data['publication_title']+ "</p>" +
                        "<i>" + (data['got_image'] ? "Имеет изображение" : "Без изображения") + "</i>"+
                    "</div>"
                
                showPopup(status, message, received);
                
                
            },
            error: function(xhr, status, error) { 
                if (xhr.status === 400) {
                    showPopup(xhr.status, "Ошибка 400", "");
                } else if (xhr.status === 500){
                    showPopup(xhr.status, "Внутренняя ошибка сервера", String(error));
                    console.log(String(error));
                } else {
                    showPopup(xhr.status, "Ошибка", String(error));
                    console.log(String(error));
                }
            }
        });
    })
})