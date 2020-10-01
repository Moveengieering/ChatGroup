package com.moveengineering.ChatGroupBE.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatModel {

    private UUID id;
    private String content;
    private String filePath;
    private String senderName;
    private Date timestamp = new Date();






}

