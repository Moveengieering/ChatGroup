import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  modalTitle: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { this.modalTitle = data.title;}

  ngOnInit() {
  }

createUser(senderName){

  localStorage.setItem(name, senderName)


}

}