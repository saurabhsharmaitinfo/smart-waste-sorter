# Waste Sorting Assistant
A computer vision-based app to classify household waste and provide recycling instructions.

## Setup
### Backend
1. Install dependencies: `pip install fastapi uvicorn opencv-python tensorflow python-multipart`
2. Run: `cd app/backend && uvicorn main:app --reload`
3. Deploy: `vercel`

### Web App
1. Install dependencies: `cd app/frontend/waste-sorting-web && npm install`
2. Run: `npm start`
3. Deploy: `vercel`

### Mobile App
1. Install dependencies: `cd app/mobile/waste-sorting-mobile && npm install`
2. Run: `npx expo start`
3. Test with Expo Go app

## Demo
- Web: [Insert Vercel URL]
- Mobile: Scan QR code from `npx expo start`

## Model Performance
- Accuracy: [Insert from classification_report]
- Classes: 'cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash'