function create_my_variable() {
    my_variables_blocks = [];
    my_operator_blocks = [];
    document.querySelectorAll("span.conding_contents").forEach(span => { //변수 블럭 찾기 
        if (span.getAttribute('data-value') == 'VARIABLE') {
            my_variables_blocks.push(span);
        }
        else if (span.getAttribute('data-value') == 'VARIABLE_OPERATOR') {
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
                        var kValue = Number(k.value);
                        if (isNaN(kValue)) {
                            temp_variable.setAttribute('canNumber', 'cant');
                        } else {
                            temp_variable.setAttribute('canNumber', 'can');
                        }
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
                        temp_variable.setAttribute('canNumber', 'can');
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

function input_print_modal_screen(end_span) {
    var { temp_input_variable, start_span } = can_use_variable(spans[0], end_span); //처음 부터 클릭한 값까지 찾기
    var modal = document.getElementById('my_variable_blocks_in_print_modal');
    temp_input_variable.forEach(per => {
        modal.appendChild(per);
    });
}

function can_use_variable(start_span, end_span) {
    var input_variable = [];
    save_modal_variable_blocks = [];
    document.getElementById('my_variable_blocks_in_modal').innerHTML = "";
    document.getElementById('my_variable_blocks_in_print_modal').innerHTML = "";
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
                                    var find_input_select = document.getElementById('print_input_texting');
                                    if (find_input_select.selectionStart == find_input_select.textContent.length - 1) {
                                        var content_temp = $('#print_input_texting').val() + '<' + this.textContent + '>';
                                        $('#print_input_texting').val(content_temp);
                                        $('#print_input_texting').focus();
                                        texting_backup = $('#print_input_texting').val();
                                    }
                                    else{
                                        var temp_text = document.getElementById('print_input_texting').value.slice(0, find_input_select.selectionStart) + '<' + this.textContent + '>' + document.getElementById('print_input_texting').value.slice(find_input_select.selectionStart)
                                        document.getElementById('print_input_texting').value = temp_text;
                                        $('#print_input_texting').focus();
                                        texting_backup = $('#print_input_texting').val();
                                    }
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
        else if (start_span.getAttribute('data-value') && start_span.getAttribute('data-value') == 'VARIABLE_OPERATOR') {
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
                                    var find_input_select = document.getElementById('print_input_texting');
                                    if (find_input_select.selectionStart == find_input_select.textContent.length - 1) {
                                        var content_temp = $('#print_input_texting').val() + '<' + this.textContent + '>';
                                        $('#print_input_texting').val(content_temp);
                                        $('#print_input_texting').focus();
                                        texting_backup = $('#print_input_texting').val();
                                    }
                                    else{
                                        var temp_text = document.getElementById('print_input_texting').value.slice(0, find_input_select.selectionStart) + '<' + this.textContent + '>' + document.getElementById('variable_input_texting').value.slice(find_input_select.selectionStart)
                                        document.getElementById('print_input_texting').value = temp_text;
                                        texting_backup = document.getElementById('print_input_texting').value;
                                    }
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