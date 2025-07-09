import '../styles/Message.css';

function Message({ role, content }) {
    return (
        <div className={`message ${role}`}>
            {content}
        </div>
    );
}

export default Message

// This component displays a message in the chat area.
