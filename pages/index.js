import React, { useState } from "react";

const AudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(""); // New state for audio URL
  const [serverResponse, setServerResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((chunks) => [...chunks, event.data]);
            setAudioUrl(URL.createObjectURL(new Blob([...audioChunks, event.data], { type: "audio/wav" }))); // Update audio URL
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioBlob(blob);
          setAudioUrl(URL.createObjectURL(blob)); // Update audio URL
          sendAudioToServer(blob);
        };
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
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
        setServerResponse(responseData.message);
      } else {
        console.error("Error sending audio to server:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending audio to server:", error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {audioUrl && <audio controls src={audioUrl} />} {/* Display recorded audio */}
      {serverResponse && <p>Server Response: {serverResponse}</p>}
    </div>
  );
};

export default AudioRecorder;