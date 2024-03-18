package inje.codeblock.service.translator;

import java.util.Stack;

public class CTranslator extends TranslatorFunction implements CodeTranslator{
    private StringBuilder code;
    private Stack<Integer> codeDepthStack;

    public CTranslator() {
        code = new StringBuilder();
        codeDepthStack = new Stack<>();
        codeDepthStack.push(0);
    }

    @Override
    public void translateVariable(String name, String value) {
        String type = translateType(value);
        if (type.equals("char")){ // 문자
            value = "\'" + value + "\'";
        }else if(type.equals("char *")){ // 문자열
            value = "\"" + value + "\"";
        }
        createIndent(getCodeDepth());
        code.append(type).append(" ").append(name).append(" = ").append(value).append(";\n");
    }

    @Override
    public void translatePrint(String text) {
        createIndent(getCodeDepth());
        code.append("printf(\"").append(text).append("\");\n");
    }

    @Override
    public void translateFor(int count) {
        createIndent(getCodeDepth());
        code.append("for(int i = 0; i < ").append(count).append("; i++) {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateWhile(int count) {
        createIndent(getCodeDepth());
        code.append("int i = 0;\n");
        createIndent(getCodeDepth());
        code.append("while(i < ").append(count).append(") {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateIf(String s1, String condition, String s2) {
        // 조건 변환
        condition = translateCondition(condition);
        createIndent(getCodeDepth());
        code.append("if(").append(s1).append(" ").append(condition).append(" ").append(s2).append(") {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void closeBrace() {
        createIndent(getCodeDepth() - 1);
        code.append("}\n");
        codeDepthStack.pop();
    }

    @Override
    public int getCodeDepth() {
        return codeDepthStack.peek();
    }

    @Override
    public void closeAllBraces() {
        while (getCodeDepth() > 0) {
            closeBrace();
        }
    }

    @Override
    public void createIndent(int count) {
        for(int i=0; i<count; i++){
            code.append("   ");
        }
    }

    @Override
    public String getTranslatedCode() {
        closeAllBraces();
        return code.toString();
    }
}