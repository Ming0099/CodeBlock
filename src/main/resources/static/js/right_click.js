const popMenu = document.getElementById('popMenu'); // 팝업창을 담아옴
document.addEventListener("contextmenu", function (e) { //우클릭시 메뉴보이기
    e.preventDefault(); // 원래 있던 오른쪽 마우스 이벤트를 무효화한다.
    if (mousedown_check == 1) {
        mousedown_check = 0;
        var x = (e.pageX + 10) + 'px'; // 현재 마우스의 X좌표
        var y = e.pageY + 'px'; // 현재 마우스의 Y좌표
        popMenu.style.position = 'absolute';
        popMenu.style.left = x;
        popMenu.style.top = y;
        popMenu.style.display = 'inline-block';
    }
})
document.addEventListener("click", function (e) {
    // 노출 초기화
    popMenu.style.display = 'none';
    popMenu.style.top = null;
    popMenu.style.left = null;
});
popMenu.addEventListener("click", function (e) {
    alert("삭제");
    if (remove_code !== null) {
        contain.removeChild(remove_code);
        if (remove_code.getAttribute('data-value') !== null) {
            if (remove_code.getAttribute('data-value').includes('SWITCH')) {
                var num = remove_code.id.match(/\d+/)[0];
                spans.forEach(span => {
                    if (span.id.includes('case_immediate' + num)) {
                        contain.removeChild(span);
                    }

                    if (span.getAttribute('under-case') != null) {
                        var temp_under_case = span.getAttribute('under-case');
                        console.log(temp_under_case);
                        if (temp_under_case.includes('case_immediate' + num)) {
                            contain.removeChild(span);
                        }
                    }
                });
            }
            if (remove_code.getAttribute('data-value').includes('CASE')) {
                spans.forEach(span => {
                    var attribute = span.getAttribute('under-case');
                    if (remove_code.id === attribute) {
                        contain.removeChild(span);
                    }
                })
            }
        }
        if (remove_close_code != null) {
            contain.removeChild(remove_close_code);
            remove_close_code = null;
        }
        remove_code = null;
    }
});