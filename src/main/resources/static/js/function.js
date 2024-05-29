//사이값 구하기
function BetweenSpantoSpan(span_start, span_end){ //시작은 element, 끝은 id인 배열을 넣어야함    
    var spans_array = [];
    var standard = span_start;
    while(standard != null){
        var under_span = getSpanUnderCurrent(contain, standard);
        var break_check = 0;
        for(var i = 0; i< span_end.length; i++){
            if(under_span.id.includes(span_end[i])){
                break_check = 1;
                switch_end = under_span;
                break;
            }
        }
        if(break_check == 1){
            break;
        }
        spans_array.push(under_span);
        standard = under_span;
    }
    return spans_array;
}

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

function getSpanUnderCurrent(container, currentSpan) { //현 블록의 아래에 있는 블록 확인하기
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
            if (offset < 0 && -offset < closest.offset) { // 현재 span 요소의 위에 있는 span 요소인지 확인하고 가장 가까운 것을 업데이트합니다.
                return { offset: -offset, element: span };
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
        var empty_text_check = false;
        var total_arr = []; //배열 만들기 위해서
        var test_arr = [];
        contents.forEach(content => {//데이터(코드) 모으기
            all_content = all_content + " " + content.getAttribute('data-value');
            if (content.textContent.includes("/") === false) {
                var child_arr = []
                var childNodes = content.childNodes;
                Array.from(childNodes).forEach(function (childNode) {
                    if(childNode.value != undefined){
                        if(childNode.value.length > 0){ //뭐라도 적혀있으면....
                            child_arr.push(childNode.value);
                        }
                        else if(childNode.tagName.toLowerCase() === 'input'){
                            empty_text_check = true;
                            return;
                        }
                    }
                });
                total_arr.push(child_arr);
            }
        });
        if(empty_text_check == true){
            alert("빈칸이 없도록 모두 채워주세요.");
            return;
        }
        console.log(all_content);
        console.log(total_arr);
        $.ajax({
            type: 'POST',
            url: '/send_data',
            contentType: 'application/json',
            data: JSON.stringify({ code_content: all_content, child_code: total_arr }),
            success: function (response) {
                $("#c-code").text(response);
                Prism.highlightAll();
            },
            error: function (error) {
                console.log(error);
            }
        })

    });

    $("#save_text").click(function () { //저장
        if(input_text_element.getAttribute('variable_name') == 'yes'){
            var check = 0;
            if ($('#input_texting').val().trim() !== "") {
                if($("#" + input_text_element.id).val() === ""){
                    variables.forEach(k => {
                        if(k == $('#input_texting').val()) {
                            alert("이미 존재하는 변수 입니다.");
                            check = 1;
                            return;
                        }
                    })
        
                    if(check == 0){
                        variables.push($('#input_texting').val());
                        var content_temp = $('#input_texting').val();
                        $("#" + input_text_element.id).val(content_temp);
                        close_modal();
                    }
                }
                else {
                    var temp_text = $("#" + input_text_element.id).val();
                    var i = 0;
                    if (temp_text !== $('#input_texting').val()) {
                        variables.forEach(k => {
                            if(k == $("#" + input_text_element.id).val()) {
                                variables[i] = variables[i].replace(k,  $('#input_texting').val());
                            }
                            i++;
                        })
                        var content_temp = $('#input_texting').val();
                        $("#" + input_text_element.id).val(content_temp);
                        close_modal();
                    }
                    else {
                        close_modal();
                    }
                }
            }
            else{
                alert("입력해주세요.");
            }
        } else if(input_text_element.getAttribute('change_value') === 'yes') {
            var check = 0;
            var temp_span;
            var temp_span_name;
            var temp_input_texting = $('#input_texting').val()
            temp_span = input_text_element.parentNode;
            try{
                temp_span.childNodes.forEach(k => {
                    if (k.getAttribute('change_name') === 'yes') {
                        temp_span_name = k.value.replace(/[<>]/g, '');
                        //console.log(temp_span_value);
                        throw new Error();
                    }
                })
            } catch (error) {

            }

            get_variables = [];
            var lists = document.getElementById('my_variable_blocks');
            lists.childNodes.forEach(k => {
                if (k.classList.value === 'button') {
                    get_variables.push(k);
                }
            })
            get_variables.forEach(f => {
                if (f.getAttribute('canNumber') === 'can') {
                    if (f.textContent === temp_span_name) {
                        if (isNaN(temp_input_texting)) {
                            alert('서로 다른 자료형은 사용할 수 없습니다.');
                            check = 1;
                            return;
                        } else {
                            console.log('가능');
                        }
                    }
                } else if (f.getAttribute('canNumber') !== 'can'){
                    if (f.title.length == 1){
                        if (f.textContent === temp_span_name) {
                            if (isNaN(temp_input_texting) && temp_input_texting.length == 1) {
                                console.log('가능')
                            }
                            else {
                                alert('서로 다른 자료형은 사용할 수 없습니다.');
                                check = 1;
                                return;
                            }
                        }
                    } else {
                        if (f.textContent === temp_span_name) {
                            if (isNaN(temp_input_texting)) {
                                console.log('가능');
                            } else {
                                alert('서로 다른 자료형은 사용할 수 없습니다.');
                                check = 1;
                                return;
                            }
                        }
                    }
                } 
            })

            if(check == 0){
                var content_temp = $('#input_texting').val();
                $("#" + input_text_element.id).val(content_temp);
                close_modal();
            }
        }
        else{
            var content_temp = $('#input_texting').val();
            $("#" + input_text_element.id).val(content_temp);
            close_modal();
        }
        //console.log($("#" + input_text_element.id).val());
        if(input_text_element.parentNode.getAttribute('data-value') == 'VARIABLE'){
            create_my_variable();
        }
        else if(input_text_element.parentNode.getAttribute('data-value') == 'VARIABLE OPERATOR'){
            create_my_variable();
        }
        check_only_number = 0;
        //console.log(check_only_number);
    });

    $("#cancel_text").click(function () { //취소
        check_only_number = 0;
        close_modal();
    });

    $("#variable_save_text").click(function () { //저장
        //var content_temp = document.getElementById('variable_input_texting').lastChild;
        var content_temp = $('#variable_input_texting').val();
        $("#" + input_text_element.id).val(content_temp); // 클릭한 버튼 텍스트값 저장했던거 넣기
        //input_text_element.setAttribute('data-value', content_temp.getAttribute('data-value'))
        //input_text_element.setAttribute('back-ground', content_temp.style.backgroundColor)
        //console.log($("#" + input_text_element.id).val());
        // if(input_text_element.parentNode.getAttribute('data-value') == 'VARIABLE'){
        //     create_my_variable();
        // }
        close_modal2();
    });

    $("#variable_cancel_text").click(function () { //취소
        close_modal2();
    });
});

