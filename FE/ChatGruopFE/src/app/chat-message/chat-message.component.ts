import { Component, Input, OnInit } from '@angular/core';
import { ChatRoom } from '../domain/chatRomm';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  
@Input() userName: string;
allChatRooms: ChatRoom[];
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.getAllChatRooms();
  }

  getAllChatRooms(){
    this.chatService.getChatRoomList().subscribe(chats =>{
      this.allChatRooms = chats;
    });

    console.log("ChatComponent.allCatRooms:", this.allChatRooms);
  }

}
