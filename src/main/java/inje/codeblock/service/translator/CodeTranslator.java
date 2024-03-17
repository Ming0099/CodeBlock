package inje.codeblock.service.translator;

public interface CodeTranslator {
    void translatePrint(String text);
    void translateFor(int count);
    void translateWhile(int count);
    void translateIf(String s1, String s2, String condition);
    void closeBrace();
    int getCodeDepth();
    void closeAllBraces();
    void createIndent(int count);
    String getTranslatedCode();

}
