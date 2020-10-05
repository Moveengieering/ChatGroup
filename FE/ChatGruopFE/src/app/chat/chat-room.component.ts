import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../domain/chatMessage';
import { ChatRoom } from '../domain/chatRomm';
import { ChatService } from '../services/chat/chat.service';
import {SocketClientService} from '../services/websocket/socket-client.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  constructor(private chatService: ChatService) {
  }

  userName: string;
  userIsJoined: boolean;
  existChatRoomWithThisName: boolean = false;

  allChatRooms: ChatRoom[];
  otherChatRooms: ChatRoom[];
  currentRoom : ChatRoom;
  messages: ChatMessage[];
  newMessage: string;// take the text of the mesage

  ngOnInit() {
    this.userIsJoined = false;
    this.userName = null;
    this.currentRoom = null;
    this.messages = null;
    this.newMessage = null;
   this.existChatRoomWithThisName = false;
   this.getAllChatRooms();

  }

  getAllChatRooms(){
    this.chatService.getChatRoomList().subscribe(chats =>{
    this.allChatRooms = chats;
    });

    console.log("ChatComponent.allCatRooms:", this.allChatRooms);
  }

  createNewChatRoom(){
    console.log("createNewChatRoom:", this.currentRoom);
    this.existChatRoomWithThisName = false;
    if(this.userName){
      this.allChatRooms.forEach(chatRoom => {
        if(chatRoom.chatName === this.userName ){
          this.existChatRoomWithThisName = true;
        }
      });
      console.log("currentRoom:", this.currentRoom);
      if(!this.existChatRoomWithThisName){
        console.log("ctrlChatRoom is null:");
        this.existChatRoomWithThisName = false;
        this.chatService.createNewChatRoom(this.userName).subscribe(chatR =>{
          console.log("chatR:", chatR);
          if(chatR !== null){
            this.currentRoom = chatR;
            console.log("currentRoom:", this.currentRoom);
          }
          
        });

        this.getAllChatRooms();
        this.userIsJoined = true;

      }else{
        // this.existChatRoomWithThisName = true;
        this.userIsJoined = false;
        this.userName = null;
      }
        
    }
  }

 
  sendMessage(){
    console.log("this.newMessage:", this.newMessage);
    if(this.newMessage !== null ){
      this.chatService.createNewMessage(this.currentRoom.id, this.newMessage);
      // this.currentRoom.messages.push(msg);
    }
    this.getAllMessagesOfTheChatRoom();
    this.newMessage = null;
  }

  getAllMessagesOfTheChatRoom(){
    this.messages = this.currentRoom.messages;
  }





  getOtherChatRoom(){
    if(this.userName){
      this.chatService.getOthersChatRoomsList(this.userName).subscribe(chatO =>{
        this.otherChatRooms = chatO;
      });
    }
  

  }


}
