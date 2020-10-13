package com.moveengineering.BE.controller;

import com.moveengineering.BE.model.ChatRoom;
import com.moveengineering.BE.model.FileUploadDTO;
import com.moveengineering.BE.model.Message;
import com.moveengineering.BE.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    ChatService service;
    @Autowired
    SimpMessagingTemplate template;

    private final Path rootLocation = Paths.get("fileStorage");

    //1- Gjej Listen e Room
    @GetMapping("/chatRoom/get")
    public List<ChatRoom> getAllChatRooms() {
        return service.findAllChatRooms();
    }

    //2- Krijo nje mesazh e ruan ne databaze dhe e ben push ne socket
    @PostMapping("/message/{id}")
    public Message saveAndPushToSocket(@PathVariable("id") String roomId,
                                       @RequestBody Message message
                                       //,@RequestParam("file") MultipartFile file
    ) throws Exception {
        ChatRoom chatRoom = service.findChatRoomById(roomId);

        List<Message> messages = chatRoom.getMessages();
        // nqs e kam modifikuar nje msg
        if (message.getId() != null) {
            for (Message msgOfChatroom : messages) {
                if (msgOfChatroom.getId().equals(message.getId())) {
                    msgOfChatroom.setContent(message.getContent());
                    break;
                }
            }

        } else {
            // nqs kam shtuar nje msg te ri
            message.setId(UUID.randomUUID());
            message.setTimestamp(new Date());
            // upload file
           /* if(!file.isEmpty()){
                Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));
                String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/download/")
                        .path(file.getOriginalFilename())
                        .toUriString();
                message.setFilePath(url );
            }*/
            messages.add(message);
        }

        chatRoom.setMessages(messages);

        service.udateChatRoom(chatRoom);
        this.template.convertAndSend("/topic/message", message);
        return message;

    }

    //3 - Gjej nje room ne duke i dhene id si path variabel
    @GetMapping("/chatRoom/{id}")
    public ChatRoom findChatRoomById(@PathVariable("id") String idChatRoom) {
        return service.findChatRoomById(idChatRoom);
    }

    //4 - Krijoj nje rooom te ri
    @PutMapping("/chatRoom")
    public ChatRoom createAndPushNewChatRoomToSocket(@RequestBody ChatRoom chatRoom) {
        service.createRoom(chatRoom);
        this.template.convertAndSend("/topic/rooms", chatRoom);
        return chatRoom;
    }



}



