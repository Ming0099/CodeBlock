package inje.codeblock.service;

import inje.codeblock.controller.CodeBlockForm;
import inje.codeblock.domain.CodeBlock;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CodeBlockService {

    public String translate(CodeBlock codeBlock){

        // content 읽어오기
        for(int i=0; i< codeBlock.getContentSize();i++){
            int finalI = i;
            codeBlock.getContentById(i).ifPresent(content ->{

                System.out.println("content" + finalI + " : " + content);

            });
        }

        // child 읽어오기
        for(int i=0; i<codeBlock.getChildSize(); i++){
            System.out.print("child" + i + " : ");
            codeBlock.getChildById(i).ifPresent(child ->{

                for(String str : child){
                    System.out.print(str + " ");
                }

            });
            System.out.println();
        }


        return "a";
    }

}
