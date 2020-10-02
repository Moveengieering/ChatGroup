package com.moveengineering.ChatGroupBE.controller;




import com.moveengineering.ChatGroupBE.model.ChatMessage;
import com.moveengineering.ChatGroupBE.model.ChatRoom;

import com.moveengineering.ChatGroupBE.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import javax.websocket.server.PathParam;
import java.util.List;


@Controller
public class ChatController {
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private ChatRoomService chatRoomService;

    //create new Chat Room
    @MessageMapping("/chatRoom")
    @SendTo("/start/initial")
    public ChatRoom createNewChatRoom(String userName) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatName(userName);
        chatRoomService.saveChatRoom(chatRoom);
        return chatRoom;
    }


    //create New Message
    @MessageMapping("/chatRoom/{id}")
    @SendTo("/start/initial")
    public ChatRoom createNewMessage(@PathParam("id") String idChatRoom, String message) {
        // find the chatRoomById
        ChatRoom chatRoom = chatRoomService.findChatRoomById(idChatRoom);
        ChatMessage chatMsg = new ChatMessage();

        chatMsg.setContent(message);
        chatMsg.setSenderName(chatRoom.getChatName());// vendos senderName userin qe ka krjuar chatin te cilin e kam ruajtur edhe si chatname

        chatRoom.getMessages().add(chatMsg);// shtoj messazhin e ri tek lista  e messazhve te chatRoom
        chatRoomService.updateChatRoom(chatRoom);// bej save modifikimin e chatRoom
        return chatRoom;
    }

    @MessageMapping("/updateMsg/{idChatRoom}")
    @SendTo("/start/initial")
    public ChatRoom updateMessage(@PathParam("idChatRoom") String idChatRoom, ChatMessage chatMessage) {
        // find the chatRoomById
        ChatRoom chatRoom = chatRoomService.findChatRoomById(idChatRoom);
        chatRoom.getMessages().forEach(messageofChatRoom -> {
            if (messageofChatRoom.getId().equals(chatMessage.getId())) {
                messageofChatRoom.setContent(chatMessage.getContent());// modifikoj msg
            }
        });
        chatRoomService.updateChatRoom(chatRoom); // bej update te gjithe chatroom
        return chatRoom;

    }

    @MessageMapping("/allChatRooms")
    @SendTo("/start/initial")
    public List<ChatRoom> getAllChatRooms() {
        return chatRoomService.findAllChatRooms();// gjej te gjitha chatRoom
    }

    @MessageMapping("/chatRooms")
    @SendTo("/start/initial")
    public List<ChatRoom> getAllOtherChatRooms(String userName) {
        return chatRoomService.findOtherChatRooms(userName);// gjej chatRoom-et e tjere
    }
}

