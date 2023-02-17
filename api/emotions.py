import numpy as np
import argparse
import matplotlib.pyplot as plt
import cv2
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import MaxPooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator,img_to_array, load_img
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# command line argument
ap = argparse.ArgumentParser()
ap.add_argument("--mode",help="train/display")
mode = ap.parse_args().mode


def predict(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = facecasc.detectMultiScale(gray,scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        # cv2.rectangle(img, (x, y-50), (x+w, y+h+10), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
        prediction = model.predict(cropped_img)
        maxindex = int(np.argmax(prediction))
        # cv2.putText(img, emotion_dict[maxindex], (x+20, y-60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

    cv2.imshow('Image', cv2.resize(img,(1600,960),interpolation = cv2.INTER_CUBIC))
    print(emotion_dict[maxindex])
    cv2.imshow('Image', img)
    return emotion_dict[maxindex]

# plots accuracy and loss curves
def plot_model_history(model_history):
    """
    Plot Accuracy and Loss curves given the model_history
    """
    fig, axs = plt.subplots(1,2,figsize=(15,5))
    # summarize history for accuracy
    axs[0].plot(range(1,len(model_history.history['accuracy'])+1),model_history.history['accuracy'])
    axs[0].plot(range(1,len(model_history.history['val_accuracy'])+1),model_history.history['val_accuracy'])
    axs[0].set_title('Model Accuracy')
    axs[0].set_ylabel('Accuracy')
    axs[0].set_xlabel('Epoch')
    axs[0].set_xticks(np.arange(1,len(model_history.history['accuracy'])+1),len(model_history.history['accuracy'])/10)
    axs[0].legend(['train', 'val'], loc='best')
    # summarize history for loss
    axs[1].plot(range(1,len(model_history.history['loss'])+1),model_history.history['loss'])
    axs[1].plot(range(1,len(model_history.history['val_loss'])+1),model_history.history['val_loss'])
    axs[1].set_title('Model Loss')
    axs[1].set_ylabel('Loss')
    axs[1].set_xlabel('Epoch')
    axs[1].set_xticks(np.arange(1,len(model_history.history['loss'])+1),len(model_history.history['loss'])/10)
    axs[1].legend(['train', 'val'], loc='best')
    fig.savefig('plot.png')
    plt.show()

# If you want to train the same model or try other models, go for this
if mode == "train":
    # Define data generators
    train_dir = 'data/train'
    val_dir = 'data/test'

    num_train = 28709
    num_val = 7178
    batch_size = 64
    num_epoch = 50

    train_datagen = ImageDataGenerator(rescale=1./255)
    val_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=(48,48),
            batch_size=batch_size,
            color_mode="grayscale",
            class_mode='categorical')

    validation_generator = val_datagen.flow_from_directory(
            val_dir,
            target_size=(48,48),
            batch_size=batch_size,
            color_mode="grayscale",
            class_mode='categorical')

    # Create the model
    model = Sequential()

    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48,48,1)))
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(1024, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(7, activation='softmax'))


    model.compile(loss='categorical_crossentropy',optimizer=Adam(lr=0.0001, decay=1e-6),metrics=['accuracy'])
    model_info = model.fit_generator(
            train_generator,
            steps_per_epoch=num_train // batch_size,
            epochs=num_epoch,
            validation_data=validation_generator,
            validation_steps=num_val // batch_size)
    plot_model_history(model_info)
    model.save_weights('model.h5')


elif mode == "retrain":
    # Charger le modèle existant
    # model.load_weights('model.h5')
    model = load_model('model_all.h5')
    

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

    for emotion_label in ['happy', 'sad', 'angry']:
        for i in range(3):
            img = load_img(f"{new_images_dir}/{emotion_label}/{i+1}.jpg", grayscale=True, target_size=(img_width, img_height))
            X.append(img_to_array(img))
            y.append(emotion_label)

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
    model.save_weights('fine_tuned_model.h5')


elif mode == "display":
    

    from flask import Flask, request
    import cv2
    # model.load_weights('model.h5')
    model = load_model('model_all.h5', compile=False)
    # prevents openCL usage and unnecessary logging messages
    cv2.ocl.setUseOpenCL(False)

    # dictionary which assigns each label an emotion (alphabetical order)
    emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}
    facecasc = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    # img = cv2.imread("exemple.jpg")
    app = Flask(__name__)

    @app.route('/', methods=['POST'])
    def receive_image():
        file = request.files['image']
        img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
        prediction = predict(img)
        # cv2.imwrite('image.jpg', img)
        return prediction
    app.run(debug=True)
    
    







    