
function showPopup(status, message, data) {
    var popup = $('<div class="popup">' +
        '<div class="status"></div>' +
        '<div class="message"></div>' +
        '<div class="data"></div>' +
    '</div>');

    popup.find('.status').text(status);
    popup.find('.message').text(message);
    popup.find('.data').html(data);

    if(status=="error"){
        popup.find(".status").addClass("status_error")
    }
    if(status=="success"){
        popup.find(".status").addClass("status_success")
    }
    if(status=="pending"){
        popup.find(".status").addClass("status_pending")
    }

    $('body').append(popup);
    popup.slideDown(500).delay(5000).slideUp(500, function() {
        $(this).remove();
    });
}
