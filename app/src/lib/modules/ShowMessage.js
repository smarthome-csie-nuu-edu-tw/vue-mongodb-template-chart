import message_store from "@store/show-message.js";

export default function(message, icon='bx-bx-message-rounded-dots', id=null) {
  message_store.dispatch('createMessage', { message, icon, id });
}