package com.moveengineering.BE.repository;

import com.moveengineering.BE.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<ChatRoom, String>{


    ChatRoom findChatRoomByChatNameEquals(String chatName);
    ChatRoom findChatRoomById(String id);
}
