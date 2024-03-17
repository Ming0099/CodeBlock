package inje.codeblock.service.translator;

public interface CodeTranslator {
    // 변수선언 변환
    void translateVariable(String name, String value);
    // 출력문 변환
    void translatePrint(String text);
    // for 루프 변환
    void translateFor(int count);
    // while 루프 변환
    void translateWhile(int count);
    // 조건문 변환
    void translateIf(String s1, String condition, String s2);
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
