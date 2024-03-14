package inje.codeblock.domain;

import java.util.ArrayList;
import java.util.Optional;

public class CodeBlock {
    private ArrayList<String> content;
    private ArrayList<String[]> child;

    public void create(){
        content = new ArrayList<String>();
        child = new ArrayList<String[]>();
    }

    public ArrayList<String> getContent() {
        return content;
    }

    public Optional<String> getContentById(int id){
        return Optional.ofNullable(content.get(id));
    }

    public void setContent(ArrayList<String> content) {
        this.content = content;
    }

    public void addContent(String content){
        this.content.add(content);
    }

    public int getContentSize(){
        return content.size();
    }

    public ArrayList<String[]> getChild() {
        return child;
    }

    public void setChild(ArrayList<String[]> child) {
        this.child = child;
    }

    public Optional<String[]> getChildById(int id){
        return Optional.ofNullable(child.get(id));
    }

    public void addChild(String[] child){
        this.child.add(child);
    }

    public int getChildSize(){
        return child.size();
    }
}
