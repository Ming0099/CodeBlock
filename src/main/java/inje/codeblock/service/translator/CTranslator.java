package inje.codeblock.service.translator;

import java.util.Stack;

public class CTranslator implements CodeTranslator{
    private StringBuilder code;
    private Stack<Integer> codeDepthStack;

    public CTranslator() {
        code = new StringBuilder();
        codeDepthStack = new Stack<>();
        codeDepthStack.push(0);
    }

    @Override
    public void translatePrint(String text) {
        createIndent(getCodeDepth());
        code.append("printf(\"").append(text).append("\\n\");\n");
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
    public void translateIf(String s1, String s2, String condition) {
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
            code.append("\t");
        }
    }

    @Override
    public String getTranslatedCode() {
        closeAllBraces();
        return code.toString();
    }
}
