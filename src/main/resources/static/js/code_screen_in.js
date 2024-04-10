
const observer = new MutationObserver(() => { //code div에 있는 설정 코드들 기동하기
    document.querySelectorAll("span.conding_contents").forEach(span => {
        span.addEventListener("dragstart", function (e) {
            if (span.id.includes("close_")) {
                close_click = span.id;
            }
            span.classList.add("select");
            span_setting = span;
            if (first == 0 && check == 0 && in_check == 1) { //유효성검사하기전 클릭한 블럭의 위에 블럭을 찾음
                // 클릭할 때 수행할 작업
                pre_block = getSpanAboveCurrent(contain, span);
                first = 1;
            }
        });
        span.addEventListener("dragend", function (e) {
            if (first == 1 && check == 0 && in_check == 1) {
                // 클릭할 때 수행할 작업
                close_check = check_close_complete(span);
                switch_check = check_switch_complete(span);
                first = 0;
            }
            if (include_close == 1) {
                include_close = 0;
            }
            in_check = 0;
            dont_up = 0;
            span.classList.remove("select");
        });
        span.addEventListener("mousedown", function (e) { //화면에서 삭제기능
            if (((e.button == 2) || (e.which == 3)) && mousedown_check == 0) { //code_screen에 블록을 삭제할때 쓰임
                remove_code = span;
                var classListArray = Array.from(span.classList);
                classListArray.some(className => {
                    if (className === "closed") {
                        if (span.id.includes("close_")) {
                            var name = span.id.replace("close_", "");
                            remove_close_code = document.getElementById(name);
                        }
                        else {
                            var name = "close_" + span.id;
                            remove_close_code = document.getElementById(name);
                        }
                        spans = document.querySelectorAll("span.conding_contents");
                        return true;
                    }
                    return false;
                });
                mousedown_check = 1;
            }
            else {
                focus_block = span;
                draggableElements = [ //getDragAfterElement 함수에서 필요한데 처리속도 개선으로 인한 안타까움으로 쩔 수 없음
                    ...contain.querySelectorAll("span.conding_contents:not(.select)") //css가 conding_contents인 요소 전부 찾기
                ];
                in_check = 1;
            }
        });
        span.addEventListener("mouseup", function (e) {
            if (in_check == 1) {
                in_check = 0;
            }
        });
    });
});

// Mutation Observer 시작
observer.observe(targetNode, observerConfig);

contain.addEventListener("dragenter", (e) => { //진입
    e.preventDefault();
    // 현재 드래그된 요소
    const draggingElement = e.relatedTarget || e.fromElement;

    // 현재 드래그된 요소가 자식 요소인지 확인
    if (draggingElement && contain.contains(draggingElement)) {
        return; // 자식 요소일 경우 무시
    }

    if (check == 0 && in_check == 0) {
        //const span = create_span(value, title, close_is, text_cnt)
        const span = document.createElement('span');
        span.draggable = true;
        span.innerHTML = target_id; //html에 target_id라는 내용을 화면에 표시
        span.id = "immediate" + cnt.toString(); //마우스 다운 하고 움직이기 때문에 임시id를 줌
        span.classList.add("conding_contents"); //code_screen에 들어가기 때문에 css로 conding_contents를 줌
        span.classList.add("select"); //down하고 움직이기 때문에 특정 블럭을 뽑기 위해 select라는 클릭
        var color = random_color(); //블럭 background 색깔입히기
        span.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";
        //리스트 블록 추가시
        if (span.textContent.includes("번 반복 (for문)") === true) {
            span.setAttribute('data-value', 'FOR');
            //var value = document.getElementById('mySpan').getAttribute('data-value'); //value 꺼내기
            span.innerHTML = "";
            span.title = "반복할 횟수 입력";
            create_for(span); //child인 text를 가져오도록 하는 방법
        }
        else if (span.textContent.includes("번 반복 (while문)") === true) {
            span.setAttribute('data-value', 'WHILE');
            span.innerHTML = "";
            span.title = "첫 빈칸 : 변수명 / 두번째 빈칸 : 변수명에 들어갈 내용(ex. 1, 2, 'a', 'b')";
            create_while(span);
        }
        else if (span.textContent.includes("변수") === true) {
            span.setAttribute('data-value', 'VARIABLE');
            span.innerHTML = "";
            span.title = "첫 빈칸 : 변수명 / 두번째 빈칸 : 변수명에 들어갈 내용(ex. 1, 2, 'a', 'b')";
            create_variable(span);
        }
        else if (span.textContent.includes("만약") === true) {
            span.setAttribute('data-value', 'IF');
            create_if(span);
        }
        else if (span.textContent.includes("연산자") === true) {
            span.setAttribute('data-value', 'OPERATOR');
            span.innerHTML = "";
            create_operator(span);
        }
        else if (span.textContent.includes("출력") === true) {
            span.setAttribute('data-value', 'PRINT');
            span.innerHTML = "";
            create_print(span);
        }
        else if (span.textContent.includes("스위치") === true) {
            //span.setAttribute('data-value', 'value값넣기')
            span.setAttribute('data-value', 'SWITCH');
            span.innerHTML = "만약 ";
            span.title = "버튼을 클릭하여 케이스를 추가하세요";
            span.setAttribute('SwitchCount', cnt); // cnt 해당하는 값을 Span에 속성값으로 저장
            span.setAttribute("CaseCount", case_count); // case_count(케이스 갯수)를 Span에 속성값으로 저장
            create_switch(span); // Switch 블럭 생성
            var plus = document.createElement('button'); // + 버튼 생성
            plus.textContent = "+";
            plus.id = span.getAttribute("SwitchCount"); // 버튼 만들때 버튼의 아이디 값을 Span의 SwitchCount의 속성값으로 지정
            plus.addEventListener('click', function () {
                const span_case = add_case_block(span, color);
                explain = document.createTextNode(" 일때");
                span_case.appendChild(explain);
                span_case.classList.add("switch");
                contain.insertBefore(span_case, switch_close_span[plus.id]); // Plus를 누른 Span 의 "/" 블록을 찾아 그위에 바로 Case 블록을 붙임
            })
            switch_id = span.id;
            span.appendChild(plus);
        }
        else {
            //span.setAttribute('data-value', 'value값넣기')
            create_text(span, 1, 0);
        }
        if (include_close == 0) {
            contain.appendChild(span);
        }
        else { //close 블럭 추가
            span.classList.add("closed");
            const span_close = add_close_block(color);
            if (span.getAttribute('SwitchCount') != null) {
                switch_close_span[span.getAttribute("SwitchCount")] = span_close; // 스위치의 close 블록 (span)을 switch_close_span 배열에 저장
            }
            contain.appendChild(span);
            contain.appendChild(span_close);
            span_close_setting = span_close;
        }
        check = 1;
        span_setting = span;
        draggableElements = [ //getDragAfterElement 함수에서 필요한데 처리속도 개선으로 인한 안타까움으로 쩔 수 없음
            ...contain.querySelectorAll("span.conding_contents:not(.select)") //css가 conding_contents인 요소 전부 찾기
        ];
        spans = document.querySelectorAll("span.conding_contents");
    }
});

