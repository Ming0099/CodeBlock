let currentIndex = 0;
let study_content_json = null; // 학습하기 컨텐츠 json
let selectedContentInfo = null; // 선택된 학습하기 컨텐츠 정보
let selectedContentSize = 0; // 선택된 학습하기 컨텐츠 개수(이미지,텍스트 개수)

// json 파일 가져오기
function getJSON(){
    fetch("js/learn/info.json")
    .then((res) => {
    return res.json()
    })
    .then((obj) => {
        study_content_json = obj;
    })
}
getJSON();

// study_content 클릭 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    // 클래스 이름으로 요소들을 선택
    const boxes = document.querySelectorAll('.study_content');

    // 각 요소에 클릭 이벤트 리스너 추가
    boxes.forEach(function(box) {
        box.addEventListener('click', function(){

            // json에서 해당 콘텐츠 가져오기 (제목, 설명)
            selectedContentInfo = study_content_json[box.id];
            selectedContentSize = Object.keys(selectedContentInfo.text).length;

            // 초기화
            $(".slides").html("");
            // popup 사진 변경
            for(let i=0; i<selectedContentSize; i++){
                const img = document.createElement("img");
                img.src = "image/learn/"+box.id+"/"+i+".jpg";
                $(".slides").append(img);
            }

            // 제목 설정
            $(".popup_top").text(selectedContentInfo.title);

            // 설명 설정
            $(".popup_foot_info").text(selectedContentInfo.text[0]);
                
            document.querySelector(".modalbackground").className = "modalbackground show";
        });
    });

    const slides = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const slideWidth = slides.clientWidth;
    currentIndex = 0;  // 초기값을 1로 설정

    updateSlidePosition();

    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            // 마지막 페이지가 아닐 때 "학습하러 가기" 버튼 안나타나게
            $(".to_learn").css("display","none");
            // 설명 설정
            $(".popup_foot_info").text(selectedContentInfo.text[currentIndex]);
        }
        updateSlidePosition();
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < slides.children.length - 1) {
            currentIndex++;
            // 설명 설정
            $(".popup_foot_info").text(selectedContentInfo.text[currentIndex]);
        }
        // 마지막 페이지일때 "학습하러 가기" 버튼 나타나게
        if(currentIndex == slides.children.length - 1){
            $(".to_learn").css("display","block");
        }
        updateSlidePosition();
    });

    function updateSlidePosition() {
        slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
});

// 모달창 띄우기
function show() {
    document.querySelector(".modalbackground").className = "modalbackground show";
}

// 모달창 닫기
function cancel(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('window')) {
        const slides = document.querySelector('.slides');
        const slideWidth = slides.clientWidth;
        currentIndex = 0;
        slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        // 설명 clear
        $(".popup_foot_info").text("");
        // 버튼 clear
        $(".to_learn").css("display","none");
        document.querySelector(".modalbackground").className = "modalbackground";
    }
    
}