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
    private final String OPERATOR = "OPERATOR";
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

        boolean isBreak = false;

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
                case OPERATOR:
                    cTranslator.translateOperator(codeBlock.getChildById(j)[0],codeBlock.getChildById(j)[1],codeBlock.getChildById(j)[2],codeBlock.getChildById(j)[3]);
                    break;
                case SWITCH:
                    cTranslator.translateSwitch(codeBlock.getChildById(j)[0]);
                    break;
                case CASE:
                    if(!isBreak){
                        isBreak = true;
                    }else{
                        cTranslator.translateBreak();
                    }
                    cTranslator.translateCase(codeBlock.getChildById(j)[0]);
                    break;
            }

            if(codeBlock.getContentById(i).contains("/")){
                if(codeBlock.getContentById(i).contains("SWITCH")){
                    cTranslator.translateBreak();
                    isBreak = false;
                }
                cTranslator.closeBrace();
            }else{
                j++;
            }
        }


        System.out.println(cTranslator.getTranslatedCode());
        return cTranslator.getTranslatedCode();
    }

}
