import { Chat as ChatRoot } from "./chat.component";
import { ChatBody } from "./chat-body.component";
import { ChatMessage } from "./chat-message.component";
import { ChatInputComponent } from "./chat-input.component";

export const Chat = Object.assign(ChatRoot, {
  Body: ChatBody,
  Message: ChatMessage,
  Input: ChatInputComponent,
});

