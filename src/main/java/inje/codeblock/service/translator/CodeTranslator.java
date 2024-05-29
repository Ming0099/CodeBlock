package inje.codeblock.service.translator;

public interface CodeTranslator {
    // 변수선언 변환
    void translateVariable(String name, String value);
    // 변경 변환
    void translateChange(String name, String value);
    // 연산자변경 변환
    void translateChangeOperator(String name, String value1, String operator, String value2);
    // 연산자선언 변환
    void translateOperator(String name, String value1, String operator, String value2);
    // 출력문 변환
    void translatePrint(String text);
    // for 루프 변환
    void translateFor(int count);
    // while 루프 변환
    void translateWhile(int count);
    // 조건문 변환
    void translateIf(String s1, String condition, String s2);
    // 스위치 변환
    void translateSwitch(String s1);
    // 케이스 변환
    void translateCase(String s1);
    // break 변환
    void translateBreak();
    // 중괄호 닫기
    void closeBrace();
    // 중괄호 블록 깊이 반환
    int getCodeDepth();
    // 모든 블록 닫기
    void closeAllBraces();
    // 들여쓰기 생성
    void createIndent(int count);
    // 번역된 코드 반환
    String getTranslatedCode();

}
