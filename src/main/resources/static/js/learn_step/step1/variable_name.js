var target_id = "";
const draggables = document.querySelectorAll("li.button"); //목록버튼 모으기
const contain = document.querySelector("div.code_screen"); //코드스크린 가져오기
var spans = document.querySelectorAll("span.conding_contents");
var in_check = 0;

var include_close = 0;
var close_click = null;
var cnt = 0;

var check = 0;
var span_setting = null; // "if"부분 및 단일 형태의 코드를 얻기 위해
var span_close_setting = null; //"/if"부분을 얻기 위해
var dont_up = 0; //위로 올라갈지 여부


var result_span_check = 0;
const init = "";


var input_text_element = null;

// Mutation Observer 설정
const observerConfig = { childList: true, subtree: true };
// 감시할 대상 요소 선택
const targetNode = document.body;

var remove_code = null;
var remove_close_code = null;
var mousedown_check = 0;

var pre_block = null; //여닫이 검사
var first = 0;

var draggableElements = null;
var focus_block = null;

var temp_afterElement_id = null;