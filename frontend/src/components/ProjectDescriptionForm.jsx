import React, { useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import Recording from './Recording';

const ProjectDescriptionForm = ({ projectDescription, setProjectDescription, setError }) => {
  // Keep isRecording controlled here
  const [isRecording, setIsRecording] = useState(false);

  return (
    <section className="form-section">
      <label><FiFileText /> תיאור כללי של הפרויקט:</label>
      <div className="textarea-container">
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows={4}
          placeholder="תיאור כללי של הפרויקט..."
          disabled={isRecording}
        />
        <Recording
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setError={setError}
          onTextReceived={(text) => setProjectDescription((prev) => prev + " " + text)}
        />
      </div>
    </section>
  );
};

export default ProjectDescriptionForm;
