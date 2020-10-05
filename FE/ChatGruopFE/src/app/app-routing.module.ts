import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ChatRoomComponent } from './chat/chat-room.component';

const routes: Routes = [
{
path: '',
redirectTo: 'chatRooms',
pathMatch: 'full'

},
{
path: 'chatRooms',
component: ChatRoomComponent


}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}