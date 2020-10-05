package com.moveengineering.ChatGroupBE.controller;


import com.moveengineering.ChatGroupBE.model.ChatMessage;
import com.moveengineering.ChatGroupBE.model.ChatRoom;

import com.moveengineering.ChatGroupBE.service.ChatRoomService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import javax.websocket.server.PathParam;
import java.util.ArrayList;
import java.util.List;


@Controller
public class ChatController {
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private ChatRoomService chatRoomService;

 /*   @MessageMapping("/guestchat")
    @SendTo("/topic/guestchats")
    public ChatRoom handleMessaging(ChatRoom chatRoom) throws Exception{
        Thread.sleep(1000);
        return new ChatRoom(chatRoom.getId(), chatRoom.getChatName(), null);

    }*/

    @SubscribeMapping("/chat/get")
    public List<ChatRoom> getAllChatRooms() throws Exception {
        List<ChatRoom> result = new ArrayList<>();
        result = chatRoomService.findAllChatRooms();
        System.out.println(result.size());
        return result;// gjej te gjitha chatRoom
    }

    @SubscribeMapping("/otherchat/{userName}/get")
   // @SendTo("/topic/chat/get")
    public List<ChatRoom> getAllOtherChatRooms(@DestinationVariable String userName) throws Exception{
      //  return chatRoomService.findAllChatRooms();
      return chatRoomService.findOtherChatRooms(userName);// gjej chatRoom-et e tjere

    }

    @SubscribeMapping("/chat/{userName}/get")
    public ChatRoom findChatRoomByChatName(@DestinationVariable String userName) {
        ChatRoom chatRoom = null;
        try {
            chatRoom = chatRoomService.findChatRoomByChatName(userName);
        }catch (Exception e){
            e.printStackTrace();
        }
        return chatRoom;
    }
    //create new Chat Room
    @MessageMapping("/createChat/{userName}")
    @SendTo("/topic/chat/get")
    public ChatRoom createNewChatRoom(@DestinationVariable String userName) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatName(userName);
        chatRoomService.saveChatRoom(chatRoom);
        return chatRoom;
    }


    //create New Message
    @MessageMapping("/createMessage/{idChatRoom}")
    @SendTo("/topic/chat/get")
    public ChatRoom createNewMessage(@DestinationVariable String idChatRoom, String message) throws Exception{
        // find the chatRoomById
        ChatRoom chatRoom = chatRoomService.findChatRoomById(idChatRoom);
        ChatMessage chatMsg = new ChatMessage();

        chatMsg.setContent(message);
        chatMsg.setSenderName(chatRoom.getChatName());// vendos senderName userin qe ka krjuar chatin te cilin e kam ruajtur edhe si chatname

        List<ChatMessage> messages = chatRoom.getMessages();
        if(messages == null){
            messages = new ArrayList<ChatMessage>();
        }
        messages.add(chatMsg);

        chatRoom.setMessages(messages);// shtoj messazhin e ri tek lista  e messazhve te chatRoom
        chatRoomService.updateChatRoom(chatRoom);// bej save modifikimin e chatRoom
        return chatRoom;
    }

    @MessageMapping("/updateMessage/{idChatRoom}")
    @SendTo("/start/initial")
    public ChatRoom updateMessage(@DestinationVariable String idChatRoom, ChatMessage chatMessage) {
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


}

