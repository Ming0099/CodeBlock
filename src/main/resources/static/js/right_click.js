const popMenu = document.getElementById('popMenu'); // 팝업창을 담아옴
document.addEventListener("contextmenu", function (e) { //우클릭시 메뉴보이기
    e.preventDefault();
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
    popMenu.style.display = 'none';
    popMenu.style.top = null;
    popMenu.style.left = null;
});

popMenu.addEventListener("click", function (e) {
    alert("삭제");
    if (remove_code !== null) {
        if (remove_code.getAttribute('data-value') !== null) { //data-value값이 있는지 확인

            if (remove_code.getAttribute('data-value').includes('SWITCH')) { //스위치를 지웠을때 전체를 지움
                var num = remove_code.id.match(/\d+/)[0];

                var spans_array = BetweenSpantoSpan(remove_code, ['close_immediate' + num]) //시작은 element, 끝은 id인 배열을 넣어야함
                for(var i=0; i< spans_array.length; i++){
                    contain.removeChild(spans_array[i]);
                }
            }
            if (remove_code.getAttribute('data-value').includes('CASE')) { //case만 지웠을때 
                var num = remove_code.id.match(/\d+/)[0];

                var spans_array = BetweenSpantoSpan(remove_code, ['close_immediate' + num, 'case_immediate' + num]) 
                //시작은 element, 끝은 id인 배열을 넣어야함
                for(var i=0; i< spans_array.length; i++){
                    contain.removeChild(spans_array[i]);
                }
            }
        }
        if (remove_close_code != null) { //닫는 블록이 있는지 확인
            contain.removeChild(remove_close_code);
            remove_close_code = null;
        }
        contain.removeChild(remove_code);
        remove_code = null;
        create_my_variable();
    }
});