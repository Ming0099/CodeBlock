package inje.codeblock.service.translator;

public class TranslatorFunction {
    // 타입 변환
    public static String translateType(String value){
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
        return type;
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

    // 조건 변환 (작다) -> (<)
    public static String translateCondition(String con){
        String condition = "";
        switch (con){
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
        return condition;
    }
}
