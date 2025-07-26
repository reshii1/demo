import { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import Logo from './components/Logo';
import InfoBox from './components/InfoBox';
import Banner from './components/Banner';
import OEEChart from './components/OEEChart';
import { Button, Stack } from '@mui/material';

//backend api url
const API_URL = "http://127.0.0.1:8000/ask";

function App() {
  const [messages, setMessages] = useState([]);      //chat message history
  const [text, setText] = useState('');              //current input
  const [loading, setLoading] = useState(false);     //is assistant responding?
  const [range, setRange] = useState('1w');           //range for chart data

  const handleSubmit = async (e) => {
    e.preventDefault(); //stops page reloading on submit
    if (!text.trim()) return; //ignore empty inputs

    //puts previous messages in chat
    const newMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMessage]);
    setText('');
    setLoading(true);

    //send request to backend
    const sendRequest = async () => {
      const controller = new AbortController(); //timeout handling (20s)
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text.trim() }),
          signal: controller.signal
        });

        const data = await response.json();

        //check response
        if (!response.ok || typeof data.answer !== 'string') {
          throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
        }

        //add AI response to chat
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer }
        ]);
      } catch (error) {
        console.error("Error during fetch:", error);
        throw error; 
      } finally {
        clearTimeout(timeoutId); //clear timeout
      }
    };

    //retry
    try {
      await sendRequest();
    } catch (firstError) {
      console.warn("Retrying after first failure...");
      await new Promise((res) => setTimeout(res, 1000)); //delay before retry (1s)

      try {
        await sendRequest();
      } catch (finalError) {
        //error message if retry fails
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ Error: ${finalError.message || 'Unable to reach server after retry.'}`
          }
        ]);
      }
    }

    setLoading(false); 
  };

  //buttons for the OEE chart
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
          {/* OEE chart*/}
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

          {/*revise these later*/}
          <InfoBox title="Notes:">Filler is running slow today</InfoBox>
          <InfoBox title="Can size change:">Expected on the 14th July</InfoBox>
          <InfoBox title="Product Change">Product Change in 3 hours</InfoBox>
        </div>
      </div>
    </div>
  );
}

export default App;
