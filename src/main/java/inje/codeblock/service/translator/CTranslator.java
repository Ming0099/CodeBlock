package inje.codeblock.service.translator;

import inje.codeblock.domain.Variable;

import java.util.ArrayList;
import java.util.Stack;

public class CTranslator extends TranslatorFunction implements CodeTranslator{
    private StringBuilder code;
    private Stack<Integer> codeDepthStack;
    private Variable variable; // 변수모음
    private boolean isStdioHeader = false;
    private int iteratorDepth;
    private final String[] iteratorSign = {"i","j","k"};

    public CTranslator() {
        code = new StringBuilder();
        codeDepthStack = new Stack<>();
        codeDepthStack.push(0);
        variable = new Variable();
        iteratorDepth = 0;

        // main 함수
        code.append("int main(){\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateVariable(String name, String value) {
        String type = translateType(value);

        // 변수 추가
        variable.addVariable(name, type);

        if (type.equals("char")){ // 문자
            value = "\'" + value + "\'";
        }else if(type.equals("char *")){ // 문자열
            value = "\"" + value + "\"";
        }
        createIndent(getCodeDepth());
        code.append(type).append(" ").append(name).append(" = ").append(value).append(";\n");
    }

    @Override
    public void translateChange(String name, String value) {
        // 꺽쇠 제거
        name = name.substring(1,name.length()-1);

        String type = variable.getTypeByName(name);

        if (type.equals("char")){ // 문자
            value = "\'" + value + "\'";
        }else if(type.equals("char *")){ // 문자열
            value = "\"" + value + "\"";
        }
        createIndent(getCodeDepth());
        code.append(name).append(" = ").append(value).append(";\n");
    }

    @Override
    public void translateChangeOperator(String name, String value1, String operator, String value2) {
        // 꺽쇠 제거
        name = name.substring(1,name.length()-1);

        createIndent(getCodeDepth());
        operator = translateOperatorCondition(operator);

        code.append(name).append(" = ").append(value1).append(" ").append(operator).append(" ").append(value2).append(";\n");
    }

    @Override
    public void translateOperator(String name, String value1, String operator, String value2) {
        createIndent(getCodeDepth());
        operator = translateOperatorCondition(operator);
        String type = translateType(value1);

        // 변수 추가
        variable.addVariable(name, type);

        code.append(type).append(" ").append(name).append(" = ").append(value1).append(" ").append(operator).append(" ").append(value2).append(";\n");
    }

    @Override
    public void translatePrint(String text) {
        // stdio 헤더파일 필요
        isStdioHeader = true;

        createIndent(getCodeDepth());

        // 출력문에 변수가 있을시
        if(text.contains("<") || text.contains(">")){

            ArrayList<String> list = new ArrayList<>();

            String tempStr = "";
            int startPosition = 0;
            boolean isStart = false;

            for(int i=0; i<text.length(); i++){
                if(text.charAt(i) == '>'){
                    text = text.substring(0,startPosition)
                            + typeToPrintString(variable.getTypeByName(tempStr))
                            + text.substring(i+1);
                    i = startPosition + 1;

                    list.add(tempStr);
                    tempStr = "";
                    isStart = false;
                }
                if(isStart){
                    tempStr += text.charAt(i);
                }
                if(text.charAt(i) == '<'){
                    startPosition = i;
                    isStart = true;
                }
            }

            code.append("printf(\"").append(text).append("\"");

            for(int i=0; i<list.size(); i++){
                code.append(", ").append(list.get(i));
            }

            code.append(");\n");
        }
        else{
            code.append("printf(\"").append(text).append("\");\n");
        }
    }

    @Override
    public void translateFor(int count) {
        createIndent(getCodeDepth());

        String sign = getIteratorSignAndRun();

        code.append("for(int ").append(sign).append(" = 0; ").append(sign)
                .append(" < ").append(count).append("; ").append(sign).append("++) {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateWhile(int count) {
        createIndent(getCodeDepth());

        String sign = getIteratorSignAndRun();

        code.append("int ").append(sign).append(" = 0;\n");
        createIndent(getCodeDepth());
        code.append("while(").append(sign).append(" < ").append(count).append(") {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
        createIndent(getCodeDepth());
        code.append(sign).append("++;\n");
    }

    @Override
    public void translateIf(String s1, String condition, String s2) {
        // 조건 변환
        condition = translateCondition(condition);
        createIndent(getCodeDepth());
        
        // 꺽쇠 제거
        s1 = s1.substring(1,s1.length()-1);
        
        code.append("if(").append(s1).append(" ").append(condition).append(" ").append(s2).append(") {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateSwitch(String s1) {
        createIndent(getCodeDepth());

        // 꺽쇠 제거
        s1 = s1.substring(1,s1.length()-1);

        code.append("switch(").append(s1).append(") {\n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateCase(String s1) {
        codeDepthStack.pop();
        createIndent(getCodeDepth());

        String type = translateType(s1);

        if (type.equals("char")){ // 문자
            s1 = "\'" + s1 + "\'";
        }else if(type.equals("char *")){ // 문자열
            s1 = "\"" + s1 + "\"";
        }

        code.append("case ").append(s1).append(": \n");
        codeDepthStack.push(codeDepthStack.peek() + 1);
    }

    @Override
    public void translateBreak() {
        createIndent(getCodeDepth());
        code.append("break; \n");
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

    public String typeToPrintString(String type){
        switch (type){
            case "int":
                return "%d";
            case "double":
                return "%f";
            case "char":
                return "%c";
            case "char *":
                return "%s";
            default:
                return "";
        }
    }

    public void addHeaderFile(){
        StringBuilder headerCode = new StringBuilder();
        if(isStdioHeader){
            headerCode.append("#include<stdio.h>\n");
        }
        if(isStdioHeader){
            headerCode.append("\n");
        }

        code.insert(0, headerCode);
    }

    public String getIteratorSignAndRun(){
        String sign = "";
        if(iteratorDepth > 2){
            sign = "k";
        }else{
            sign = iteratorSign[iteratorDepth];
        }
        iteratorDepth++;

        return sign;
    }

    public void closeIterator(){
        iteratorDepth--;
    }
}