function close_modal2() { //모달창 닫기
    document.getElementById('variable_input_texting').innerHTML = "";
    document.getElementById("variable_modal_screen2").style.display = "none";
    document.getElementById("modal_screen2").style.display = "none";
    document.getElementById("modal_screen1").style.zIndex = "2";
}

function close_modal() { //모달창 닫기
    $("#input_texting").val("");
    document.getElementById("modal_screen2").style.display = "none";
    document.getElementById("variable_modal_screen2").style.display = "none";
    document.getElementById("modal_screen1").style.zIndex = "2";
}

function create_text(element, create_cnt, start_num) { //목록에서 code_screen으로 끌어당길때 text 생성
    for (var i = 0; i < create_cnt; i++) {
        var texting = document.createElement('input'); //texting의 기능
        texting.type = 'text';
        if(element.getAttribute('data-value').includes("CASE")){
            texting.id = "texting_immediate" + element.id.match(/\d+/g)[0].toString() + "-" + element.id.match(/\d+/g)[1].toString() + "-" + (start_num + i + 1).toString();
        }
        else{
            texting.id = "texting_immediate" + element.id.match(/\d+/g)[0].toString() + "-" + (start_num + i + 1).toString();
        }
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
                if (texting.parentNode.getAttribute('data-value') === 'FOR' ||
                texting.parentNode.getAttribute('data-value') === 'WHILE' ||
                texting.parentNode.getAttribute('data-value') === 'VARIABLE OPERATOR' && start_num > 0 ||
                texting.parentNode.getAttribute('data-value') === 'CHANGE OPERATOR' && start_num > 0) {
                    check_only_number = 1;
                }
                //console.log(texting.getAttribute('change_value'));
            };
        }(texting);
        element.appendChild(texting);

        if((element.getAttribute('data-value') == 'VARIABLE' && start_num == 0) || (element.getAttribute('data-value') == 'VARIABLE OPERATOR' && start_num == 0)) {
            texting.setAttribute('variable_name', "yes");
        }
        if((element.getAttribute('data-value') == 'VARIABLE' && start_num > 0) || (element.getAttribute('data-value') == 'VARIABLE OPERATOR' && start_num > 0)) {
            texting.setAttribute('variable_value', "yes");
        }
        if((element.getAttribute('data-value') == 'CHANGE' && start_num > 0) || (element.getAttribute('data-value') == 'CHANGE OPERATOR' && start_num > 0)) {
            texting.setAttribute('change_value', "yes");
        }
    }
}

