import os
from flask import Flask, render_template, Response
import cv2
from PIL import Image
import torch
from transformers import DetrForObjectDetection, DetrImageProcessor
from gtts import gTTS
from io import BytesIO
from pyngrok import ngrok

# Set up Ngrok authentication token from environment variable
NGROK_AUTH_TOKEN = os.getenv("NGROK_AUTH_TOKEN")
if NGROK_AUTH_TOKEN:
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)
else:
    print("Warning: Ngrok authentication token is missing.")

# Initialize Flask app
app = Flask(__name__)

# Load the DETR model and processor
model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-101")
processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-101")
model.eval()

# Function to generate audio feedback
def speak(text):
    tts = gTTS(text=text, lang='en')
    audio_bytes = BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    return audio_bytes

# Function to generate video frames
def generate_frames():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Camera not accessible")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert frame to PIL format
        pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # Preprocess the image
        inputs = processor(images=pil_image, return_tensors="pt")

        # Perform object detection
        with torch.no_grad():
            outputs = model(**inputs)

        # Correct tensor shape for post-processing
        target_sizes = torch.tensor([list(pil_image.size[::-1])], dtype=torch.float32)
        results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.5)[0]

        # Process detection results
        for box, score, label in zip(results["boxes"], results["scores"], results["labels"]):
            if score > 0.5:
                box = box.tolist()
                label = model.config.id2label[label.item()]
                confidence = score.item()
                x1, y1, x2, y2 = map(int, box)

                # Draw bounding box and label
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{label} {confidence:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        # Convert frame to JPEG format
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        # Yield frame data
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    cap.release()

# Route for home page
@app.route('/')
def index():
    return render_template('index.html')

# Route for video feed
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for audio feedback
@app.route('/audio_feed')
def audio_feed():
    return Response(speak("Object detected"), mimetype='audio/mpeg')

# Run Flask app with Ngrok
if __name__ == '__main__':
    ngrok_tunnel = ngrok.connect(5000, "http")
    print("Public URL:", ngrok_tunnel.public_url)
    app.run(debug=False, use_reloader=False)
