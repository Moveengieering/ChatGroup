package com.moveengineering.ChatGroupBE.service;

import com.moveengineering.ChatGroupBE.model.ChatRoom;
import com.moveengineering.ChatGroupBE.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;


    public void saveChatRoom(ChatRoom chatRoom) {
        chatRoomRepository.insert(chatRoom);
    }

    public ChatRoom findChatRoomById(String idChatRoom) {
        return findChatRoomById(idChatRoom);
    }


    public void updateChatRoom(ChatRoom chatRoom) {
        chatRoomRepository.save(chatRoom);
    }

    public List<ChatRoom> findAllChatRooms() {
        return chatRoomRepository.findAll();
    }

    public List<ChatRoom> findOtherChatRooms(String userName) {
        return chatRoomRepository.findBychatNameNotLike(userName);
    }
}