function create_text_2(element, create_cnt, start_num) { //목록에서 code_screen으로 끌어당길때 text 생성
    for (var i = 0; i < create_cnt; i++) {
        var texting = document.createElement('input'); //texting의 기능
        texting.type = 'text';
        if(element.getAttribute('data-value').includes("CASE")){
            texting.id = "texting_immediate" + element.id.match(/\d+/g)[0].toString() + "-" + element.id.match(/\d+/g)[1].toString() + "-" + (start_num + i + 1).toString();
        }
        else{
            texting.id = "texting_immediate" + element.id.match(/\d+/g)[0].toString() + "-" + (start_num + i + 1).toString();
        }
        texting.readOnly = true;
        texting.classList.add("code_text");
        texting.onclick = function (element) {
            return function (e) {
                input_text_element = element;
                var content_temp = $('#' + input_text_element.id).val();
                $("#variable_input_texting").val(content_temp);
                texting_backup = $("#variable_input_texting").val();
                $("#input_screen2").css({
                    "left" : e.x+150+"px",
                    "top" : e.y+40+"px",
                    "height" : "auto"
                });
                input_variable_modal_screen2(element.parentNode);
                document.getElementById("variable_modal_screen2").style.display = "block";
                document.getElementById("modal_screen1").style.zIndex = "-1";
            };
        }(texting);
        element.appendChild(texting);

        if((element.getAttribute('data-value') == 'CHANGE' && start_num == 0) || (element.getAttribute('data-value') == 'CHANGE OPERATOR' && start_num == 0)) {
            texting.setAttribute('change_name', "yes");
        }
    }
}

function create_for(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("번 반복 (for문)");
    element.appendChild(explain);
}

function create_while(element) {
    create_text(element, 1, 0);

    explain = document.createTextNode("번 반복 (while문)");
    element.appendChild(explain);
}

function create_print(element) {
    create_text_2(element, 1, 0);

    explain = document.createTextNode(" 출력");
    element.appendChild(explain);
    
    element.addEventListener('click', function() {
        check_use_many_variable = 2;
        variable_input_texting.disabled = false;
    })
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
    create_text_2(element, 1, 0);

    explain = document.createTextNode("가");
    element.appendChild(explain);

    element.addEventListener('click', function() {
        check_use_many_variable = 1;
        variable_input_texting.disabled = true;
    })
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

    explain = document.createTextNode("로 선언");
    element.appendChild(explain);
}

function create_change_operator(element) {
    create_text_2(element, 1, 0);

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

    explain = document.createTextNode("로 변경");
    element.appendChild(explain);

    element.addEventListener('click', function() {
        check_use_many_variable = 1;
        variable_input_texting.disabled = true;
    })
}

