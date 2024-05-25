function create_my_variable() {
    my_variables_blocks = [];
    document.querySelectorAll("span.conding_contents").forEach(span => { //변수 블럭 찾기 
        if (span.getAttribute('data-value') == 'VARIABLE') {
            my_variables_blocks.push(span);
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
        // else {
        //     var modal_variable = document.createElement('span');
        //     modal_variable.id = temp_variable.id;
        //     modal_variable.textContent = temp_variable.textContent;
        //     modal_variable.setAttribute('data-value', temp_variable.getAttribute('data-value'));
        //     modal_variable.style.backgroundColor = '#855CD6';
        //     modal_variable.style.color = '#fff';
        //     modal_variable.style.cursor = 'pointer'
        //     modal_variable.addEventListener('click', function () {
        //         document.getElementById('variable_input_texting').innerHTML = "";
        //         var temp1 = this.cloneNode(true);
        //         temp1.style.cursor = 'default';
        //         document.getElementById('variable_input_texting').appendChild(temp1);
        //     })

        //     modal.appendChild(modal_variable);
        // }
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
    var {temp_input_variable, start_span} = can_use_variable(spans[0], end_span); //처음 부터 클릭한 값까지 찾기
    var modal = document.getElementById('my_variable_blocks_in_modal');
    temp_input_variable.forEach(per =>{
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
                var {temp_input_variable, start_span} = can_use_variable(start_span, end_span);
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
                                if(check_use_many_variable == 1) {
                                    //variable_input_texting.innerHTML = "";
                                    //var temp1 = this.cloneNode(true);
                                    //temp1.style.cursor = 'default';
                                    $('#variable_input_texting').val(this.textContent);
                                    //save_click_varibale_blocks = temp1.textContent; // 클릭한 버튼의 텍스트값 저장
                                    // save_modal_variable_blocks.forEach(f => { // 버튼 클릭시 비활성화 코드
                                    //     f.disabled = false;
                                    // })
                                    //this.disabled = true;
                                }
                                else{
                                    // var temp1 = this.cloneNode(true);
                                    // temp1.addEventListener('click', function () {
                                    //     variable_input_texting.removeChild(temp1);
                                    //     save_modal_variable_blocks.forEach(f => {
                                    //         if(f.textContent == temp1.textContent){
                                    //             f.disabled = false;
                                    //             console.log(variable_input_texting.textContent);
                                    //             save_click_varibale_blocks = save_click_varibale_blocks.filter(user => {
                                    //                 return user !== f.textContent;
                                    //             })
                                    //         }
                                    //     })
                                    // })
                                    // temp1.style.cursor = 'default';
                                    // variable_input_texting.appendChild(temp1);
                                    // save_click_varibale_blocks.push(temp1.textContent); // 클릭한 버튼의 텍스트값 저장
                                    // this.disabled = true; // 버튼 클릭시 비활성화 코드
                                    var content_temp = $('#variable_input_texting').val() + this.textContent;
                                    $('#variable_input_texting').val(content_temp);
                                    $('#variable_input_texting').focus();
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