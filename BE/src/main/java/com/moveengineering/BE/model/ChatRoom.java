package com.moveengineering.BE.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
public class ChatRoom {

    @Id
    private String id;
    private String chatName;
    private List<Message> messages = new ArrayList<>();

    public ChatRoom() {
    }

    public ChatRoom(String id, String chatName, List<Message> messages) {
        this.id = id;
        this.chatName = chatName;
        this.messages = messages;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}
