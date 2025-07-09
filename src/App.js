import { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import Logo from './components/Logo';
import InfoBox from './components/InfoBox';
import Banner from './components/Banner';

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMessage = {
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, newMessage]);
    setText('');
  };

  return (
  <div className="container">
    <Banner>
    </Banner>
    <Logo />
    <div className="page">
      <div className="chat-box">
        <ChatHeader />
        <ChatArea messages={messages} />
        <ChatInput text={text} setText={setText} handleSubmit={handleSubmit} />
      </div>
      <div className="info-grid">
        <InfoBox title="Average Shift efficiency today: 70%">
          <img
            src="/Fake_Graph.webp"
            alt = "snapshot"
            style={{ width: '100%', height: '100%', borderRadius: '6px' }}
          />
        </InfoBox>
        <InfoBox title="Product turnover:">Expected in 5 hours 15 minutes</InfoBox>
        <InfoBox title="Can size change:">Expected on the 14th July</InfoBox>
        <InfoBox title="Notes:">Filler is running slow today</InfoBox>
      </div>
      </div>
  </div>
);
}

export default App;
