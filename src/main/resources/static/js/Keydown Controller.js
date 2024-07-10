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
            if (positions1[i] <= this.selectionStart && positions2[i] >= this.selectionStart) {
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
    else if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 37 && event.keyCode != 39) {
        var text = event.target.value;
        var regex = /</g;
        var matches = [...text.matchAll(regex)];
        var positions1 = matches.map(match => match.index);

        regex = />/g;
        matches = [...text.matchAll(regex)];
        var positions2 = matches.map(match => match.index);
        for (var i = 0; i < positions2.length; i++) { //변수값에 사이에 작성
            if (positions1[i] < this.selectionStart && positions2[i] > this.selectionStart) {
                alert('변수값 사이에는 작성이 불가합니다.');
                texting_backup_check = 1;
                break;
            }
        }
    }
});

document.getElementById('print_input_texting').addEventListener('input', function (event) {

    if (press_backspace == 1) { //백스페이스
        var text = texting_backup;
        var regex = /</g;
        var matches = [...text.matchAll(regex)];
        var positions1 = matches.map(match => match.index);

        regex = />/g;
        matches = [...text.matchAll(regex)];
        var positions2 = matches.map(match => match.index);
        for (var i = 0; i < positions2.length; i++) {
            if (positions1[i] <= this.selectionStart && positions2[i] >= this.selectionStart) {
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

document.getElementById('print_input_texting').addEventListener('keydown', function (event) {
    if (event.keyCode === 8) { // 백스페이스 키의 keyCode는 8입니다.
        texting_backup = this.value;
        press_backspace = 1;
    }
    else if (event.key == '>' || event.key == '<') {
        alert("'<'와 '>'은 입력 불가입니다.");
        texting_backup_check = 1;
    }
    else if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 37 && event.keyCode != 39) {
        var text = event.target.value;
        var regex = /</g;
        var matches = [...text.matchAll(regex)];
        var positions1 = matches.map(match => match.index);

        regex = />/g;
        matches = [...text.matchAll(regex)];
        var positions2 = matches.map(match => match.index);
        for (var i = 0; i < positions2.length; i++) { //변수값에 사이에 작성
            if (positions1[i] < this.selectionStart && positions2[i] > this.selectionStart) {
                alert('변수값 사이에는 작성이 불가합니다.');
                texting_backup_check = 1;
                break;
            }
        }
    }
});

document.getElementById('input_texting').addEventListener('input', function (event) {
    if (check_only_number == 1) {
        if (input_text_element.parentNode.getAttribute('data-value') == 'FOR' || input_text_element.parentNode.getAttribute('data-value') == 'WHILE') {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
        else {
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        } 
    }
});