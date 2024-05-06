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
        temp_variable.classList.add('button')
        temp_variable.draggable = false;
        temp_variable.style.cursor = "default";

        var temp_underbar = document.createElement('li');
        temp_underbar.classList.add('underbar');
        lists.appendChild(temp_variable);
        lists.appendChild(temp_underbar);

        var modal_variable = document.createElement('span');
        modal_variable.id = temp_variable.id;
        modal_variable.textContent = temp_variable.textContent;
        modal_variable.setAttribute('data-value', temp_variable.getAttribute('data-value'));
        modal_variable.style.backgroundColor = '#855CD6';
        modal_variable.style.color = '#fff';

        modal.appendChild(modal_variable);
    });
}