import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebSocketChatRoom';

  greetings: string[] = [];
  disabled = true;
  newmessage: string;
  private stompClient = null;

    username: string =null;
 enterName = false;

  constructor(){}

  ngOnInit() {
    this.connect();
    this.enterName =false;
    this.username = null;
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/testchat');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/start/initial', function (hello) {
        console.log(JSON.parse(hello.body));
        
        
      });
    });
  }
   createChat(){
     this.username = null;
     this.enterName = true;

   }

  // sendMessage() {
    
  //   this.stompClient.send(
  //     '/current/chatRoom',
  //     {},
  //     JSON.stringify(this.newmessage)
  //   );
  //   this.newmessage = "";

  // }

  // showMessage(message) {
    
  //     this.greetings.push(message);

  // }

}
