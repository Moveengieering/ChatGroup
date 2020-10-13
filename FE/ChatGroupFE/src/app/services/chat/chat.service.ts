import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ChatRoom} from 'src/app/domain/ChatRoom';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ChatMessage} from '../../domain/ChatMessage';
import { url } from 'inspector';


@Injectable({
  providedIn: 'root'
})
export class ChatService {



  constructor(private http: HttpClient) {
  }

  getChatRoomList(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(environment.serverUrl + '/chatRoom/get');
  }

  getChatRoomById(idroom: string) {
    return this.http.get<ChatRoom>(environment.serverUrl + '/chatRoom/' + idroom);
  }

  saveMessage(idRoom: string, message: ChatMessage, file:any) {
    return this.http.post(environment.serverUrl + '/message/' + idRoom, message, file);
  }

  createNewChatRoom(chatName: ChatRoom){
    return this.http.put(environment.serverUrl + '/chatRoom', chatName);
  }

  /*uploadFile(idRoom: string, fileUploadData: FileUploadData){
    return this.http.put(environment.serverUrl + '/uploadFile/' + idRoom, fileUploadData);
  }*/
  public baseUrl = 'http://localhost:8080/api/images';
  public uploadImage(formData: FormData): Observable<any> {
  const file = formData.get('file') as File;
  const url = this.baseUrl + `/upload?file=${file.name}`;
  return this.http.post(url, formData , {responseType: 'text'});
  }


}

