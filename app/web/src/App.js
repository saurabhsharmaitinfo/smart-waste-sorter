import React, { useState } from 'react';
     import axios from 'axios';
     import './App.css';

     function App() {
       const [image, setImage] = useState(null);
       const [result, setResult] = useState(null);
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState(null);

       // Define category colors
       const categoryColors = {
        cardboard: '#8d5524', // Brown 
        glass: '#7f8c8d',     // Transparent Green
        metal: '#95a5a6',     // Silver        
        paper: '#2ecc71',   // Green
        plastic: '#3498db',   // Blue        
        trash: 'red',   // Red
       };

       const handleImageChange = (e) => {
         setImage(e.target.files[0]);
         setResult(null);
         setError(null);
       };

       const handleSubmit = async () => {
         if (!image) {
           setError('Please select an image');
           return;
         }
         setLoading(true);
         const formData = new FormData();
         formData.append('file', image);
         
         try {
           const response = await axios.post(process.env.REACT_APP_API_URL, formData, {
             headers: { 'Content-Type': 'multipart/form-data' },
           });
           setResult(response.data);
           setError(null);
         } catch (err) {
           setError('Failed to process image. Please try again.');
           console.error(err);
         }
         setLoading(false);
       };

       return (
         <div style={{ textAlign: 'center', padding: '20px' }}>
           <h1>Smart Waste Sorter</h1>
           <input
             type="file"
             accept="image/*"
             onChange={handleImageChange}
             style={{ margin: '10px' }}
           />
           <br />
           <button
             onClick={handleSubmit}
             disabled={loading}
             style={{ padding: '10px 20px', margin: '10px' }}
           >
             {loading ? 'Processing...' : 'Sort Waste'}
           </button>
           {error && <p style={{ color: 'red' }}>{error}</p>}
           {result && (
             <div className="result" style={{ backgroundColor: categoryColors[result.category] || '#f0f0f0' }}>
               <h2>Result</h2>
               <p><strong>Category:</strong> {result.category}</p>
               <p><strong>Instructions:</strong> {result.instructions}</p>
             </div>
           )}
         </div>
       );
     }

     export default App;