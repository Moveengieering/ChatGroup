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
        return chatRoomRepository.findChatRoomById(idChatRoom);
    }


    public void updateChatRoom(ChatRoom chatRoom) {

        chatRoomRepository.save(chatRoom);
    }

    public List<ChatRoom> findAllChatRooms() {
        return chatRoomRepository.findAll();
    }

    public List<ChatRoom> findOtherChatRooms(String userName) {
        return chatRoomRepository.findByChatNameNotLike(userName);
    }

    public ChatRoom findChatRoomByChatName(String userName) {
        ChatRoom result = null;
        try{
            List<ChatRoom> list = chatRoomRepository.findByChatNameEquals(userName);
            if(list != null && list.size() > 0){
                result = list.get(0);
            }
        }catch(Exception e){
           System.out.println(e);
        }
        return result;
    }
}