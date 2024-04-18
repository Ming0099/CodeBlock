function blocks_clear() {
    $(".blocks").hide();
}

function side_menu_style_clear() {
    $('.side_menu_button').css("background-color", "#855CD6");
    $('.side_menu_button').css("color", "#fff");
}

$('.side_menu li').click(function () {
    var className = $(this).text();

    side_menu_style_clear();
    $(this).css("background-color", "#fff");
    $(this).css("color", "#855CD6");

    blocks_clear();
    switch (className) {
        case '선언':
            $("#variable_blocks").show();
            break;
        case '제어문':
            $("#control_blocks").show();
            break;
        case '입출력문':
            $("#input_output_blocks").show();
            break;
        case '내변수':
            $("#my_variable_blocks").show();
            break;
    }
});