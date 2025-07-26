import { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import Logo from './components/Logo';
import InfoBox from './components/InfoBox';
import Banner from './components/Banner';
import OEEChart from './components/OEEChart';
import { Button, Stack } from '@mui/material';

const API_URL = "http://127.0.0.1:8000/ask";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('1w'); // default to 1 week

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMessage]);
    setText('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text.trim() })
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer ?? "Sorry, I didn't get that."
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to backend." }
      ]);
    }
    setLoading(false);
  };

  const rangeButtons = [
    { label: '1 WEEK', value: '1w' },
    { label: '1 MONTH', value: '1m' },
    { label: '3 MONTHS', value: '3m' },
    { label: '1 YEAR', value: '1y' },
  ];

  return (
    <div className="container">
      <Banner />
      <Logo />

      <div className="page">
        <div className="chat-box">
          <ChatHeader />
          <ChatArea messages={messages} loading={loading} />
          <ChatInput
            text={text}
            setText={setText}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        <div className="info-grid">
          <InfoBox title="OEE Efficiency" className="full-span">
            <OEEChart range={range} />
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              {rangeButtons.map(btn => (
                <Button
                  key={btn.value}
                  variant={range === btn.value ? 'contained' : 'outlined'}
                  onClick={() => setRange(btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </Stack>
          </InfoBox>

          <InfoBox title="Notes:">Filler is running slow today</InfoBox>
          <InfoBox title="Can size change:">Expected on the 14th July</InfoBox>
          <InfoBox title="Product Change">Product Change in 3 hours</InfoBox>
        </div>
      </div>
    </div>
  );
}

export default App;
