import '@marcellejs/core/dist/marcelle.css';
import {
  mobileNet,
  datasetBrowser,
  button,
  dataset,
  dataStore,
  textInput,
  webcam,
  text,
  datasetTable,
  mlpClassifier,
  modelParameters,
  trainingProgress,
  trainingPlot,
  confidencePlot,
  toggle,
  fileUpload,
} from '@marcellejs/core';
import { musicPlayer, videoVisu, colorLegend, listVisu } from './components';
import { writable } from 'svelte/store';

// -----------------------------------------------------------
// DATA MANAGEMENT
// -----------------------------------------------------------

const emotionsLabel = [
  'alert',
  'excited',
  'elated',
  'happy',
  'contented',
  'serene',
  'relaxed',
  'calm',
  'bored',
  'sluggish',
  'depressed',
  'sad',
  'upset',
  'stressed',
  'nervous',
  'tense',
];

const emotionsColors = {
  alert: '#e59400',
  excited: '#ffae19',
  elated: '#ffc966',
  happy: '#ffea00',
  contented: '#b7cc99',
  serene: '#94b266',
  relaxed: '#5e8c19',
  calm: '#4d8000',
  bored: '#cccccc',
  sluggish: '#b2b2b2',
  depressed: '#999999',
  sad: '#808080',
  upset: '#b20000',
  stressed: '#ff0000',
  nervous: '#ff7f7f',
  tense: '#ffb2b2',
};

export const emotions = {
  labels: emotionsLabel,
  colors: emotionsColors,
};

export const input = webcam();

const featureExtractor = mobileNet();

export const label = textInput();
label.title = 'Instance label';

export const audioTitle = text(`No music selected`);
audioTitle.title = 'Music title';

export const audioUpload = fileUpload();
audioUpload.title = 'Upload audio files';
audioUpload.$files.subscribe((x) => audioTitle.$value.set(x[0].name));

export const captureWebcam = button('Hold to record instances');
captureWebcam.title = 'Capture webcam instances to the training set';

export const captureAudio = button('Press to add music to the training set');
captureAudio.title = 'Capture music instances to the training set';

export const store = dataStore('localStorage');

export const trainingSet = dataset('training-set-dashboard', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);

export const audioStore = dataStore('localStorage');
export const audioTrainingSet = dataset('audio-training-set-dashboard', audioStore);

export const audioTrainingSetBrowser = datasetTable(audioTrainingSet);

/*input.$images
  .filter(() => captureWebcam.$pressed.value)
  .map((x) => ({ x, y: label.$value.value, thumbnail: input.$thumbnails.value }))
  .subscribe(trainingSet.create);
  */

input.$images
  .filter(() => captureWebcam.$pressed.value)
  .map(async (img) => ({
    x: await featureExtractor.process(img),
    y: label.$value.value,
    thumbnail: input.$thumbnails.value,
  }))
  .awaitPromises()
  .subscribe(trainingSet.create);

captureAudio.$click.sample(audioUpload.$files).subscribe((x) => {
  audioTrainingSet
    .create({
      x: x[0].name,
      y: label.$value.value,
    })
    .then((r) => console.log(r));
});

await trainingSet.ready;

const instancesTest = await trainingSet
  .items() // get iterable  //TypeError: this.instanceService is undefined in manifest.js:18:41
  .toArray(); // convert to array

captureWebcam.$pressed.subscribe(() => console.log('trainingSet[sad]:', instancesTest));

//captureAudio.$pressed.subscribe(() => console.log('audioFile:', audioUpload.$files));

//For dataset table, try to create a view dataset which sift the dataset to only show specific labels
//https://marcelle.dev/api/data-storage.html#sift
//https://marcelle.dev/api/components/data-displays.html#datasettable
//https://echarts.apache.org/en/index.html
//https://echarts.apache.org/examples/en/editor.html?c=line-polar&lang=js

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

export const musicPlayerComponent = musicPlayer(new Audio(), 'The perfect music for my mood :)');

// -----------------------------------------------------------
// VIDEO REAL-TIME PREDICTION
// -----------------------------------------------------------

const video = {
  name: 'My video',
  length: 120,
  parts: [
    { label: emotionsLabel[0], start: 0, end: 10 },
    { label: emotionsLabel[2], start: 10, end: 30 },
    { label: emotionsLabel[6], start: 30, end: 50 },
    { label: emotionsLabel[14], start: 50, end: 60 },
    { label: emotionsLabel[1], start: 60, end: 100 },
    { label: emotionsLabel[10], start: 100, end: 120 },
  ],
};

const musicTitles = writable([
  {
    label: emotionsLabel[0],
    title: 'My alert song',
  },
  {
    label: emotionsLabel[2],
    title: 'My elated song',
  },
  {
    label: emotionsLabel[6],
    title: 'My relaxed song',
  },
  {
    label: emotionsLabel[14],
    title: 'My nervous song',
  },
  {
    label: emotionsLabel[1],
    title: 'My excited song',
  },
  {
    label: emotionsLabel[10],
    title: 'My depressed song',
  },
]);

export const videoChart = videoVisu(video, emotions.colors);
//Call to change the video
//setVideo(newVideo);

export const emotionLegend = colorLegend(emotions);

export const musicTitlesComponent = listVisu(videoChart.currentLabel, musicTitles);

export const plotResultsVideo = confidencePlot($predictions);
