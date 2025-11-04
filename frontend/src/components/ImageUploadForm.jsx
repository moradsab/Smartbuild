import React from 'react';
import { FiCamera, FiPlusCircle, FiImage, FiTrash2 } from 'react-icons/fi';
import Recording from './Recording'; // Import the Recording component

const ImageUploadForm = ({ photos, setPhotos, setError }) => {
  // Handler for adding a new photo entry
  const handleAddPhoto = () => {
    // Initialize new photo with isRecording and audio properties
    setPhotos([...photos, { file: null, height: '', width: '', length: '', description: '', audio: null, isRecording: false }]);
  };

  // Handler for changes within a specific photo entry (file, measurements, description, isRecording, audio)
  const handlePhotoChange = (index, field, value) => {
    const newPhotos = [...photos];
    if (field === 'file') {
      newPhotos[index].file = value.target.files[0]; // For file input, get the file object
    } else {
      newPhotos[index][field] = value; // For other fields, directly assign the value
    }
    setPhotos(newPhotos);
  };

  // Handler for deleting a photo entry
  const handleDeletePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index); // Filter out the photo at the given index
    setPhotos(newPhotos);
  };

  // Callback function to handle the recorded audio blob for a specific photo
  const handlePhotoAudioRecorded = (index, blob) => {
    const newPhotos = [...photos];
    newPhotos[index].audio = blob; // Store the audio blob with the specific photo
    setPhotos(newPhotos);
    console.log(`Audio recorded for photo ${index}:`, blob);
    // Here you would typically upload this blob to your server,
    // associating it with the image or its description.
  };

  return (
    <section className="photos-section">
      <h3><FiCamera /> תמונות ומידות</h3>
      {photos.map((photo, index) => (
        <div className="photo-card" key={index}>
          {/* Label for file input, styled as a button */}
          <label className="upload-label" htmlFor={`file-upload-${index}`}>
            <FiImage size={22} /> העלה / צלם תמונה
          </label>
          {/* Hidden file input */}
          <input
            id={`file-upload-${index}`}
            type="file"
            accept="image/*" // Accept image files
            capture="environment" // Prefer environment-facing camera on mobile
            onChange={(e) => handlePhotoChange(index, 'file', e)}
            className="file-input"
          />
          {/* Image preview if a file is selected */}
          {photo.file && (
            <img
              src={URL.createObjectURL(photo.file)} // Create a URL for the selected file
              alt={`site-photo-${index}`}
              className="preview"
            />
          )}
          {/* Measurement inputs */}
          <div className="measurements">
            <input
              type="number"
              min="0"
              placeholder="גובה סמ"
              value={photo.height}
              onChange={(e) => handlePhotoChange(index, 'height', e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="רוחב סמ"
              value={photo.width}
              onChange={(e) => handlePhotoChange(index, 'width', e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="אורך סמ"
              value={photo.length}
              onChange={(e) => handlePhotoChange(index, 'length', e.target.value)}
            />
          </div>
          {/* Textarea and Recording Button Container */}
          <div className="textarea-container">
            <textarea
              placeholder="תיאור לביצוע עבור תמונה זו"
              value={photo.description}
              onChange={(e) => handlePhotoChange(index, 'description', e.target.value)}
              rows={2}
              disabled={photo.isRecording} // Disable textarea when recording
            />
            {/* Recording component for this photo's description */}
            <Recording
              isRecording={photo.isRecording}
              setIsRecording={(value) => handlePhotoChange(index, 'isRecording', value)}
              setError={setError}
              onAudioRecorded={(blob) => handlePhotoAudioRecorded(index, blob)}
              onTextReceived={(text) => handlePhotoChange(index, 'description', photo.description + " " + text)}
            />
          </div>
          {/* Button to delete the photo entry */}
          <button
            type="button"
            className="delete-photo-button"
            onClick={() => handleDeletePhoto(index)}
            title="מחק תמונה"
          >
            <FiTrash2 size={18} /> מחיקה
          </button>
        </div>
      ))}
      {/* Button to add a new photo entry */}
      <button type="button" onClick={handleAddPhoto} className="add-photo-button">
        <FiPlusCircle size={24} /> הוסף תמונה
      </button>
    </section>
  );
};

export default ImageUploadForm;
