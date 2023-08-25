import React, { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState<string>(''); // Define type as string
  const [inputMessage, setInputMessage] = useState<string>(''); // Define type as string

  const fetchMessage = async () => {
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container">
      <h1>Flask and Next.js Application</h1>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={fetchMessage}>Send Message</button>
      </div>
      <p>Server Response: {message}</p>
    </div>
  );
}
