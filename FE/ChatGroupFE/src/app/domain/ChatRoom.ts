import { ChatMessage } from './ChatMessage';

export interface ChatRoom{
   id: string;
   chatName: string;
   messages: ChatMessage[];
}
