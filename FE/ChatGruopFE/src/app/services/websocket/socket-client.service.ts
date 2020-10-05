import {Injectable, OnDestroy} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {Client, over, Message} from 'stompjs';
import {StompSubscription} from '@stomp/stompjs';
import {SocketClientState} from './SocketClientState';
import * as SockJS from 'sockjs-client';
import {filter, first, switchMap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SocketClientService {

  private client: Client
  private state: BehaviorSubject<SocketClientState>


  constructor() {
    this.client = over(new SockJS('http://localhost:8080/root-path-chat'));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNCTED)
    })
  }

  connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNCTED)).subscribe(() => {
        observer.next(this.client);
      })
    })
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  onMessage(topic: string, handler = SocketClientService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = client.subscribe(topic, message => {
          observer.next(handler(message));
        });
        return () => client.unsubscribe(subscription.id);
      });
    }));
  }

  send(topic: string, payload: any): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send(topic, {}, JSON.stringify(payload)));
  }

  _send(topic: string): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send(topic, {}));
  }

}
