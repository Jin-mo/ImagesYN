import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Optional: Add basic styling if desired

const App: React.FC = () => {
  // State for storing list of photos
  const [photos, setPhotos] = useState<{ filename: string; path: string }[]>([]);
  // State for selected file to upload
  const [file, setFile] = useState<File | null>(null);

  // Fetch photos from backend on component mount
  useEffect(() => {
    axios.get('http://localhost:3000/photos')
      .then(response => setPhotos(response.data))
      .catch(error => console.error('Error fetching photos:', error));
  }, []);

  // Handle photo upload
  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file); // Must match multer field name
    axios.post('http://localhost:3000/upload', formData)
      .then(() => {
        alert('Upload successful');
        // Refresh photo list
        axios.get('http://localhost:3000/photos')
          .then(res => setPhotos(res.data))
          .catch(error => console.error('Error refreshing photos:', error));
      })
      .catch(error => console.error('Error uploading:', error));
  };

  return (
    <div>
      <h1>Simple Immich</h1>
      <input
        type="file"
        accept="image/*" // Restrict to images
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload Photo</button>
      <h2>Photos</h2>
      <ul>
        {photos.map(photo => (
          <li key={photo.path}>
            {photo.filename} - <img src={`/${photo.path}`} alt={photo.filename} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;