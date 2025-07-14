from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
#import tensorflow as tf
import tensorflow.lite as tflite
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import sqlite3
from io import BytesIO
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://smart-waste-sorter-seven.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load TFLite model
try:
    if not os.path.exists('waste_classifier.tflite'):
        raise FileNotFoundError("Model file 'waste_classifier.tflite' not found")
    interpreter = tflite.Interpreter(model_path='waste_classifier.tflite')
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
except Exception as e:
    raise Exception(f"Failed to load TFLite model: {str(e)}")

# Define classes
CLASSES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

class WastePrediction(BaseModel):
    category: str
    instructions: str

def preprocess_image(image):
    """Preprocess image for TFLite model: resize to 224x224 and normalize."""
    try:
        if image is None:
            raise ValueError("Invalid image data")
        img = cv2.resize(image, (224, 224))
        img = img / 255.0
        return img.astype(np.float32).reshape(1, 224, 224, 3)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {str(e)}")

@app.post("/predict-waste", response_model=WastePrediction)
async def predict_waste(file: UploadFile = File(...)):
    try:
        # Validate file extension
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(status_code=400, detail="Only PNG or JPEG images are supported")

        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        # Preprocess and predict
        processed_img = preprocess_image(img)
        interpreter.set_tensor(input_details[0]['index'], processed_img)
        interpreter.invoke()
        prediction = interpreter.get_tensor(output_details[0]['index'])
        category = CLASSES[np.argmax(prediction)]
        
        # Fetch instructions from SQLite
        try:
            conn = sqlite3.connect('recycling_rules.db')
            cursor = conn.cursor()
            cursor.execute("SELECT instructions FROM rules WHERE category=?", (category,))
            instructions = cursor.fetchone()
            instructions = instructions[0] if instructions else "Check local guidelines"
            conn.close()
        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        return WastePrediction(category=category, instructions=instructions)
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")