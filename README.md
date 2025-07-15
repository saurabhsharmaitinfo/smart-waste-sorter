# Waste Sorting Assistant
A computer vision-based app to classify household waste and provide recycling instructions.

## Backend Setup
1. Navigate to `app/backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate: `source venv/Scripts/activate` (Git Bash) or `venv\Scripts\activate` (cmd)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `waste_classifier.tflite` to `app/backend/`
6. Initialize database: `python init_db.py`
7. Run server: `uvicorn main:app --host 0.0.0.0 --port 8000`
8. Test API: `http://<your-ip>:8000/docs`
9. Deployed at: `https://smart-waste-sorter.onrender.com`

## Web App Setup
1. Navigate to `app/frontend/waste-sorting-web`
2. Install dependencies: `npm install`
3. Set environment variables in `.env.development` (local) or Vercel (production)
4. Run: `npm start` (development) or `npm run build && serve -s build` (production)
5. Test at `http://localhost:3000` (development) or `https://smart-waste-sorter-seven.vercel.app`
6. Features: Results displayed in category-specific colors (e.g., blue for plastic)

## Mobile App Setup
1. Navigate to `app/mobile/waste-sorting-mobile`
2. Install dependencies: `npm install`
3. Set `EXPO_PUBLIC_API_URL` in `.env.development` (use laptop IP)
4. Run: `npx expo start --clear`
5. Test with Expo Go on your smartphone
6. Features: Camera-based image capture, results in category-specific colors

## Model Performance
- Classes: plastic, organic, metal, paper, glass, cardboard
- Accuracy: [Add your model’s test accuracy, e.g., 85%]