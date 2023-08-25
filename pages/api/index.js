import { useState } from 'react';

export default function Home() {
    const [word, setWord] = useState('');
    const [echoedWord, setEchoedWord] = useState('');

    const handleInputChange = (event) => {
        setWord(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/echo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),  // Use the correct variable name 'word'
            });

            const data = await response.json();
            setEchoedWord(data.echoed_word);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Word Echo</h1>
            <input type="text" value={word} onChange={handleInputChange} />
            <button onClick={handleSubmit}>Echo</button>
            {echoedWord && <p>Echoed Wwwword: {echoedWord}</p>}
        </div>
    );
}