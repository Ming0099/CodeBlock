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

function create_for(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("번 반복 (for문)");
    element.appendChild(explain);
}

function create_while(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("번 반복 (do-while문)");
    element.appendChild(explain);
}

function create_print(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode(" 출력");
    element.appendChild(explain);
}

function create_variable(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("를 ");
    element.appendChild(explain);

    create_text(element, 1, 1);

    explain = document.createTextNode("(으)로 선언");
    element.appendChild(explain);
}

function create_switch(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("가");
    element.appendChild(explain);
}

function add_case_block(color) {
    const span_case = document.createElement('span');
    span_case.draggable = false;
    span_case.innerHTML = "일때";
    span_case.id = "case_immediate" + cnt.toString();
    span_case.classList.add("conding_contents");
    span_case.classList.add("closed");
    span_case.classList.add("select");
    span_case.classList.add("this_is_close");
    span_case.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
    return span_case
}

function create_operator(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("는 ");
    element.appendChild(explain);

    create_text(element, 1, 1);

    var selecting = document.createElement('select'); //select의 기능
    selecting.classList.add("size");
    var optionValues = ['더하기', '빼기', '나누기', '곱하기'];
    for (var i = 0; i < 4; i++) {
        var option = document.createElement('option'); //option의 기능
        option.id = 'option' + "immediate" + cnt.toString() + "-" + (i + 1).toString();
        option.value = optionValues[i];
        option.text = optionValues[i];
        selecting.appendChild(option);
    }
    element.appendChild(selecting);

    create_text(element, 1, 2);
}

function create_if(element) { //목록에서 code_screen으로 끌어당길때 만약 조건문 생성
    create_text(element, 1, 0);

    explain = document.createTextNode("가 ");
    element.appendChild(explain);

    create_text(element, 1, 1);

    explain = document.createTextNode("보다 ");
    element.appendChild(explain);

    var selecting = document.createElement('select'); //select의 기능
    selecting.classList.add("size");
    var optionValues = ['작을때', '클때', '같을때', '작거나 같을때', '크거나 같을때', '다를때'];
    for (var i = 0; i < 6; i++) {
        var option = document.createElement('option'); //option의 기능
        option.id = 'option' + "immediate" + cnt.toString() + "-" + (i + 1).toString();
        option.value = optionValues[i];
        option.text = optionValues[i];
        selecting.appendChild(option);
    }
    element.appendChild(selecting);
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
    if(target_id === "만약"){
        span_close.setAttribute('data-value', '/IF');
    }
    else if(target_id === "번 반복 (for문)"){
        span_close.setAttribute('data-value', "/FOR");
    }
    else if(target_id === "번 반복 (while문)"){
        span_close.setAttribute('data-value', "/WHILE");
    }
    span_close.id = "close_immediate" + cnt.toString();
    span_close.classList.add("conding_contents");
    span_close.classList.add("closed");
    span_close.classList.add("select");
    span_close.classList.add("this_is_close");
    span_close.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
    return span_close
}

function check_close_complete(span) { //close 유효성검사
    need_close_list = []
    for (var i = 0; i < spans.length; i++) {
        var cur_check = spans[i];
        var classString = Array.from(cur_check.classList).join(' ');
        if(classString.includes('closed') && !cur_check.textContent.includes('/')){
            need_close_list.push(cur_check.id);
        }
        if (cur_check.textContent.includes('/')) {
            if(need_close_list.length < 0 ){ // "/"는 있는데 여는 블럭이 없을때
                if(pre_block === undefined){
                    contain.prepend(span);
                }
                else{
                    insertAfter(span, pre_block);
                }
                return false;
            }
            if(cur_check.id.includes(need_close_list[need_close_list.length - 1])){
                need_close_list.pop();
            }
            else{ // "/"와 여는 블럭이 다를때
                if(pre_block === undefined){
                    contain.prepend(span);
                }
                else{
                    insertAfter(span, pre_block);
                }
                return false;
            }
        }
    }
    if (need_close_list.length == 0) {
        return true;
    }
    else {
        if(pre_block === undefined){
            contain.prepend(span);
        }
        else{
            insertAfter(span, pre_block);
        }
        return false;
    }
}

function insertAfter(newNode, referenceNode) { //뒤에 삽입
    if (newNode && referenceNode && referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
        console.error("Invalid parameters passed to insertAfter function.");
    }
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