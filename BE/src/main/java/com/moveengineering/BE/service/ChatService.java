package com.moveengineering.BE.service;


import com.moveengineering.BE.model.ChatRoom;
import com.moveengineering.BE.repository.RoomRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private RoomRepository repository;

    private Path fileStoragePath;

    //1- Krijo nje ChatRoom
    public ChatRoom createRoom(ChatRoom room){
        return repository.save(room);
    }

    //2- Gjej ChatRoom sipas emrit
    public ChatRoom findChatRoomByChatName(String roomName) {
       return  repository.findChatRoomByChatNameEquals(roomName);
    }

    //3- Marr te gjithe chatroom qe ekzistojne
    public List<ChatRoom> findAllChatRooms(){
        return repository.findAll();
    }

    //4- Gjej nje room sipas nje id te caktuar
    public ChatRoom findChatRoomById(String roomId) {
        return repository.findChatRoomById(roomId);
    }

    //4- Ben update room
    public void udateChatRoom(ChatRoom chatRoom) {
        repository.save(chatRoom);
    }

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        Path filePath = Paths.get(fileStoragePath + "\\" + fileName);

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Issue in storing the file", e);
        }
        return fileName;
    }





}


