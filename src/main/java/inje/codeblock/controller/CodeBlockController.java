package inje.codeblock.controller;

import inje.codeblock.domain.CodeBlock;
import inje.codeblock.service.CodeBlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.stream.IntStream;

@Controller
public class CodeBlockController {

    private final CodeBlockService codeBlockService;

    @Autowired
    public CodeBlockController(CodeBlockService codeBlockService){
        this.codeBlockService = codeBlockService;
    }

    @PostMapping("/send_data")
    @ResponseBody
    public String solve_content(@RequestBody CodeBlockForm form){

        String code_content = form.getCode_content();
        String[][] total_arr = form.getChild_code();

        CodeBlock codeBlock = new CodeBlock();
        codeBlock.create();

        // 첫번째 배열(빈칸) 제거
        code_content = code_content.substring(1);
        String[] content = code_content.split(" ");

        // content 추가
        for(String str : content){
            codeBlock.addContent(str);
        }

        // child 추가
        for(String[] strArray : total_arr){
            // null 제거
            String[] newArray = IntStream.range(0, strArray.length)
                    .filter(idx -> idx != 0)
                    .mapToObj(idx -> strArray[idx])
                    .toArray(String[]::new);
            codeBlock.addChild(newArray);
        }

        // 코드 생성 후 리턴
        return codeBlockService.translate(codeBlock);
    }
}
