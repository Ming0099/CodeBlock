function create_my_variable() {
    my_variables_blocks = [];
    my_operator_blocks = [];
    document.querySelectorAll("span.conding_contents").forEach(span => { //변수 블럭 찾기 
        if (span.getAttribute('data-value') == 'VARIABLE') {
            my_variables_blocks.push(span);
        }
        else if (span.getAttribute('data-value') == 'OPERATOR') {
            my_operator_blocks.push(span);
        }
    });

    var lists = document.getElementById('my_variable_blocks');
    var modal = document.getElementById('my_variable_blocks_in_modal');
    lists.innerHTML = "";
    modal.innerHTML = "";
    my_variables_blocks.forEach(variable => {
        var temp_variable = document.createElement('li');
        var input_count = 0; //1 이면 선언명 2 면 선언값
        var retrun_bool = false; //text값이 empty인지 아닌지 
        variable.childNodes.forEach(k => {
            if (k && k.tagName && k.tagName.toLowerCase() === 'input') { // input 형태인지
                if (k.value != '') {
                    input_count += 1;
                    if (input_count == 1) {
                        temp_variable.textContent = k.value;
                        temp_variable.id = "@" + k.value + "@";
                    }
                    else if (input_count == 2) {
                        temp_variable.setAttribute('data-value', k.value);
                        temp_variable.title = k.value;
                    }
                }
                else {
                    retrun_bool = true;
                    return;
                }
            }
        });
        if (retrun_bool == true) {
            return;
        }
        temp_variable.classList.add('button')
        temp_variable.draggable = false;
        temp_variable.style.cursor = "default";

        var temp_underbar = document.createElement('li');
        temp_underbar.classList.add('underbar');
        lists.appendChild(temp_variable);
        lists.appendChild(temp_underbar);
    });

    my_operator_blocks.forEach(variable => {
        var temp_variable = document.createElement('li');
        var input_count = 0; //1 이면 선언명 2 면 선언값
        var retrun_bool = false; //text값이 empty인지 아닌지
        var title_explain = "";
        variable.childNodes.forEach(k => {
            if (k && k.tagName && k.tagName.toLowerCase() === 'input') { // input 형태인지
                if (k.value != '') {
                    input_count += 1;
                    if (input_count == 1) {
                        temp_variable.textContent = k.value;
                        temp_variable.id = "@" + k.value + "@";
                    }
                    else if (input_count == 2) {
                        title_explain = k.value;
                    }
                    else if (input_count == 3) {
                        title_explain = title_explain + k.value;
                        temp_variable.setAttribute('data-value', title_explain);
                        temp_variable.title = title_explain;
                        title_explain = "";
                    }
                }
                else {
                    retrun_bool = true;
                    return;
                }
            }
            else if (k && k.tagName && k.tagName.toLowerCase() === 'select') {
                var oper = k.options[k.selectedIndex].value;
                if (oper == '더하기') { title_explain = title_explain + " + "; }
                else if (oper == '빼기') { title_explain = title_explain + " - "; }
                else if (oper == '나누기') { title_explain = title_explain + " / "; }
                else { title_explain = title_explain + " * "; }
            }
        });
        if (retrun_bool == true) {
            return;
        }
        temp_variable.classList.add('button')
        temp_variable.draggable = false;
        temp_variable.style.cursor = "default";

        var temp_underbar = document.createElement('li');
        temp_underbar.classList.add('underbar');
        lists.appendChild(temp_variable);
        lists.appendChild(temp_underbar);
    });
}



function input_variable_modal_screen2(end_span) {
    var { temp_input_variable, start_span } = can_use_variable(spans[0], end_span); //처음 부터 클릭한 값까지 찾기
    var modal = document.getElementById('my_variable_blocks_in_modal');
    temp_input_variable.forEach(per => {
        modal.appendChild(per);
    });
}

