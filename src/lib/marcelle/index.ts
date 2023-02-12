import '@marcellejs/core/dist/marcelle.css';
import { mobileNet, datasetBrowser, button, dataset, dataStore, textInput, webcam,
  mlpClassifier, modelParameters, trainingProgress, trainingPlot,
  confidencePlot, toggle

} from '@marcellejs/core';


// -----------------------------------------------------------
// DATA MANAGEMENT
// -----------------------------------------------------------


export const input = webcam();

const featureExtractor = mobileNet();

export const label = textInput();
label.title = 'Instance label';
export const capture = button('Hold to record instances');
capture.title = 'Capture instances to the training set';

export const store = dataStore('localStorage');
export const trainingSet = dataset<ImageData, string>('training-set-dashboard', store);
//const trainingSet = dataset('training-set-dashboard', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);

input.$images
  .filter(() => capture.$pressed.value)
  .map((x) => ({ x, y: label.$value.value, thumbnail: input.$thumbnails.value }))
  .subscribe(trainingSet.create);


/*input.$images
  .filter(() => capture.$pressed.value)
  .map(async (img) => ({ x: await featureExtractor.process(img), y: label.$value.value, thumbnail: input.$thumbnails.value }))
  .awaitPromises()
  .subscribe(trainingSet.create);
  */



// -----------------------------------------------------------
// TRAINING
// -----------------------------------------------------------

export const trainButton = button('Train');
trainButton.title = 'Train the model';

//TODO: Temporary classifier, change with custom classifier
export const classifier = mlpClassifier({ layers: [64, 32], epochs: 20 }).sync(
  store,
  'training-set-dashboard',
);
trainButton.$click.subscribe(() => classifier.train(trainingSet));

export const modelParams = modelParameters(classifier);
export const progress = trainingProgress(classifier);
export const plotTraining = trainingPlot(classifier);


// -----------------------------------------------------------
// REAL-TIME PREDICTION
// -----------------------------------------------------------

export const predToggle = toggle('toggle prediction');

const $predictions = input.$images
  .filter(() => predToggle.$checked.get())
  .map(async (img) => classifier.predict(await featureExtractor.process(img)))
  .awaitPromises();


export const plotResults = confidencePlot($predictions);