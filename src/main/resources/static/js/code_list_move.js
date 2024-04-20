draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", (e) => {
        target_id = draggable.textContent; //드래그한 목록이름
        var classListArray = Array.from(draggable.classList);
        classListArray.some(className => {
            if (className === "closed") { include_close = 1; return true; }
            return false;
        });
        draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", (e) => {
        draggable.classList.remove("dragging");
        include_close = 0;
    });
});

contain.addEventListener("dragleave", (e) => { //나가기
    e.preventDefault();

    // 현재 드래그된 요소
    const draggingElement = e.relatedTarget || e.fromElement;

    // 현재 드래그된 요소가 자식 요소인지 확인
    if ((draggingElement && contain.contains(draggingElement))) {
        return; // 자식 요소일 경우 무시
    }

    if(e.relatedTarget.parentNode && e.relatedTarget.parentNode.toString() === "[object ShadowRoot]"){
        return;
    }

    if(e.fromElement.parentNode && e.fromElement.parentNode.toString() === "[object ShadowRoot]"){
        return;
    }

    if (check == 1) {
        check = 0;
        const re = document.getElementById("immediate" + cnt.toString());
        re.remove();
        if (include_close == 1) {
            const re_close = document.getElementById("close_immediate" + cnt.toString());
            re_close.remove();
        }
    }
});