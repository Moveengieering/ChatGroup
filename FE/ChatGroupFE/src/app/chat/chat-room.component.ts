import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from '../domain/ChatMessage';
import {ChatService} from '../services/chat/chat.service';
import {SocketClientService} from '../services/socket/socket-client.service';
import {ChatRoom} from '../domain/ChatRoom';
import {FileUploadData} from '../domain/FileUploadData';
import { fileURLToPath } from 'url';

import { url } from 'inspector';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  @Input() currentUser;
  public imageSrc: string;
  public formData = new FormData();
  public selectedFile: File = null;

  currentRoom: ChatRoom;
  allChatRooms: ChatRoom[];
  messages: ChatMessage[];
  newMessage: string = null;
  existChatRoomWithThisName: boolean =false;
  newChatRoom: string = null;
  urlPath = null;
  modifyMessage = null;
  

  constructor(private chatService: ChatService,
              private socketService: SocketClientService) { }

  ngOnInit(): void {
    this.listen();
    this.listenRooms();

    this.messages = [];
    this.currentRoom = null;
    this.newMessage = null;
    this.existChatRoomWithThisName = false;
    this.newChatRoom = null;
    this.modifyMessage = null;
    this.selectedFile = null;

    this.getAllChatRooms();
  }


  onSelectFile(event) {
    this.selectedFile = event.target.files[event.target.files.length - 1] as File;
}

performUpload(message: ChatMessage) {
    this.formData.set('file', this.selectedFile, this.selectedFile.name);
    this.chatService.uploadImage(this.formData).subscribe(
            res => {
            this.imageSrc = res;
            this.sendMessage();
            
  }
);
}








  //Marr Te Gjitha Room
  getAllChatRooms(){
    this.chatService.getChatRoomList().subscribe((chats) =>{
      this.allChatRooms =chats;
      this.connectToGeneralRoom();
    });
  }

  //Marr Room kryesor
  connectToGeneralRoom(){
    this.currentRoom = this.allChatRooms.find(chatRoom => chatRoom.chatName === 'General');
    this.getAllMessagesOfCurrentRoom();

  }

  sendMessage(){
    console.log("msg:", this.newMessage);
    if(this.newMessage !== null || this.selectedFile !== null){
      const msg = this.buildMessageObj();
      console.log("msg", msg);
      
      let fd = new FormData();
      if(this.selectedFile !== null){
        console.log("selectedFile:", this.selectedFile);
        fd.append('file', this.selectedFile);
      }
      console.log('formData:', fd.get('file'));

      this.chatService.saveMessage(this.currentRoom.id,msg,fd)
        .subscribe(value => {
          this.newMessage = null;// nqs kam shtuar nje msg te ri
          this.modifyMessage = null;// nqs jemi duke modifikuar nje msg
          this.selectedFile = null;// upload msg
        });
    }

  }

  initModifyMessage(message: ChatMessage){
    if(message.senderName === this.currentUser){
      this.newMessage = message.content;
      this.modifyMessage = message;
      console.log("modifyedMessage", this.modifyMessage);
    }
  }

  //Marr Listen e Mesazheve
  getAllMessagesOfCurrentRoom(){
    console.log(this.currentRoom.messages);
    this.messages = this.currentRoom.messages;
  }

  joinToSelectedRoom(roomId: string){
    this.chatService.getChatRoomById(roomId).subscribe((room) =>{
      this.currentRoom = room;
      this.getAllMessagesOfCurrentRoom();
    })
  }

  //Krijon nje objekt te tipit ChatMessage dhe i jep vlera
  private buildMessageObj(){
    let chatMsg: ChatMessage = null;
    if(this.modifyMessage !== null){
      // nqs jam duke e modifikuar ndryshoj vetem contentin e msg
      chatMsg= {
        id: this.modifyMessage.id,
        senderName: this.modifyMessage.senderName,
        content: this.newMessage,
        filePath: this.modifyMessage.filePath,
        timestamp: this.modifyMessage.timeStamp
      };
    }else{ // nqs jemi duke shk nje msg te ri
      chatMsg = {
        id: null,
        senderName: this.currentUser,
        content: this.newMessage,
        filePath: this.imageSrc,
        timestamp: null
      };
    }
    return chatMsg;
  }

  private listen(){
    this.socketService.messageSubject.subscribe(chatmessage =>{
      console.log('listen', chatmessage);
      let existMsg = this.currentRoom.messages.find(value => value.id === chatmessage.id);
      if(existMsg){// ne rastin kur socket na kthen nje msg qe ka ekzistuar po eshte modifikuar atehere duhet edhe ta updetoj ne currentRoom
        const indexdMsg = this.currentRoom.messages.findIndex(value => value.id === chatmessage.id);
        this.currentRoom.messages[indexdMsg] = chatmessage;
        console.log('indexdMsg', indexdMsg);
      }else{
        this.currentRoom.messages.push(chatmessage);
        console.log('pushNewMsg');
      }
      this.getAllMessagesOfCurrentRoom();
    })
  }
  // *********  Create new Room *********

  createnewChatRoom(){
    console.log("CreateNewChatRoom");
    console.log("allChatRooms", this.allChatRooms);
    this.existChatRoomWithThisName =false;
    if(this.newChatRoom !== null){
      if(this.allChatRooms) { // konttrolloj nqs ekziston nje dchatrom me kete emer
        this.allChatRooms.forEach((chatRoom) => {
          if (chatRoom.chatName === this.newChatRoom) {
            this.existChatRoomWithThisName = true;
          }
        });
      }
      if (!this.existChatRoomWithThisName){
        console.log("new chat Room", this.existChatRoomWithThisName);
        const newChatRoom = this.buildRoom();
        console.log("newChatRoom", newChatRoom);

        this.chatService.createNewChatRoom(newChatRoom).subscribe(room => {
            this.newChatRoom = null;
          }
        );
      }
    }

  }

  buildRoom(){
    const chatRoom: ChatRoom ={
      id: null,
      chatName: this.newChatRoom,
      messages: null
    };
    return chatRoom;
  }

  listenRooms(){
    this.socketService.roomSubject.subscribe((room) =>{
      this.allChatRooms.push(room);
    })
  }

// upload a file
  onSelectedFile(event){
    this.selectedFile = <File> event.target.files[0];
  }

 /* uploadFile(){
    let fd  = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    let fileUploadData: FileUploadData = {
      file: fd,
      senderName: this.currentUser
    };

    this.chatService.uploadFile(this.currentRoom.id, fileUploadData).subscribe( msg => {
        this.selectedFile = null;
      }
    );
  }*/

}
