import io
import numpy as np
import tensorflow as tf
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

# --- Configuration & Model Loading ---

MODEL_PATH = '../cnn.h5' # Assuming model is in the root, one level up
IMAGE_WIDTH = 200
IMAGE_HEIGHT = 200

# Define the face shape classes based on the training script
CLASS_NAMES = ['diamond', 'heart', 'oblong', 'oval', 'round', 'square', 'triangle']

# Load the pre-trained Keras model
try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    # Exit or raise a more specific exception if the model is critical
    # For now, we'll let it proceed but predictions will fail.
    model = None

# --- Recommendation Logic ---

RECOMMENDATIONS = {
    "oval": ["Most frame shapes work well. Try experimenting!", "Consider Wayfarers, Aviators, or Square frames."],
    "round": ["Angular, rectangular, or geometric frames to add definition.", "Look for frames wider than they are tall.", "Avoid small or round frames."],
    "square": ["Round or oval frames to soften angles.", "Consider cat-eye or browline frames.", "Avoid boxy or angular frames."],
    "heart": ["Frames wider at the bottom, light-colored, or rimless.", "Aviators or round frames balance the face.", "Avoid top-heavy styles or decorative temples."],
    "diamond": ["Frames with detailing or distinctive browlines (e.g., cat-eye, browline).", "Oval or rimless frames can also work.", "Avoid narrow frames."],
    "oblong": ["Frames that add width to the face.", "Look for decorative temples, contrasting colors, or deep frames.", "Aviators or square frames can work well.", "Avoid narrow or small frames."],
    "triangle": ["Frames wider at the top, like cat-eye or browline styles.", "Consider frames with detailing on the upper half.", "Avoid frames wider at the bottom."]
    # Add recommendations for other shapes if your model predicts them
}

# --- FastAPI App Initialization ---

app = FastAPI(title="Face Shape Prediction API")

# Configure CORS
origins = [
    "http://localhost:3000",  # Default React dev server port
    "http://localhost:3001",  # Alternative React dev port
    # Add any other origins if needed (e.g., your deployed frontend URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# --- Helper Functions ---

def preprocess_image(image_data: bytes):
    """Preprocesses the uploaded image data to match model input."""
    try:
        # Convert bytes to NumPy array using OpenCV
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image data.")

        # Resize image
        img_resized = cv2.resize(img, (IMAGE_WIDTH, IMAGE_HEIGHT))

        # Convert BGR to RGB (if needed - OpenCV loads as BGR, PIL/TF usually expect RGB)
        # img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB) # Uncomment if model expects RGB

        # Rescale pixel values (as done in training with rescale=1./255)
        img_rescaled = img_resized / 255.0 # Use img_rgb if converted

        # Reshape for model input (add batch dimension)
        img_reshaped = np.reshape(img_rescaled, (1, IMAGE_HEIGHT, IMAGE_WIDTH, 3))

        return img_reshaped
    except Exception as e:
        print(f"Error during image preprocessing: {e}")
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {e}")


# --- API Endpoints ---

@app.get("/")
async def root():
    return {"message": "Face Shape Recommendation API is running!"}

@app.post("/predict")
async def predict_face_shape(file: UploadFile = File(...)):
    """Receives an image upload, predicts face shape, and returns recommendations."""
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded correctly.")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    # Read image data
    image_data = await file.read()

    # Preprocess the image
    processed_image = preprocess_image(image_data)

    # Make prediction
    try:
        predictions = model.predict(processed_image)
        predicted_index = np.argmax(predictions[0])

        if predicted_index >= len(CLASS_NAMES):
             raise HTTPException(status_code=500, detail="Model prediction index out of bounds.")

        predicted_shape = CLASS_NAMES[predicted_index]
        confidence = float(predictions[0][predicted_index]) # Get confidence score

    except Exception as e:
        print(f"Error during model prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {e}")

    # Get recommendations
    shape_recommendations = RECOMMENDATIONS.get(predicted_shape, ["No specific recommendations available for this shape."])

    return {
        "predicted_shape": predicted_shape,
        "confidence": confidence,
        "recommendations": shape_recommendations
    }

# --- Run Instruction (for local development) ---
# Open terminal in the 'backend' directory and run:
# uvicorn main:app --reload 