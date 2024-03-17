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
    public void translateVariable(String name, String value) {
        String type = "";
        if (isInteger(value)) {
            type = "int";
        } else if (isDouble(value)) {
            type = "double";
        } else if (isCharacter(value)) {
            type = "char";
        } else {
            type = "char *";
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
        switch (condition){
            case "작다":
                condition = "<";
                break;
            case "크다":
                condition = ">";
                break;
            case "같다":
                condition = "==";
                break;
            case "작거나 같다":
                condition = "<=";
                break;
            case "크거나 같다":
                condition = ">=";
                break;
            case "다르다":
                condition = "!=";
                break;
        }
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

    // 정수 확인
    public static boolean isInteger(String input) {
        try {
            Integer.parseInt(input);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // 소수 확인
    public static boolean isDouble(String input) {
        try {
            Double.parseDouble(input);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // 문자 확인
    public static boolean isCharacter(String input) {
        return input.length() == 1;
    }
}
