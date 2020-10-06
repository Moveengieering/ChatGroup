import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../domain/chatMessage';
import { ChatRoom } from '../domain/chatRomm';
import { ChatService } from '../services/chat/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit{
  constructor(private chatService: ChatService) {}

  @Input() currentUser: string;
  @Input() usersList: string[];

  existChatRoomWithThisName: boolean = false;

  allChatRooms: ChatRoom[];
  otherChatRooms: ChatRoom[];
  currentRoom: ChatRoom;
  messages: ChatMessage[];
  newMessage: string; // take the text of the mesage

  newChatRoom: string = null;

  ngOnInit() {
    this.getAllChatRooms();
    this.messages = [];
    this.newMessage = null;
    this.newChatRoom = null;
    this.existChatRoomWithThisName = false;

    this.connectToGeneralChatRoom();
  
    
  }


  getAllChatRooms() {
    this.chatService.getChatRoomList().subscribe((chats) => {
      this.allChatRooms = chats;
    });

    console.log('ChatComponent.allCatRooms:', this.allChatRooms);
  }

  connectToGeneralChatRoom() {
    let existGeneralChatRoom: boolean = false;
    this.chatService.getChatRoomByChatName('General').subscribe((chatRoomG) => {
      console.log('chatRoomGeneral:', chatRoomG);
      if (chatRoomG !== null) {
        existGeneralChatRoom = true;
        console.log('existGeneralChatRoom:', existGeneralChatRoom);
        this.currentRoom = {
          id: chatRoomG.id,
          chatName: chatRoomG.chatName,
          messages: chatRoomG.messages
        };
        this.getAllMessagesOfTheChatRoom();
        console.log('currentRoomExist:', this.currentRoom);
      }
    });
    if (!!existGeneralChatRoom) {
      this.chatService.createNewChatRoom('General').subscribe((chatRoom) => {
        console.log('chatRoom:', chatRoom);
        this.currentRoom = {
          id: chatRoom.id,
          chatName: chatRoom.chatName,
          messages: chatRoom.messages
        };
        this.getAllMessagesOfTheChatRoom();
      });
    }
    console.log('currentRoom:', this.currentRoom);

    this.getAllMessagesOfTheChatRoom();
    console.log('this.messages:', this.messages);
    // this.currentRoom.usersRoom.push(this.currentUser);
  }

  sendMessage() {
    console.log('this.newMessage:', this.newMessage);
    if (this.newMessage !== null) {
      console.log('senderofMessage:', this.currentUser);
      let chatMsg: ChatMessage = {
        id: null,
        senderName: this.currentUser,
        content: this.newMessage,
        filePath: null,
        timestamp: null,
      };
      this.chatService
        .createNewMessage(this.currentRoom.id, chatMsg)
        .subscribe((chatMessage) => {
          // bej bind cfar me kthen socket
          let messagRecive: ChatMessage = {
            id: chatMessage.id,
            senderName: chatMessage.senderName,
            content: chatMessage.content,
            timestamp: chatMessage.timestamp,
            filePath: chatMessage.filePath,
          };
          console.log(messagRecive);
          if(!this.currentRoom.messages){
            this.currentRoom.messages = [];
          }
          this.currentRoom.messages.push(messagRecive);
          this.getAllMessagesOfTheChatRoom();
        });
    }
    this.newMessage = null;
  }

  getAllMessagesOfTheChatRoom() {
    this.messages = this.currentRoom.messages;
  }

  joinToSelectedRoom(idroom: string) {
    this.chatService.getChatRoomById(idroom).subscribe((room) => {
      this.currentRoom = {
        id: room.id,
        chatName: room.chatName,
        messages: room.messages
      };
      this.getAllMessagesOfTheChatRoom();
    });
  }

  createnewChatRoom() {
    if (this.newChatRoom) {
      this.existChatRoomWithThisName = false;
      console.log("this.allChatRooms:", this.allChatRooms);
      if(this.allChatRooms){
        this.allChatRooms.forEach((chatRoom) => {
          if (chatRoom.chatName === this.newChatRoom) {
            this.existChatRoomWithThisName = true;
          }
        });

      }

      if (!this.existChatRoomWithThisName) {
        console.log('ctrlChatRoom is null:');
        this.existChatRoomWithThisName = false;
        this.chatService
          .createNewChatRoom(this.newChatRoom)
          .subscribe((chatR) => {
            console.log('chatR:', chatR);
            if (chatR !== null) {
              let newChat: ChatRoom = {
                id: chatR.id,
                chatName: chatR.chatName,
                messages: chatR.messages
              };
              this.allChatRooms.push(newChat);
              this.getAllMessagesOfTheChatRoom();
              console.log('currentRoom:', this.currentRoom);
            }
          });
      }
    }
  }
}
