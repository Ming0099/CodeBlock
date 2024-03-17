package inje.codeblock.service.translator;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CTranslatorTest {
    @Test
    void 프린트_반복문_조건문_테스트() {
        CTranslator c = new CTranslator();

        c.translatePrint("hello world!");

        c.translateFor(5);

        c.translatePrint("5번 반복 for");

        c.translateIf("a", "b", ">");

        c.translatePrint("if 텍스트");

        c.closeBrace(); // '}' 닫기

        c.closeBrace(); // '}' 닫기

        c.translateWhile(4);

        c.translatePrint("4번 반복 while");

        c.closeBrace(); // '}' 닫기

        System.out.println(c.getTranslatedCode());
    }
}