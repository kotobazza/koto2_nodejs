var next_path = "/profile"


$(document).ready(function() {
    $('#register_form').submit(function(event) { 
        event.preventDefault(); 

        const formData = new FormData(event.target);

        const keys = ['login', "password", "confirm"];
        const map_keys = {
            "login": "Логин",
            "password": "Пароль",
            "confirm": "Подтрвеждение пароля",
        }
        

        for(key of keys){
            console.log(formData.get(key))
            if(formData.get(key) == ""){
                let status = "error";
                let message = "Не все поля заполнены";
                let received = "Поле '"+ map_keys[key] + "' не заполнено"
                showPopup(status, message, received);
                return;
            }
        }

        var obj = {}
        for(key of keys){
            obj[key] = formData.get(key);
        }


        fetch('/user/signup', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json' 
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log("registerYAY");
            console.log(data);
    
            let received = "";
            if (data.status === "success") {
                received = "Скоро вас перенаправят на основную страницу";
            }
    
            showPopup(data.status, data.message, received);
    
            if (data.status === "success") {
                console.log("set timeout");
                setTimeout(function() {
                    window.location.href=next_path
                }, 1000)
            }
        })
        .catch(error => {
            if (error instanceof Response && error.status === 400) {
                showPopup(error.status, "Ошибка 400", "");
            } else {
                showPopup(error.status || "Ошибка", "Ошибка", String(error));
                console.log(String(error));
            }
        });

    });
    $('#login_form').submit(function(event) {
        event.preventDefault(); 

        const formData = new FormData(event.target);

        const keys = ['login', "password"];
        const map_keys = {
            "login": "Логин",
            "password": "Пароль",
            "confirm": "Подтрвеждение пароля",
        }
        
        for(key of keys){
            console.log(formData.get(key))
            if(formData.get(key) == ""){
                let status = "error";
                let message = "Не все поля заполнены";
                let received = "Поле '"+ map_keys[key] + "' не заполнено"
                showPopup(status, message, received);
                return;
            }
        }

        var obj = {}
        for(key of keys){
            obj[key] = formData.get(key);
        }


        fetch('/user/signin', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json' 
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log("loginYAY");
            console.log(data);
    
            let received = ""

            if(data.status === "success"){
                received = "Скоро вас перенаправят на основную страницу"
            }

            showPopup(data.status, data.message, received)
            

            if(data['status'] == "success"){
                setTimeout(function(){
                    window.location.href=next_path
                }, 1000)
            }
        })
        .catch(error => {
            if (error instanceof Response && error.status === 400) {
                showPopup(error.status, "Ошибка 400", "");
            } else {
                showPopup(error.status || "Ошибка", "Ошибка", String(error));
                console.log(String(error));
            }
        });

    });
});