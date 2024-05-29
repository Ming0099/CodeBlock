package inje.codeblock.domain;

import java.util.HashMap;
import java.util.Map;

public class Variable {
    private Map<String,String> variableList;

    //생성자
    public Variable() {
        variableList = new HashMap<String,String>();
    }

    // 변수 추가
    public void addVariable(String name, String type){ // 변수명, 자료
        variableList.put(name,type);
    }

    // 변수 삭제
    public void removeByName(String name){
        variableList.remove(name);
    }

    // 이름으로 변수 자료형 찾기
    public String getTypeByName(String name){
        if(variableList.containsKey(name)){
            return variableList.get(name);
        }
        return "";
    }

    public void clear(){
        variableList.clear();
    }

    // 모든 변수 출력
    public void printVariable(){
        for(String i : variableList.keySet()){ //저장된 key값 확인
            System.out.println("[변수명]:" + i + " [자료형]:" + variableList.get(i));
        }
    }

    public int getSize(){
        return variableList.size();
    }
}
