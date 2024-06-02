$(document).ready(function() {
    $("#feedback_form").submit(function(event){
        event.preventDefault();
        const formData = new FormData(event.target);

        const formList = {
            "feedback_theme":"Тема для комментария",
            "feedback_comment":"Текст для комментария",
            "feedback_email":"Email",
        }
    

        for(key of formData.keys()){
            console.log(key)
            if(key === "feedback_reason" || key === "feedback_rate"){
                continue;
            }
            if(formData.get(key) == ""){
                
                let status = "error";
                let message = "Не все поля заполнены";
                let received = "Поле '"+ (formList[key]) + "' не заполнено"
                showPopup(status, message, received);
                return;
            }
        }
        
        $.ajax({
            url: '/feedback',
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
                        "<p> Создано обращение: " +  data['title']+ "</p>" +
                        "<i>Обращение обязательно будет рассмотрено</i>"+
                    "</div>"
                
                showPopup(status, message, received);
                
                
            },
            error: function(xhr, status, error) { 
                if (xhr.status === 400) {
                    showPopup(xhr.status, "Ошибка 400", "");
                } else {
                    showPopup(xhr.status, "Ошибка", String(error));
                    console.log(String(error));
                }
            }
        });
    })
})