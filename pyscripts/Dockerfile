FROM tensorflow/tensorflow:latest

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y libsm6 libxext6 libxrender-dev libgl1-mesa-glx

# Install Flask
RUN pip install flask flask-cors

# Install numpy
RUN pip install numpy

# Install OpenCV
RUN pip install opencv-python-headless

# Copy the Flask app to the container
COPY server.py /app.py

# Copy the model to the container
COPY model_all.h5 /model_all.h5

# Expose port 5000 for the Flask server
EXPOSE 5000

# Start the Flask server
CMD ["python", "/app.py"]
