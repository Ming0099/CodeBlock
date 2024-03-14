// Mutation Observer 생성
const observer = new MutationObserver(() => { //code div에 있는 설정 코드들 기동하기
    document.querySelectorAll("span.conding_contents").forEach(span => {
        span.addEventListener("dragstart", function (e) {
            // 클릭할 때 수행할 작업
            var classListArray = Array.from(span.classList);
            if (span.id.includes("close_")) {
                close_click = span.id;
            }
            in_check = 1;
            span.classList.add("select");
            span_setting = span;
        });
        span.addEventListener("dragend", function (e) {
            // 클릭할 때 수행할 작업
            if (include_close == 1) {
                include_close = 0;
            }
            in_check = 0;
            dont_up = 0;
            span.classList.remove("select");
        });
        span.addEventListener("mousedown", function (e) {
            if (((e.button == 2) || (e.which == 3)) && mousedown_check == 0) {
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
                        return true;
                    }
                    return false;
                });
                mousedown_check = 1;
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
        const span = document.createElement('span');
        span.draggable = true;
        span.innerHTML = target_id;
        span.id = "immediate" + cnt.toString();
        span.classList.add("conding_contents");
        span.classList.add("select");

        var color = random_color();
        span.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";

        if (span.textContent.includes("부터~까지") === true) {
            span.title = "첫 빈칸 : ~부터 / 중간 빈칸 : ~까지 / 마지막 빈칸 : ~까지가는데 건너는 크기"
            create_text(span, 3, 0);
        }
        else if(span.textContent.includes("변수") === true){
            span.title = "첫 빈칸 : 변수명 / 두번째 빈칸 : 변수명에 들어갈 내용(ex. 1, 2, 'a', 'b')";
            create_text(span, 2, 0);
        }
        else if(span.textContent.includes("만약") === true){
            create_if(span);
        }
        else{
            create_text(span, 1, 0);
        }

        if (include_close == 0) {
            contain.appendChild(span);
        }
        else {
            span.classList.add("closed");

            const span_close = document.createElement('span'); //span추가 및 설정 //닫는 것
            span_close.draggable = true;
            span_close.innerHTML = "/" + target_id;
            span_close.id = "close_immediate" + cnt.toString();
            span_close.classList.add("conding_contents");
            span_close.classList.add("closed");
            span_close.classList.add("select");
            span_close.classList.add("this_is_close");
            span_close.style.backgroundColor = "rgba(" + color[0].toString() + ", " + color[1].toString() + ", " + color[2].toString() + ", 0.5)";

            contain.appendChild(span);
            contain.appendChild(span_close);
            span_close_setting = span_close;
        }
        check = 1;
        span_setting = span;
    }
});

contain.addEventListener("drop", (e) => { //놓기
    e.preventDefault();
    if (check == 1 && in_check == 0) { //목록에서 들고 왔으면
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
        in_check = 0;
        close_click = null;
        if (include_close == 0) { // close가 없는 코드는
            span_setting.classList.remove("select");
        }
        else { //있는 코드는
            span_setting.classList.remove("select");
            span_close_setting.classList.remove("select");
        }
    }
    spans = document.querySelectorAll("span.conding_contents");
});

contain.addEventListener("dragover", (e) => { //움직이기
    e.preventDefault();
    const afterElement = getDragAfterElement(contain, e.clientY);
    var draggable = null;
    if (close_click != null) { // 클릭한 것이 "/if"인지 "if"인지 판별
        draggable = document.querySelector(".conding_contents.select");
        var dontmove = draggable.id.replace("close_", "");
    }
    else {
        draggable = document.querySelector(".conding_contents.select:not(.this_is_close)");
        var dontmove = "";
    }
    if (afterElement === undefined) { //위치 바꿀게 없으면
        contain.appendChild(draggable);
        if (include_close == 1) { //close를 포함한 코드인지 아닌지
            const draggable_close = document.getElementById("close_" + draggable.id);
            contain.appendChild(draggable_close);
        }
    }
    else {
        if (afterElement.id === dontmove) { // "/if"가 "if"위로 못올라가게 하는것
            if (dont_up == 0) {
                dont_up = 1;
            }
            else {
                dont_up = 0;
            }
        }
        else if (dont_up != 1) {
            contain.insertBefore(draggable, afterElement);
            if (include_close == 1) { //close를 포함한 코드인지 아닌지
                const draggable_close = document.getElementById("close_" + draggable.id);
                contain.insertBefore(draggable_close, afterElement);
            }
        }
    }
});