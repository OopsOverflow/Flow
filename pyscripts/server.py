import os
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
from flask import Flask, request, jsonify
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from flask_cors import CORS, cross_origin


# Load the pre-trained model in memory
# Check if the custom model file exists
def load_custom_model():
    try:
        model = load_model('h5_custom.h5')
        print('Custom model loaded')
    except:
        print('Custom model not found, loading model_all.h5')
        model = load_model('model_all.h5', compile=False)
    return model


# Define a Flask app object
app = Flask(__name__)
CORS(app)


# Define a function to handle POST requests
@app.route('/predict', methods=['POST'])
@cross_origin(origin='*')
def predict():
    model = load_custom_model()
    # Read the image sent in the request
    img_file = request.files['image']
    img = cv2.imdecode(np.frombuffer(img_file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (48, 48))
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    img = img.astype('float32') / 255.0

    # Pass the image through the pre-trained model to get the emotion
    emotion = model.predict(img)[0]
    emotion_dict = {0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy', 4: 'Neutral', 5: 'Sad', 6: 'Surprise'}
    emotion_label = emotion_dict[np.argmax(emotion)]

    # Calculate the accuracy of the prediction
    accuracy = emotion[np.argmax(emotion)]

    # Return the emotion and accuracy as a response to the POST request
    response = {'emotion': emotion_label, 'accuracy': float(accuracy)}
    return jsonify(response)


@app.route('/retrain', methods=['POST'])
@cross_origin(origin='*')
def retrain():
    try:
        model = load_model('model_all.h5')

        data = request.json['data']

        # Ajouter une nouvelle couche de sortie
        num_classes = 7
        model.add(Dense(num_classes, activation='softmax'))

        # Congeler les couches existantes
        for layer in model.layers[:-1]:
            layer.trainable = False

        # Compiler le modèle
        model.compile(optimizer=Adam(lr=0.001),
                      loss='categorical_crossentropy',
                      metrics=['accuracy'])

        # Charger les nouvelles images
        new_images_dir = 'new_images'
        img_width, img_height = 48, 48

        X = []
        y = []

        for item in data:
            img = load_img(item["image"], grayscale=True, target_size=(img_width, img_height))
            X.append(img_to_array(img))
            y.append(item["label"].title())

        X = np.array(X)
        y = np.array(y)

        # Convertir les étiquettes en vecteurs one-hot encoding
        from keras.utils import to_categorical
        y = to_categorical(y, num_classes=num_classes)

        # Entraîner le modèle avec les nouvelles images
        epochs = 10
        model.fit(X, y, epochs=epochs)

        # Évaluer le modèle
        score = model.evaluate(X, y)
        print('Test accuracy:', score[1])

        # Sauvegarder les nouveaux poids du modèle
        model.save_weights('model_custom.h5')

        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
