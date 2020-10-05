import { ChatMessage } from './chatMessage';

export interface ChatRoom{
   id: string;
   chatName: string;
   messages: ChatMessage[];
}