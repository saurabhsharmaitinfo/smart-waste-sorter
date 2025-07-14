# Waste Sorting Assistant
A computer vision-based app to classify household waste and provide recycling instructions.

## Backend Setup
1. Navigate to `app/backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate: `source venv/Scripts/activate` (Git Bash) or `venv\Scripts\activate` (cmd)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `waste_classifier.tflite` to `app/backend/`
6. Initialize database: `python init_db.py`
7. Run server: `uvicorn main:app --reload`
8. Test API: `http://localhost:8000/docs`

## Web App Setup
1. Navigate to `app/web`
2. Install dependencies: `npm install`
3. Run: `npm start`
4. Test at `http://localhost:3000`

## Model Performance
- Classes: plastic, organic, metal, paper, glass, cardboard
- Accuracy: [Add your model’s test accuracy, e.g., 85%]