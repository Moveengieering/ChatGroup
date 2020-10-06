package com.moveengineering.ChatGroupBE.repository;


import com.moveengineering.ChatGroupBE.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    //Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);

    List<ChatRoom> findByChatNameNotLike(String userName);


    List<ChatRoom> findByChatNameEquals(String userName);
    ChatRoom findChatRoomById(String id);
}
