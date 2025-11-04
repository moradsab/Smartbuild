// Recording.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiSend, FiX } from 'react-icons/fi';
import { transcribeRecording } from '../services/api';

const Recording = ({ isRecording, setIsRecording, setError, onAudioRecorded, onTextReceived }) => {
  const [isRecordingLocked, setIsRecordingLocked] = useState(false);
  const [recordStartY, setRecordStartY] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const recordButtonRef = useRef(null);
  const isCancelledRef = useRef(false);
  const mediaStreamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      isCancelledRef.current = false;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsRecordingLocked(false);

        if (!isCancelledRef.current && audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (onAudioRecorded) onAudioRecorded(blob);

          setIsTranscribing(true);
          try {
            const text = await transcribeRecording(blob);
            if (onTextReceived) {
              onTextReceived(text); // <-- Pass the transcribed text up
            }
          } catch (err) {
            console.error(err);
            setError("שגיאה בשליחת ההקלטה לתמלול");
          } finally {
            setIsTranscribing(false);
          }
        }

        audioChunksRef.current = [];
        if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');

      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 5 * 60 * 1000);
    } catch (err) {
      setError('שגיאה בגישה למיקרופון. ודא שהרשאות המיקרופון מאושרות.');
      setIsRecording(false);
      setIsRecordingLocked(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  const stopRecordingAndSend = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      isCancelledRef.current = false;
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    isCancelledRef.current = true;
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      setIsRecording(false);
      setIsRecordingLocked(false);
    }
  };

  useEffect(() => {
    const recordButton = recordButtonRef.current;
    if (!recordButton) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      if (!isRecording && !isTranscribing) {
        setRecordStartY(e.touches[0].clientY);
        startRecording();
      } else if (isRecordingLocked) {
        stopRecordingAndSend();
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (isRecording && !isRecordingLocked) {
        const deltaY = recordStartY - e.touches[0].clientY;
        if (deltaY > 60) setIsRecordingLocked(true);
      }
    };

    const handleTouchEnd = () => {
      if (isRecording && !isRecordingLocked) {
        stopRecordingAndSend();
      }
    };

    recordButton.addEventListener('touchstart', handleTouchStart, { passive: false });
    recordButton.addEventListener('touchmove', handleTouchMove, { passive: false });
    recordButton.addEventListener('touchend', handleTouchEnd);

    return () => {
      recordButton.removeEventListener('touchstart', handleTouchStart);
      recordButton.removeEventListener('touchmove', handleTouchMove);
      recordButton.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRecording, isRecordingLocked, recordStartY, isTranscribing]);

  const handleRecordButtonClick = () => {
    if (!isRecording && !isTranscribing) {
      setIsRecordingLocked(true);
      startRecording();
    } else if (isRecordingLocked) {
      stopRecordingAndSend();
    }
  };

  return (
    <>
      {isRecording && isRecordingLocked && !isTranscribing && (
        <button type="button" className="cancel-locked-button" onClick={cancelRecording}>
          <FiX size={26} />
        </button>
      )}

      <div
        ref={recordButtonRef}
        className={`record-button ${isRecording ? 'recording' : ''} ${isRecordingLocked ? 'locked' : ''}`}
        onClick={handleRecordButtonClick}
      >
        {isTranscribing 
          ? <div className="spinner" /> 
          : isRecordingLocked 
            ? <FiSend size={24} /> 
            : <FiMic size={24} />}
        {isRecording && !isRecordingLocked && !isTranscribing && (
          <span className="release-hint">שחרר לשליחה / החלק למעלה לנעילה</span>
        )}
      </div>
    </>
  );
};

export default Recording;
