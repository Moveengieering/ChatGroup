package com.moveengineering.ChatGroupBE.controller;




import com.moveengineering.ChatGroupBE.model.RoomModel;
import com.moveengineering.ChatGroupBE.repo.RoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
public class WebSocketChatController {

    @Autowired
    RoomRepo roomRepo;

    @MessageMapping("/resume")
    @SendTo("/start/initial")
    public RoomModel chat (String msg) {

        RoomModel m = new RoomModel();
        m.setChatName(msg);
        return roomRepo.save(m);

    }

    }



