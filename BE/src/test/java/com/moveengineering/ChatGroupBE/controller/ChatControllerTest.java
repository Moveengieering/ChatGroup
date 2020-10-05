package com.moveengineering.ChatGroupBE.controller;

import com.moveengineering.ChatGroupBE.model.ChatRoom;
import com.moveengineering.ChatGroupBE.service.ChatRoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ChatControllerTest {

    ChatController chatController = new ChatController();

    ChatRoomService chatRoomService = new ChatRoomService();

    @Test
    void getAllChatRooms() throws  Exception {
        List<ChatRoom> result = chatRoomService.findAllChatRooms();
        System.out.println(result.size());

    }
}