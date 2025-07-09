import '../styles/ChatArea.css';
import Message from './Message';

function ChatArea({ messages }) {
    return (
        <div className="chat-area">
        {messages.map((msg,index) => (
            <Message key={index} role={msg.role} content={msg.content} />
        ))}
        </div>
    );
}

export default ChatArea;

// This component displays the chat area where old messages are shown.