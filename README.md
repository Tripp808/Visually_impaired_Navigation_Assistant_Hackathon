# OpenVision: AI-Powered Navigation and Translation for Visually Impaired Individuals in Africa

## Table of Contents
- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Dataset and Model Training](#dataset-and-model-training)
- [Model Improvements](#model-improvements)
- [App Development](#app-development)
- [Challenges and Learnings](#challenges-and-learnings)
- [Future Work](#future-work)
- [How to Run the Project](#how-to-run-the-project)
- [Team Members](#team-members)
- [Acknowledgments](#acknowledgments)

## Introduction
OpenVision is an AI-powered assistant designed to assist visually impaired individuals in navigating urban African environments. The project uses object detection, text-to-speech (TTS), and language translation technologies to provide real-time navigation assistance and support for low-resource African languages. Built for CodeXtreme Hackathon, OpenVision aims to bridge the accessibility gap and empower visually impaired individuals to move independently and confidently.

## Problem Statement
In many African urban environments, infrastructure often lacks accessibility features for visually impaired individuals. Challenges include:
- **Obstacles:** Potholes, open gutters, and uneven surfaces.
- **Navigation:** Lack of accessible street signs and directions.
- **Language Barriers:** Limited support for low-resource African languages in existing assistive technologies.

OpenVision addresses these challenges by providing real-time obstacle detection, navigation assistance, and language translation.

## Solution Overview
OpenVision combines the following technologies:
- **Object Detection:** Detects obstacles (e.g., potholes, open gutters) and objects (e.g., street signs, vehicles) using a fine-tuned YOLOv8 model.
- **Text-to-Speech (TTS):** Provides real-time audio feedback in English and low-resource African languages.
- **Language Translation:** Translates detected text (e.g., street signs) into local languages.
- **A mobile App:** An app that uses the device's camera and microphone for real-time assistance.

## Features
### Real-Time Obstacle Detection:
- Detects potholes, open gutters, street signs, vehicles, and more.
- Provides audio feedback to alert users of obstacles.

### Navigation Assistance:
- Guides users through urban environments using audio instructions.
- Integrates with GPS for route planning.

### Language Translation:
- Translates detected text (e.g., street signs) into local languages.
- Supports low-resource African languages (e.g., Yoruba, Swahili).

### Accessible App:
- Works on mobile devices with a simple, intuitive interface.
- Uses the device's camera and microphone for real-time assistance.

## Technical Architecture
### The OpenVision system consists of the following components:
#### **Object Detection Model:**
- **Model:** Fine-tuned YOLOv8 (You Only Look Once).
- **Backbone:** ResNet-101 for feature extraction.
- **Dataset:** Custom dataset of African urban environments (potholes, street signs, etc.). 

#### **Text-to-Speech (TTS):**
- **Library:** Google TTS (gTTS) for English.
- **Low-Resource Languages:** Coqui TTS for African languages.

#### **Language Translation:**
- **Model:** Fine-tuned MarianMT for low-resource African languages.
- **Supported Languages:** Yoruba, Swahili, Hausa, etc.

#### **App:**
- **Framework:** Flutter.
- **Frontend:** HTML, CSS, JavaScript.
- **Backend:** Python, OpenCV, PyTorch.

## Dataset and Model Training
### **Dataset**
- **Source:** Collected from African urban environments, including potholes, street signs, vehicles, and pedestrians. https://universe.roboflow.com/all-mix/visually-impaired-dataset
- **Annotation:** Labeled using Roboflow and LabelImg.
- **Classes:** Potholes, open gutters, street signs, vehicles, pedestrians, etc.

### **Model Training**
#### **YOLOv8 Fine-Tuning:**
- Pretrained on COCO dataset.
- Fine-tuned on the custom African urban dataset.
- Achieved mAP50 of 0.492 and mAP50-95 of 0.332.

#### **Language Translation:**
- Fine-tuned MarianMT on low-resource African language datasets.
- Achieved BLEU scores of 25+ for Yoruba and Swahili.

## Model Improvements
- **Improved Object Detection:** Added more classes (e.g., traffic lights, animals).
- **Increased Dataset Size and Diversity:** Achieved higher mAP by training for more epochs.
- **Low-Resource Language Support:** Fine-tuned TTS models for African languages using Coqui TTS.
- **Optimized Inference Speed:** Using ONNX and TensorRT, reduced latency to <100ms per frame.

## App Development
The app is built using Flask and provides the following features:
- **Real-Time Video Feed:** Displays the camera feed with detected objects highlighted.
- **Audio Feedback:** Provides real-time audio alerts for detected objects.
- **Language Translation:** Translates detected text into local languages.
- **User-Friendly Interface:** Simple and intuitive design for visually impaired users.

## Challenges and Learnings
### **Challenges**
- **Dataset Collection:** Limited availability of labeled datasets for African urban environments.
- **Low-Resource Languages:** Lack of high-quality datasets for African languages.
- **Real-Time Performance:** Balancing accuracy and inference speed.

### **Learnings**
- **Importance of Dataset Diversity:** A diverse dataset improves model generalization.
- **Fine-Tuning for Local Context:** Pretrained models need fine-tuning for specific use cases.
- **User-Centric Design:** Accessibility features are critical for visually impaired users.

## Future Work
- **Expand Object Detection:** Add more classes (e.g., animals, traffic lights).
- **Improve Language Support:** Add more African languages (e.g., Zulu, Igbo).
- **Mobile App Development:** Develop a standalone mobile app for easier access.
- **Integration with Wearable Devices:** Build a wearable device for hands-free navigation.

## How to Run the Project
### **Prerequisites**
- Python 3.8+
- Install required libraries:
```bash
pip install flask opencv-python ultralytics gtts pyngrok transformers torch torchvision
```

### **Steps**
1. Clone the repository:
```bash
git clone https://github.com/your-username/OpenVision.git
cd OpenVision
```
2. Run the Flask app:
```bash
python app.py
```
3. Access the web app:
- Open the Ngrok URL provided in the terminal.
- Allow camera and microphone access.

## Team Members
- **Oche Ankeli** - Data scientist
- **Samuel Babalola** - AI Engineer
- **Clinton Pikita** - Mobile developer

## Acknowledgments
- CodeXtreme Hackathon for providing the platform to build this project.
- Roboflow for dataset annotation tools.
- Hugging Face for pretrained models and datasets.
- Coqui TTS for low-resource language support.

## Conclusion
OpenVision is a step towards making urban African environments more accessible for visually impaired individuals. By combining object detection, TTS, and language translation, we aim to empower users to navigate independently and confidently.

Let us know if you have any questions or feedback! 🚀
