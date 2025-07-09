import '../styles/ChatInput.css';

function ChatInput({ text, setText, handleSubmit }) {
    return (
        <form className="input-area" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">📨</button>
        </form>
    );
}

export default ChatInput;

//This is the input area for the user to write their message to the AI
