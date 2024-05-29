var currentQuestionNumber = 0;

function questionCheck(){
    const ulElement = $('#question_list').find('li');

    $(ulElement[currentQuestionNumber]).attr('id', 'success');

    currentQuestionNumber++;
    
    $(ulElement[currentQuestionNumber]).attr('id','current');

    if(currentQuestionNumber == 5){
        alert("학습이 완료되었습니다!");
        location.href = "/learn";
    }
}