FROM tensorflow/tensorflow:latest

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y libsm6 libxext6 libxrender-dev libgl1-mesa-glx

# Set the working directory to /app
WORKDIR /app

# Install Flask
RUN pip install flask flask-cors gunicorn spotipy python-dotenv

# Install numpy
RUN pip install numpy

# Install OpenCV
RUN pip install opencv-python-headless

# Copy all files from the current directory to the container root
COPY . /app

# Expose port 5000 for the Flask server
EXPOSE 5000

# Start the Flask server
CMD ["gunicorn", "wsgi:app", "-c", "gunicorn_config.py"]
