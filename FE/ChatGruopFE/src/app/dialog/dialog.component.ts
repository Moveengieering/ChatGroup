import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Key } from 'protractor';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  userName: string;

  constructor(@Inject(MAT_DIALOG_DATA)  public data: any) { }

  ngOnInit(): void {
    this.userName=null;
   
    
    
  }
  enterUsername(user: string){
    this.userName = user;
    this.data.senderName = this.userName;
    console.log("HELLLLLL", this.data);
   
    localStorage.setItem("", this.userName );
      
      
    
  }

}
