package com.moveengineering.BE.model;

import com.mongodb.lang.Nullable;

import java.util.Date;
import java.util.UUID;

public class Message {

    private UUID id;
    private String content;
    @Nullable
    private String filePath;
    private String senderName;
    private Date timestamp = new Date();

    public Message() {
        this.id = UUID.randomUUID();
    }


    public Message(UUID id, String content, @Nullable String filePath, String senderName, Date timestamp) {
        this.id = id;
        this.content = content;
        this.filePath = filePath;
        this.senderName = senderName;
        this.timestamp = timestamp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Nullable
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(@Nullable String filePath) {
        this.filePath = filePath;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }


    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp( Date timestamp) {
        this.timestamp = timestamp;
    }
}
