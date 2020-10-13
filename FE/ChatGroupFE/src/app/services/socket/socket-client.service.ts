import {Injectable} from '@angular/core';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Subject} from 'rxjs';
import {ChatMessage} from '../../domain/ChatMessage';
import {ChatRoom} from '../../domain/ChatRoom';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService {


  stompClient;
  messageSubject = new Subject<ChatMessage>();
  roomSubject = new Subject<ChatRoom>();

  constructor() { this.initializeWebSocketConnection();}

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/root-path-chat';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe('/topic/message', (message) => {
        if (message.body) {
          that.messageSubject.next(JSON.parse(message.body));
        }
      });
      that.stompClient.subscribe('/topic/rooms', (rooms) =>{
        if(rooms.body){
          that.roomSubject.next(JSON.parse(rooms.body));
        }
      })
    });
  }


}




// sendMessage(message) {
//   this.stompClient.send('/app/send/message', {}, message);
// }
