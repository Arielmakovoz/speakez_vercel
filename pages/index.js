import { useState } from 'react';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // Replace with the actual recorded audio Blob

  const startRecording = () => {
    setRecording(true);
    // Start recording logic (use browser APIs like MediaRecorder)
  };

  const stopRecording = async () => {
    setRecording(false);
    // Stop recording logic and obtain the audio Blob

    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await fetch('/api/process_audio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setDuration(data.duration);
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      {duration && <p>Audio Duration: {duration.toFixed(2)} seconds</p>}
    </div>
  );
}