function getDragAfterElement(container, y) { //근처위치 찾기
    const draggableElements = [
        ...container.querySelectorAll("span.conding_contents:not(.select)") //css가 conding_contents인 요소 전부 찾기
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect(); //현재 요소의 정보와 위치를 가져옴
            const offset = y - box.top - box.height / 2; //box와 y의 위치 차이를 구함
            if (offset < 0 && offset > closest.offset) { //이전의 요소 보다 더 가까우면 해당 요소에 새로운 close값으로 업뎃
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY },
    ).element;
}

$(document).ready(function () { //출력하기
    $("#results_code").click(function () {
        const contents = document.querySelectorAll("span.conding_contents"); //만약 변수 
        var all_content = init;
        var total_arr = []; //배열 만들기 위해서
        contents.forEach(content => {//데이터(코드) 모으기
            if (content.textContent.includes("작다크다같다작거나") === true) {
                console.log(content.textContent);
                all_content = all_content + " " + content.textContent.replace("작다크다같다작거나 같다크거나 같다다르다", "");
            }
            else {
                all_content = all_content + " " + content.textContent;
                //string
            }
            if (content.textContent.includes("/") === false) {
                var child_arr = []
                var childNodes = content.childNodes;
                Array.from(childNodes).forEach(function (childNode) {
                    child_arr.push(childNode.value);
                });
                total_arr.push(child_arr);
            }
        });
        $.ajax({
            type: 'POST',
            url: '/send_data',
            contentType: 'application/json',
            data: JSON.stringify({ code_content: all_content, child_code: total_arr }),
            success: function (response) {
                $("#result").text(response);
            },
            error: function (error) {
                console.log(error);
            }
        })
    });

    $("#save_text").click(function () { //저장
        var content_temp = $('#input_texting').val();
        $("#" + input_text_element.id).val(content_temp);
        close_modal();
    });

    $("#cancel_text").click(function () { //취소
        close_modal();
    });
});

function close_modal() { //모달창 닫기
    $("#input_texting").val("");
    document.getElementById("modal_screen2").style.display = "none";
    document.getElementById("modal_screen1").style.zIndex = "2";
}

function create_text(element, create_cnt, start_num) { //목록에서 code_screen으로 끌어당길때 text 생성
    for (var i = 0; i < create_cnt; i++) {
        var texting = document.createElement('input'); //texting의 기능
        texting.type = 'text';
        texting.id = 'texting' + "immediate" + cnt.toString() + "-" + (start_num + i + 1).toString();
        texting.readOnly = true;
        texting.classList.add("code_text");
        texting.onclick = function (element) {
            return function (e) {
                input_text_element = element;
                var content_temp = $('#' + input_text_element.id).val();
                $("#input_texting").val(content_temp);
                $("#input_screen").css({
                    "left" : e.x+150+"px",
                    "top" : e.y+40+"px"
                });
                document.getElementById("modal_screen2").style.display = "block";
                document.getElementById("modal_screen1").style.zIndex = "-1";
            };
        }(texting);
        element.appendChild(texting);
    }
}

function create_if(element) { //목록에서 code_screen으로 끌어당길때 만약 조건문 생성
    create_text(element, 1, 0);

    var selecting = document.createElement('select'); //select의 기능
    selecting.classList.add("size");
    var optionValues = ['작다', '크다', '같다', '작거나 같다', '크거나 같다', '다르다'];
    for (var i = 0; i < 6; i++) {
        var option = document.createElement('option'); //option의 기능
        option.id = 'option' + "immediate" + cnt.toString() + "-" + (i + 1).toString();
        option.value = optionValues[i];
        option.text = optionValues[i];
        selecting.appendChild(option);
    }
    element.appendChild(selecting);

    create_text(element, 1, 1);
}

function random_color() {
    var r = parseInt(Math.random() * 255);
    var g = parseInt(Math.random() * 255);
    var b = parseInt(Math.random() * 255);
    return [r, g, b];
}

function add_close_block(color) {
    const span_close = document.createElement('span'); //span추가 및 설정 //닫는 것
    span_close.draggable = true;
    span_close.innerHTML = "/" + target_id;
    span_close.id = "close_immediate" + cnt.toString();
    span_close.classList.add("conding_contents");
    span_close.classList.add("closed");
    span_close.classList.add("select");
    span_close.classList.add("this_is_close");
    span_close.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
    return span_close
}

// function create_span(value, title, close_is, text_cnt) {
//     const span = document.createElement('span');
//     span.draggable = true;
//     span.innerHTML = target_id; //html에 target_id라는 내용을 화면에 표시
//     span.id = "immediate" + cnt.toString(); //마우스 다운 하고 움직이기 때문에 임시id를 줌
//     span.classList.add("conding_contents"); //code_screen에 들어가기 때문에 css로 conding_contents를 줌
//     span.classList.add("select"); //down하고 움직이기 때문에 특정 블럭을 뽑기 위해 select라는 클릭
//     var color = random_color(); //블럭 background 색깔입히기
//     span.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
//     //리스트 블록 추가시
//     create_text(span, text_cnt, 0);
//     if (close_is == 0) {
//         contain.appendChild(span);
//     }
//     else { //close 블럭 추가
//         span.classList.add("closed");
//         const span_close = add_close_block(color)
//         contain.appendChild(span);
//         contain.appendChild(span_close);
//         span_close_setting = span_close;
//     }
//     return span
// }