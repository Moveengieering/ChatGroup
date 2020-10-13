import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {

  userName: string;
  usersList: string[];
  userIsJoined: boolean;

  constructor() {
  }

  ngOnInit(): void {
    this.userIsJoined = false;
    this.userName = '';
  }

  addUser() {
    localStorage.setItem('', this.userName);
    this.userIsJoined = true;

  }


}
