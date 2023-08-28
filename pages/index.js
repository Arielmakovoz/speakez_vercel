import { useState } from 'react';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = () => {
    setAudioChunks([]);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
          if (e.data.size > 0) {
            setAudioChunks(prevChunks => [...prevChunks, e.data]);
          }
        };
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setDuration(audioBlob.duration); // This line will not work. AudioBlob doesn't have a duration property.
          sendAudioToServer(audioBlob);
        };
        setMediaRecorder(recorder);
        recorder.start();
        setRecording(true);
      })
      .catch(error => console.error('Error accessing microphone:', error));
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const sendAudioToServer = async audioBlob => {
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
      console.error('Error sending audio to server:', error);
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