contain.addEventListener("drop", (e) => { //놓기
    e.preventDefault();
    if (check == 1 && in_check == 0) { //목록에서 들고 왔으면

        above_block = getSpanAboveCurrent(contain, span_setting); //여기서 부터 switch 정리
        if(above_block && above_block.getAttribute('data-value') != null){
            if (above_block.getAttribute('data-value') === 'SWITCH') { //넣은 곳이 switch일시
                const re = document.getElementById("immediate" + cnt.toString());
                re.remove();
                if (include_close == 1) {
                    const re_close = document.getElementById("close_immediate" + cnt.toString());
                    re_close.remove();
                }
            }
        }

        cnt = cnt + 1;
        check = 0;
        if (include_close == 0) { // close가 없는 코드는
            span_setting.classList.remove("select");
        }
        else { // 있는 코드는
            span_close_setting.classList.remove("select");
            span_setting.classList.remove("select");
            include_close = 0;
        }
    }
    else if (check == 0 && in_check == 1) { //코드에서 들고 왔으면
        //검사

        close_click = null;
        if (include_close == 0) { // close가 없는 코드는
            span_setting.classList.remove("select");
        }
        else { // close가 있는 코드는
            span_setting.classList.remove("select");
            span_close_setting.classList.remove("select");
        }
    }
    spans = document.querySelectorAll("span.conding_contents");

    // spans.forEach(span => {
    //     var now_above = getSpanAboveCurrent(contain, span);
    //     if (now_above != null) {
    //         if (now_above.getAttribute('data-value') == 'CASE') {
    //             var caseID = now_above.id;
    //             span.setAttribute('under-case', caseID);
    //         }
    //         else if (now_above.getAttribute('under-case') != null) {
    //             span.setAttribute('under-case', now_above.getAttribute('under-case'));
    //         }
    //         else {
    //             span.setAttribute('under-case', '');
    //         }
    //     }
    // })
});

contain.addEventListener("dragover", (e) => { //움직이기
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY + contain.scrollTop);
    var draggable = null;
    if (afterElement != null) {
        // 드래그 중인 블럭 위의 블럭이 이전과 달라지면
        if (temp_afterElement_id != afterElement.id) {

            if (close_click != null) { // 클릭한 것이 "/if"인지 "if"인지 판별
                // "/if"라면
                draggable = document.querySelector(".conding_contents.select");
                var dontmove = draggable.id.replace("close_", "");
            }
            else { // 'if' 라면
                draggable = document.querySelector(".conding_contents.select:not(.this_is_close)");
                var dontmove = "";
            }
            if (dontmove === "") {
                if (afterElement !== undefined) {
                    if (draggable && afterElement) { //가능한 
                        contain.insertBefore(draggable, afterElement);
                        if (include_close == 1) { //close를 포함한 코드인지 아닌지
                            const draggable_close = document.getElementById("close_" + draggable.id);
                            contain.insertBefore(draggable_close, afterElement);
                        }
                    }
                }
            }
            temp_afterElement_id = afterElement.id;
        }
    }
    if (afterElement === null) {
        if (close_click != null) { // 클릭한 것이 "/if"인지 "if"인지 판별
            // "/if"라면
            draggable = document.querySelector(".conding_contents.select");
            var dontmove = draggable.id.replace("close_", "");
        }
        else { // 'if' 라면
            draggable = document.querySelector(".conding_contents.select:not(.this_is_close)");
            var dontmove = "";
        }
        if (dontmove === "") {
            contain.appendChild(draggable);
            if (include_close == 1) { //close를 포함한 코드인지 아닌지
                const draggable_close = document.getElementById("close_" + draggable.id);
                contain.appendChild(draggable_close);
            }
        }
    }
});