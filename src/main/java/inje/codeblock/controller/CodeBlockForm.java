package inje.codeblock.controller;

public class CodeBlockForm {
    private String code_content;
    private String[][] child_code;

    public String[][] getChild_code() {
        return child_code;
    }

    public void setChild_code(String[][] child_code) {
        this.child_code = child_code;
    }

    public String getCode_content() {
        return code_content;
    }

    public void setCode_content(String code_content) {
        this.code_content = code_content;
    }
}