function create_change(element) {
    create_text_2(element, 1, 0);

    explain = document.createTextNode("를 ");
    element.appendChild(explain);

    create_text(element, 1, 1);

    explain = document.createTextNode("(으)로 변경");
    element.appendChild(explain);

    element.addEventListener('click', function() {
        check_use_many_variable = 1;
        variable_input_texting.disabled = true;
    })
}

function create_if(element) { //목록에서 code_screen으로 끌어당길때 만약 조건문 생성
    create_text_2(element, 1, 0);

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

    element.addEventListener('click', function() {
        check_use_many_variable = 1;
        variable_input_texting.disabled = true;
    })
}

function random_color() {
    var r = parseInt(Math.random() * 255);
    var g = parseInt(Math.random() * 255);
    var b = parseInt(Math.random() * 255);
    return [r, g, b];
}

function add_case_block(element, color) {
    const span_case = document.createElement('span');
    span_case.style.userSelect = 'none';
    span_case.setAttribute('data-value', 'CASE')
    span_case.draggable = false;
    span_case.id = "case_immediate" + element.getAttribute("SwitchCount").toString() +"_"+ element.getAttribute("CaseCount").toString(); // 만들어지는 Case의 ID를 element의 SwitchCount 와 CaseCount 의 값을 이용해 지정
    create_text(span_case, 1, 0);
    span_case.classList.add("conding_contents");
    span_case.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
    switch_count = element.getAttribute("CaseCount"); // 변수 switch_count에 CaseCount 값을 넣어줌
    switch_count++;
    element.setAttribute("CaseCount", switch_count); // element의 CaseCount의 값을 갱신
    return span_case
}

function add_close_block(color) {
    const span_close = document.createElement('span'); //span추가 및 설정 //닫는 것
    span_close.draggable = true;
    span_close.innerHTML = "/" + target_id;
    span_close.style.userSelect = 'none';
    if(target_id === "만약"){
        span_close.setAttribute('data-value', '/IF');
    }
    else if(target_id === "번 반복 (for문)"){
        span_close.setAttribute('data-value', "/FOR");
    }
    else if(target_id === "번 반복 (while문)"){
        span_close.setAttribute('data-value', "/WHILE");
    }
    else if(target_id === "스위치"){
        span_close.setAttribute('data-value', "/SWITCH");
    }
    span_close.id = "close_immediate" + cnt.toString();
    span_close.classList.add("conding_contents");
    span_close.classList.add("closed");
    span_close.classList.add("select");
    span_close.classList.add("this_is_close");
    span_close.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
    return span_close
}
function check_switch_complete(span) {
    var now_above = getSpanAboveCurrent(contain, span);
    if(now_above != undefined) {
        if(now_above.getAttribute('data-value') == 'SWITCH') {
            if(pre_block == undefined) {
                contain.prepend(span);
            }
            else {
                insertAfter(span, pre_block);
            }
        }
    }
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

function switch_remove(){
    if (remove_code.getAttribute('data-value').includes('SWITCH')) { //스위치를 지웠을때 전체를 지움
        if (remove_code.id.includes("close_")) { //스위치 닫는 블록을 지우면 위치 바뀜 (remove_code와 remove_close_code)
            remove_close_code = remove_code;
            remove_code = document.getElementById(remove_code.id.replace('close_', ''));
        }
        var num = remove_code.id.match(/\d+/)[0];
        var spans_array = BetweenSpantoSpan(remove_code, ['close_immediate' + num]) //시작은 element, 끝은 id인 배열을 넣어야함
        for (var i = 0; i < spans_array.length; i++) {
            contain.removeChild(spans_array[i]);
        }
    }
    if (remove_code.getAttribute('data-value').includes('CASE')) { //case만 지웠을때 
        var num = remove_code.id.match(/\d+/)[0];

        var spans_array = BetweenSpantoSpan(remove_code, ['close_immediate' + num, 'case_immediate' + num])
        //시작은 element, 끝은 id인 배열을 넣어야함
        for (var i = 0; i < spans_array.length; i++) {
            contain.removeChild(spans_array[i]);
        }
    }
}