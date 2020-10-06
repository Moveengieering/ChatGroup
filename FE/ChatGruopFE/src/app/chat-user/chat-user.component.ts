import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {

  userName: string;
  usersList: string[];
  userIsJoined: boolean;

  constructor() { }

  ngOnInit(): void {
    this.userIsJoined = false;
    this.userName = "";
  }

  addUser(){ 
    this.userIsJoined = true;
    this.usersList =!!localStorage.getItem('userName') ? JSON.parse(localStorage.getItem('userName')) : [];
    
    this.usersList.push(this.userName);
    localStorage.setItem("", this.userName );

    console.log("userName:",this.userName );
    console.log("usersList:",this.usersList );
    console.log("localStorage:",localStorage );

  }



}
