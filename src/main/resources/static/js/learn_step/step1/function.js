function getDragAfterElement(y) {
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };

    draggableElements.forEach(child => {
        const offsetTop = child.offsetTop;
        const boxHeight = child.offsetHeight;
        const offset = y - offsetTop - boxHeight / 2;
        
        if (offset < 0 && offset > closest.offset) {
            closest = { offset: offset, element: child };
        }
    });
    return closest.element;
}

function getSpanAboveCurrent(container, currentSpan) {
    const draggableElements = [
        ...container.querySelectorAll("span.conding_contents:not(.select)") // container 내의 모든 span 요소 가져오기
    ];

    // 현재 span 요소의 위치 정보 가져오기
    const currentSpanRect = currentSpan.getBoundingClientRect();

    // 현재 span 요소의 위에 있는 span 요소를 찾기
    const spanAboveCurrent = draggableElements.reduce((closest, span) => {
        if (span !== currentSpan) { // 현재 span 요소는 제외합니다.
            const spanRect = span.getBoundingClientRect();
            const offset = currentSpanRect.top - spanRect.bottom; // 현재 span 요소와의 수직 거리 계산
            if (offset > 0 && offset < closest.offset) { // 현재 span 요소의 위에 있는 span 요소인지 확인하고 가장 가까운 것을 업데이트합니다.
                return { offset: offset, element: span };
            }
        }
        return closest;
    }, { offset: Number.POSITIVE_INFINITY });

    return spanAboveCurrent.element;
}

$(document).ready(function () { //출력하기
    $("#results_code").click(function () {
        const contents = document.querySelectorAll("span.conding_contents"); //만약 변수 
        var all_content = init;
        var total_arr = []; //배열 만들기 위해서
        contents.forEach(content => {//데이터(코드) 모으기
            all_content = all_content + " " + content.getAttribute('data-value');
            if (content.textContent.includes("/") === false) {
                var child_arr = []
                var childNodes = content.childNodes;
                Array.from(childNodes).forEach(function (childNode) {
                    if(childNode.value != undefined){
                        child_arr.push(childNode.value);
                    }
                });
                total_arr.push(child_arr);
            }
        });
        console.log(all_content);
        console.log(total_arr);
        $.ajax({
            type: 'POST',
            url: '/send_data',
            contentType: 'application/json',
            data: JSON.stringify({ code_content: all_content, child_code: total_arr }),
            success: function (response) {
                // 다섯 번째 목표
                if(currentQuestionNumber == 4){
                    questionCheck();
                }
                $("#result").text(response);
            },
            error: function (error) {
                // 다섯 번째 목표
                if(currentQuestionNumber == 4){
                    questionCheck();
                }
                console.log(error);
            }
        })
    });

    $("#save_text").click(function () { //저장
        // 두 번째 목표
        if(currentQuestionNumber == 1){
            questionCheck();
        }
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

function create_print(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode(" 출력");
    element.appendChild(explain);
}

function random_color() {
    var r = parseInt(Math.random() * 255);
    var g = parseInt(Math.random() * 255);
    var b = parseInt(Math.random() * 255);
    return [r, g, b];
}