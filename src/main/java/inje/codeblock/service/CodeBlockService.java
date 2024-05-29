package inje.codeblock.service;

import inje.codeblock.controller.CodeBlockForm;
import inje.codeblock.domain.CodeBlock;
import inje.codeblock.service.translator.CTranslator;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CodeBlockService {
    private final String IF = "IF";
    private final String PRINT = "PRINT";
    private final String VARIABLE = "VARIABLE";
    private final String FOR = "FOR";
    private final String WHILE = "WHILE";
    private final String VARIABLE_OPERATOR = "VARIABLE_OPERATOR";
    private final String SWITCH = "SWITCH";
    private final String CASE = "CASE";

    public String translate(CodeBlock codeBlock){
        System.out.println(codeBlock);

        // content 읽어오기
        for(int i=0; i< codeBlock.getContentSize();i++){
            System.out.println("content" + i + " : " + codeBlock.getContentById(i));
        }

        // child 읽어오기
        for(int i=0; i<codeBlock.getChildSize(); i++){
            System.out.print("child" + i + " : ");
            for(String str : codeBlock.getChildById(i)){
                System.out.print(str + " ");
            }
            System.out.println();
        }


        // c언어로 번역
        CTranslator cTranslator = new CTranslator();

        // 이전 SWITCH 블록을 저장하기 위한 변수 (SWITCH | /SWITCH | CASE)
        String currentSwitchBlock = "";

        int j = 0;
        for(int i=0; i<codeBlock.getContentSize(); i++){
            switch (codeBlock.getContentById(i)){
                case IF:
                    cTranslator.translateIf(codeBlock.getChildById(j)[0],codeBlock.getChildById(j)[2],codeBlock.getChildById(j)[1]);
                    break;
                case PRINT:
                    cTranslator.translatePrint(codeBlock.getChildById(j)[0]);
                    break;
                case VARIABLE:
                    cTranslator.translateVariable(codeBlock.getChildById(j)[0],codeBlock.getChildById(j)[1]);
                    break;
                case FOR:
                    cTranslator.translateFor(Integer.parseInt(codeBlock.getChildById(j)[0]));
                    break;
                case WHILE:
                    cTranslator.translateWhile(Integer.parseInt(codeBlock.getChildById(j)[0]));
                    break;
                case VARIABLE_OPERATOR:
                    cTranslator.translateOperator(codeBlock.getChildById(j)[0],codeBlock.getChildById(j)[1],codeBlock.getChildById(j)[2],codeBlock.getChildById(j)[3]);
                    break;
                case SWITCH:
                    cTranslator.translateSwitch(codeBlock.getChildById(j)[0]);
                    break;
                case CASE:
                    if(currentSwitchBlock.contains("CASE") || currentSwitchBlock.contains("/SWITCH")){ // 이전 SWITCH 블록이 CASE 또는 /SWITCH 라면
                        cTranslator.translateBreak(); // BREAK 블록 추가
                    }
                    cTranslator.translateCase(codeBlock.getChildById(j)[0]);
                    break;
            }

            // 현재 블록이 /SWITCH 이고 이전 블록이 CASE 라면 BREAK 블록 추가
            if(codeBlock.getContentById(i).contains("/SWITCH")){
                if(currentSwitchBlock.contains("CASE")){
                    cTranslator.translateBreak();
                }
            }

            if(codeBlock.getContentById(i).contains("/")){
                cTranslator.closeBrace();
            }else{
                j++;
            }

            // 이전 SWITCH 블록이 무엇인지 저장 (SWITCH | /SWITCH | CASE)
            if(codeBlock.getContentById(i).contains("SWITCH") || codeBlock.getContentById(i).contains("CASE")){
                currentSwitchBlock = codeBlock.getContentById(i);
            }
        }


        System.out.println(cTranslator.getTranslatedCode());
        return cTranslator.getTranslatedCode();
    }

}
