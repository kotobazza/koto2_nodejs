var updating_now = -1
$(document).ready(function () {
    $(".drop").click(function (event) {
        console.log("clicked");
        console.log($(this));

        var button = $(this);
        const publication_id = event.target.dataset['id'];
        console.log(publication_id);

        let formData = new FormData();
        formData.append("pending_to_delete", publication_id);

        let obj = {
            "pending_to_delete": publication_id
        }
        fetch('/publications/delete', {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("gotAnswer:", data)
                let received = "";

                if (data['status'] == 'success') {
                    button.closest('.publication').remove();
                    console.log("YAYAYY");
                    received =
                        "<div>" +
                        "<p> Название удаленной публикации: " + data["publication_title"] + "</p>" +
                        "</div>";

                }
                if(updating_now){
                    replace_default()
                   
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




    });

    $(".edit").click(function (event) {

        const publication_id = event.target.dataset['id'];
        updating_now=publication_id

        var destinationImg = document.getElementById('destination_image');

        destinationImg.src = ""
        destinationImg.alt = ""
        var editable1 = $(".edit_form").find(".publication_title")
        editable1.text("");
        var editable2 = $(".edit_form").find(".publication_text");
        editable2.text("");



        console.log("clicked");
        var button = $(this);
        var parent = button.closest(".publication")
        $(".editing").removeClass("editing")
        parent.find(".publication_container").addClass("editing")
        parent.addClass("editing")

        var publication_image = parent.find(".publication_image img")
        var publication_title = parent.find(".publication_title").text()
        var publication_text = parent.find(".publication_text").text()



        $(".edit_form").removeClass("hidden");
        var editable1 = $(".edit_form").find(".publication_title")
        editable1.text(publication_title);
        var editable2 = $(".edit_form").find(".publication_text");
        editable2.text(publication_text);

        var edtiable3 = $(".edit_form").find(".publication_image img")
        edtiable3.attr("src", publication_image.attr("src")).attr("alt", publication_image.attr("alt"))

        $(".send_editing").data("id", publication_id)
        console.log(publication_id)
        window.scrollTo(0, 0)

    })

    $(".editable").click(function (event) {

        if ($(this).hasClass("publication_image")) {
            $(this).replaceWith("<div class = publication_image><p>Измените изображение</p><input type=file name='publication_image'></div>")
        }
        else if ($(this).hasClass("publication_text")) {
            var text = $(this).html();
            $(this).replaceWith("<div class = publication_text><p>Измените текст</p><textarea name='publication_text' placeholder ='" + text + "'></textarea></div>")

        }
        else {
            var text = $(this).html();
            $(this).replaceWith("<div class=publication_title><p>Измените название</p><input type=text name='publication_title' placeholder='" + text + "'></div>")
        }
    })

    document.querySelector("#edit_form").addEventListener("submit", function (event) {
        event.preventDefault()
        console.log("edtiting accepted")


        const button = $(".send_editing")
        console.log(event.target);
        const formData = new FormData(event.target)
        formData.append("publication_id", button.data("id"))


        $.ajax({
            url: '/publications/edit',
            type: 'POST', // Тип запроса
            data: formData, // Данные для отправки
            processData: false, // Не обрабатывать данные, так как это FormData
            contentType: false, // Не устанавливать заголовок contentType, так как это FormData
            success: function (response) { // Функция, которая будет вызвана в случае успеха
                console.log("received")
                let data = response

                replace_default();
                let received = "";
                if (data['status'] == 'success') {

                    let old_title = data['old_publication_title'];
                    let old_text = data['old_publication_text'];
                    let old_image = data['old_publication_image'];

                    let new_title = data['title'];
                    let new_text = data['text'];
                    let new_image = data['image'];

                    let pub_id = data['publication_id'];
                    console.log(new_image);

                    replace_data(pub_id, new_title, new_text, new_image)

                    received = "<div>" +
                        "<p> Публикация '" + old_title + "' обновлена</p>" +
                        "<b> Старые данные: </b><br/>" +
                        "<i> Старый текст: " + old_text + "</i>" +
                        (old_image == "" ? "<i> Изображения нет</i>" : "<i> Название старого изображения: " + old_image + "</i>")

                }
                let status = data['status'];
                let message = data['message'];

                showPopup(status, message, received);


            },
            error: function (xhr, status, error) { // Функция, которая будет вызвана в случае ошибки
                if (xhr.status === 400) {
                    showPopup(xhr.status, "Ошибка 400", "");
                } else {
                    showPopup(xhr.status, "Ошибка", String(error));
                    console.log(String(error));
                }
            }
        });

    })


    $(".stop_editing").click(function (event) {
        console.log("stop_editing");
        $(".editing").removeClass("editing")
        replace_default();
    })



});

function replace_data(id, title, text, image_path) {
    console.log($("[data-id=" + id + "]").first());
    updating_now=-1

    let replacing_publication = $("[data-id=" + id + "]").first().closest(".publication");
    $(".editing").removeClass("editing")
    replacing_publication.find(".publication_title").html(title);
    replacing_publication.find(".publication_text").html(text);

    if (image_path != "") {
        if (replacing_publication.has("img").length) {
            replacing_publication.find("img").attr("src", "../uploads/" + image_path).attr("alt", image_path).attr("width", "400");
        }
        else {
            replacing_publication.find(".publication_image").append("<img src = ../uploads/" + image_path + " alt=" + image_path + ">");
        }
    }
    else {
        if (replacing_publication.has("img").length) {
            replacing_publication.find(".publication_image").html(" ");
        }
    }



}


function replace_default() {
    updating_now=-1
    

    $(".edit_form").addClass("hidden");
    $(".edit_form .publication_image").html("<p>Измените изображение кликом по области</p><img id = destination_image width=400 />");
    $(".edit_form .publication_image").addClass("editable");
    $(".edit_form .publication_text").replaceWith("<p class = 'publication_text editable'>jyst_test</p>");
    $(".edit_form .publication_title").replaceWith("<p class = 'publication_title editable'>jyst_test</p>");

    $(".editable").click(function (event) {

        if ($(this).hasClass("publication_image")) {
            $(this).replaceWith("<div class = publication_image><p>Измените изображение</p><input type=file name='publication_image'></div>")
        }
        else if ($(this).hasClass("publication_text")) {
            var text = $(this).html();
            $(this).replaceWith("<div class = publication_text><p>Измените текст</p><textarea name='publication_text' placeholder ='" + text + "'></textarea></div>")

        }
        else {
            var text = $(this).html();
            $(this).replaceWith("<div class=publication_title><p>Измените название</p><input type=text name='publication_title' placeholder='" + text + "'></div>")
        }
    })
    console.log($(".publications").children())
    if($(".publications").children().length==1){
        $(".publications").html(
            `
                    <div class=publication>
                        <div class="publication_container">
                            <div class=publication_title>Еще нет публикаций</div>
                        </div>
                    </div>
            `
        )
    }
}


