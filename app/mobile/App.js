import React, { useState, useEffect } from 'react';
     import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
     import * as ImagePicker from 'expo-image-picker';
     import * as FileSystem from 'expo-file-system';
     import axios from 'axios';
     import NetInfo from '@react-native-community/netinfo';

     export default function App() {
       const [result, setResult] = useState(null);
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState(null);
       const [isOnline, setIsOnline] = useState(true);

      // Define category colors
      const categoryColors = {
        cardboard: '#8d5524', // Brown 
        glass: '#7f8c8d',     // Transparent Green
        metal: '#95a5a6',     // Silver        
        paper: '#2ecc71',   // Green
        plastic: '#3498db',   // Blue        
        trash: 'red',   // Red
      };

       useEffect(() => {
         const unsubscribe = NetInfo.addEventListener(state => {
           setIsOnline(state.isConnected);
         });
         return () => unsubscribe();
       }, []);

       const pickImage = async () => {
         const { status } = await ImagePicker.requestCameraPermissionsAsync();
         if (status !== 'granted') {
           setError('Camera permission is required!');
           return;
         }

         const image = await ImagePicker.launchCameraAsync({
           allowsEditing: true,
           aspect: [1, 1],
           quality: 1,
         });

         if (!image.canceled) {
           setLoading(true);
           setError(null);
           if (isOnline) {
             const formData = new FormData();
             formData.append('file', {
               uri: image.assets[0].uri,
               type: 'image/jpeg',
               name: 'waste.jpg',
             });

             try {
               const response = await axios.post(process.env.EXPO_PUBLIC_API_URL, formData, {
                 headers: { 'Content-Type': 'multipart/form-data' },
               });
               setResult(response.data);
             } catch (err) {
               setError('Failed to process image. Please try again.');
               console.error(err);
             }
           } else {
             setError('Offline mode not implemented yet. Please connect to the internet.');
           }
           setLoading(false);
         }
       };

       return (
         <View style={styles.container}>
           <Text style={styles.title}>Waste Sorting Assistant</Text>
           <Button title="Take Photo" onPress={pickImage} disabled={loading} />
           {loading && <ActivityIndicator size="large" color="#3498db" />}
           {error && <Text style={styles.error}>{error}</Text>}
           {result && (
             <View style={[styles.result, { backgroundColor: categoryColors[result.category] || '#f0f0f0' }]}>
               <Text style={styles.resultHeader}>Result</Text>
               <Text style={styles.resultText}>Category: {result.category}</Text>
               <Text style={styles.resultText}>Instructions: {result.instructions}</Text>
             </View>
           )}
         </View>
       );
     }

     const styles = StyleSheet.create({
       container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
       title: { fontSize: 24, marginBottom: 20, color: '#2c3e50' },
       error: { color: 'red', marginTop: 10 },
       result: { 
         padding: 15, 
         borderRadius: 5, 
         marginTop: 20, 
         width: '90%', 
         alignItems: 'center' 
       },
       resultHeader: { 
         fontSize: 20, 
         fontWeight: 'bold', 
         color: 'white', 
         marginBottom: 10 
       },
       resultText: { 
         fontSize: 16, 
         color: 'white' 
       },
     });