package inje.codeblock.service.translator;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CTranslatorTest {
    @Test
    void 프린트_반복문_조건문_테스트() {
        CTranslator c = new CTranslator();

        c.translateVariable("ABC","10.5");

        c.translatePrint("hello world!");

        c.translateFor(5);

        c.translatePrint("5번 반복 for");

        c.translateIf("a", "작을때", "b");

        c.translatePrint("hello world!");

        c.closeBrace(); // '}' 닫기

        c.closeBrace(); // '}' 닫기

        c.translateWhile(4);

        c.translatePrint("hello world!");

        c.closeBrace(); // '}' 닫기

        System.out.println(c.getTranslatedCode());
    }

    @Test
    void isInteger() {
        System.out.println(CTranslator.isInteger("10"));
        System.out.println(CTranslator.isInteger("1.1"));
        System.out.println(CTranslator.isInteger("a"));
        System.out.println(CTranslator.isInteger("abcde"));
    }

    @Test
    void isDouble() {
        System.out.println(CTranslator.isDouble("1.1"));
        System.out.println(CTranslator.isDouble("a"));
        System.out.println(CTranslator.isDouble("abcde"));
    }

    @Test
    void isCharacter() {
        System.out.println(CTranslator.isCharacter("10"));
        System.out.println(CTranslator.isCharacter("1.1"));
        System.out.println(CTranslator.isCharacter("a"));
        System.out.println(CTranslator.isCharacter("abcde"));
    }
}