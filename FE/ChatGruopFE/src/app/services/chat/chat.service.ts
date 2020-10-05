import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { ChatMessage } from 'src/app/domain/chatMessage';
import { ChatRoom } from 'src/app/domain/chatRomm';
import { threadId } from 'worker_threads';
import {SocketClientService} from '../websocket/socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chatRoomList: Subject<ChatRoom>;


  constructor(private socketClient: SocketClientService) {
  }


  getChatRoomList(): Observable<ChatRoom[]> {
    return this.socketClient
      .onMessage(`/app/chat/get`);

  }

  getOthersChatRoomsList(username: string): Observable<ChatRoom[]>{
    return this.socketClient.onMessage(`/app/otherchat/${username}/get`);
  }

  getChatRoomByChatname(chatName: string): Observable<ChatRoom> {
    return this.socketClient.onMessage(`/app/chat/${chatName}/get`);   
  }

  createNewChatRoom(username: string): Observable<ChatRoom> {
     this.socketClient._send(`/app/createChat/${username}`);
    return this.getChatRoomByChatname(username);
  }

  createNewMessage(idChatRoom: string, message: any){
    
    return this.socketClient.send(`/app/createMessage/${idChatRoom}`, message);

  }
  updateMessage(idChatRoom: string, chatMessage: any){

    return this.socketClient.send(`/app/updateMessage/${idChatRoom}`, chatMessage);

  }


}
