import React, { useState } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  const [serverResponse, setServerResponse] = useState("");

  const startRecording = () => {
    setRecording(true);
    setAudioChunks([]);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((chunks) => [...chunks, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioURL = URL.createObjectURL(audioBlob);
          setAudioURL(audioURL);

          sendAudioToServer(audioBlob);
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const sendAudioToServer = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const response = await fetch("/api/process_audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setServerResponse(responseData.message); // Display the server response
      } else {
        console.error("Error sending audio to server:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending audio to server:", error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      {audioURL && (
        <audio controls src={audioURL} style={{ marginTop: "1rem" }} />
      )}
      {serverResponse && <p>Server Response: {serverResponse}</p>}
    </div>
  );
};

export default AudioRecorder;