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
        switch_remove();
        if (remove_close_code != null) { //닫는 블록이 있는지 확인
            contain.removeChild(remove_close_code);
            remove_close_code = null;
        }
        if(remove_code.getAttribute('data-value') == 'VARIABLE' || remove_code.getAttribute('data-value') == 'VARIABLE OPERATOR'){
            try{
                remove_code.childNodes.forEach(f => {
                    if(f.getAttribute('variable_name') == 'yes'){
                        variables = variables.filter(user => {
                            return user !== f.value;
                        })
                        throw new Error();
                    }
                });
            } catch (error) {
                console.log("FOREACH문 탈출");
            } 
        }
        contain.removeChild(remove_code);
        remove_code = null;
        test_variables = [];
        create_my_variable();
    }
});