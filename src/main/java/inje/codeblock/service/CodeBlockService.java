package inje.codeblock.service;

import inje.codeblock.controller.CodeBlockForm;
import inje.codeblock.domain.CodeBlock;
import inje.codeblock.service.translator.CTranslator;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CodeBlockService {
    private final String IF = "만약";
    private final String PRINT = "표시";
    private final String VARIABLE = "변수";

    public String translate(CodeBlock codeBlock){

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

        int j = 0;
        for(int i=0; i<codeBlock.getContentSize(); i++){
            switch (codeBlock.getContentById(i)){
                case IF:
                    cTranslator.translateIf(codeBlock.getChildById(j)[0],codeBlock.getChildById(j)[1],codeBlock.getChildById(j)[2]);
                    break;
                case PRINT:
                    cTranslator.translatePrint(codeBlock.getChildById(j)[0]);
                    break;
                case VARIABLE:
                    cTranslator.translateVariable(codeBlock.getChildById(j)[0],codeBlock.getChildById(j)[1]);
            }

            if(codeBlock.getContentById(i).contains("/")){
                cTranslator.closeBrace();
            }else{
                j++;
            }
        }


        System.out.println(cTranslator.getTranslatedCode());
        return cTranslator.getTranslatedCode();
    }

}