function can_use_variable(start_span, end_span) {
    var input_variable = [];
    save_modal_variable_blocks = [];
    document.getElementById('my_variable_blocks_in_modal').innerHTML = "";
    while (start_span != null) {
        if (start_span.classList.contains('closed')) { //괄호 여부 
            if (start_span.id.includes('close_')) { // 닫는 괄호
                input_variable = [];
                var temp_input_variable = input_variable;
                return { temp_input_variable, start_span };
            }
            else {
                start_span = getSpanUnderCurrent(contain, start_span);
                var { temp_input_variable, start_span } = can_use_variable(start_span, end_span);
                input_variable = input_variable.concat(temp_input_variable);
                console.log("연속성 : " + input_variable)
            }
        }
        if (start_span.id == end_span.id) { //끝
            var temp_input_variable = input_variable;
            return { temp_input_variable, start_span }
        }
        if (start_span.getAttribute('data-value') && start_span.getAttribute('data-value') == 'VARIABLE') { //변수 넣기
            var modal_variable = document.createElement('button');
            var input_count = 0;
            start_span.childNodes.forEach(k => {
                if (k && k.tagName && k.tagName.toLowerCase() === 'input') { // input 형태인지
                    if (k.value != '') {
                        input_count += 1;
                        if (input_count == 1) {
                            modal_variable.textContent = k.value;
                            modal_variable.id = "@" + k.value + "@";
                        }
                        else if (input_count == 2) {
                            modal_variable.setAttribute('data-value', k.value);
                            modal_variable.classList.add('modal_variable');
                            save_modal_variable_blocks.push(modal_variable);
                            modal_variable.addEventListener('click', function () {
                                if (check_use_many_variable == 1) {
                                    $('#variable_input_texting').val('<' + this.textContent + '>');
                                }
                                else {
                                    var content_temp = $('#variable_input_texting').val() + '<' + this.textContent + '>';
                                    $('#variable_input_texting').val(content_temp);
                                    $('#variable_input_texting').focus();
                                    texting_backup = $('#variable_input_texting').val();
                                }

                            })
                            input_variable.push(modal_variable);
                        }
                    }
                    else {
                        return;
                    }
                }
            });
        }
        else if (start_span.getAttribute('data-value') && start_span.getAttribute('data-value') == 'OPERATOR') {
            var modal_variable = document.createElement('button');
            var input_count = 0;
            start_span.childNodes.forEach(k => {
                if (k && k.tagName && k.tagName.toLowerCase() === 'input') { // input 형태인지
                    if (k.value != '') {
                        input_count += 1;
                        if (input_count == 1) {
                            modal_variable.textContent = k.value;
                            modal_variable.id = "@" + k.value + "@";
                        }
                        else if (input_count == 2) {
                            modal_variable.setAttribute('data-value', k.value);
                            modal_variable.classList.add('modal_variable');
                            save_modal_variable_blocks.push(modal_variable);
                            modal_variable.addEventListener('click', function () {
                                if (check_use_many_variable == 1) {
                                    $('#variable_input_texting').val('<' + this.textContent + '>');
                                }
                                else {
                                    var content_temp = $('#variable_input_texting').val() + '<' + this.textContent + '>';
                                    $('#variable_input_texting').val(content_temp);
                                    $('#variable_input_texting').focus();
                                    texting_backup = $('#variable_input_texting').val();
                                }

                            })
                            input_variable.push(modal_variable);
                        }
                    }
                    else {
                        return;
                    }
                }
            });
        }
        start_span = getSpanUnderCurrent(contain, start_span);
    }
    var temp_input_variable = input_variable;
    return { temp_input_variable, start_span };
}
document.getElementById('variable_input_texting').addEventListener('input', function (event) {

    if (press_backspace == 1) { //백스페이스
        var text = texting_backup;
        var regex = /</g;
        var matches = [...text.matchAll(regex)];
        var positions1 = matches.map(match => match.index);
    
        regex = />/g;
        matches = [...text.matchAll(regex)];
        var positions2 = matches.map(match => match.index);
        for (var i = 0; i < positions2.length; i++) {
            if (positions1[i] <= this.selectionStart && positions2[i] > this.selectionStart) {
                event.target.value = texting_backup.slice(0, positions1[i]) + texting_backup.slice(positions2[i] + 1);
                texting_backup = event.target.value;
                break;
            }
        }
        press_backspace = 0;
    }
    else if (texting_backup_check == 1) {
        texting_backup_check = 0;
        event.target.value = texting_backup;
    }
    else {
        texting_backup = event.target.value;
    }
});

document.getElementById('variable_input_texting').addEventListener('keydown', function (event) {
    if (event.keyCode === 8) { // 백스페이스 키의 keyCode는 8입니다.
        texting_backup = this.value;
        press_backspace = 1;
    }
    else if (event.key == '>' || event.key == '<') {
        alert("'<'와 '>'은 입력 불가입니다.");
        texting_backup_check = 1;
    }
    else if(event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 37 && event.keyCode != 39){
        var text = event.target.value;
        var regex = /</g;
        var matches = [...text.matchAll(regex)];
        var positions1 = matches.map(match => match.index);
    
        regex = />/g;
        matches = [...text.matchAll(regex)];
        var positions2 = matches.map(match => match.index);
        for (var i = 0; i < positions2.length; i++) { //변수값에 사이에 작성
            if (positions1[i] <= this.selectionStart && positions2[i] > this.selectionStart) {
                alert('변수값 사이에는 작성이 불가합니다.');
                texting_backup_check = 1;
                break;
            }
        }
    }
});