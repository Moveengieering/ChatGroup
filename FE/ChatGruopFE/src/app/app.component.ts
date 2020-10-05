import {Component} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {SocketClientService} from './services/websocket/socket-client.service';
import {ChatService} from './services/chat/chat.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebSocketChatRoom';


  constructor() {
  }

  ngOnInit() {

  }

  

}
