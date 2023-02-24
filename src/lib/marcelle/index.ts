import '@marcellejs/core/dist/marcelle.css';
import {
  mobileNet,
  datasetBrowser,
  button,
  dataset,
  dataStore,
  select,
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
import {
  musicPlayer,
  videoVisu,
  colorLegend,
  listVisu,
  spotifySearch,
  emotionChart,
} from './components';
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

/**
 * All the music titles from the dataset
 * Edit this object with set() to change the music data (! replace old data))
 * Currently is dummy data
 */
const musicData = writable({
  alert: ['My alert song 1', 'My alert song 2', 'My alert song 3'],
  excited: ['My excited song 1', 'My excited song 2'],
  elated: ['My elated song 1', 'My elated song 2', 'My elated song 3'],
  happy: ['My happy song 1', 'My happy song 2', 'My happy song 3', 'My happy song 4'],
  contented: [
    'My contented song 1',
    'My contented song 2',
    'My contented song 3',
    'My contented song 4',
  ],
  nervous: ['My nervous song 1', 'My nervous song 2', 'My nervous song 3'],
  relaxed: ['My relaxed song 1', 'My relaxed song 2'],
});

export const input = webcam({ width: 500, height: 500 });

const featureExtractor = mobileNet();

export const label = select(emotionsLabel);
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

function dataURLtoFile(dataurl, filename) {
  // eslint-disable-next-line prefer-const
  let arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const getEmotion = async (img: ImageData) => {
  console.log(img.height, img.width);
  // convert imageData to file
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext('2d');
  context.putImageData(img, 0, 0);

  // Convert the canvas data to Base64
  const base64Image = canvas.toDataURL();

  // Convert the Base64 data to a file
  const file = dataURLtoFile(base64Image, 'image.png');

  // append file to form data
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    body: formData,
  });

  const { emotion, accuracy } = await res.json();
  return { emotion, accuracy };
};

input.$images
  .filter(() => captureWebcam.$pressed.value)
  .subscribe(async (img) => {
    const emotion = await getEmotion(img);
    trainingSet.create({
      x: await featureExtractor.process(img),
      y: emotion.emotion,
      thumbnail: input.$thumbnails.value,
    });
  });

captureAudio.$click.sample(audioUpload.$files).subscribe((x) => {
  audioTrainingSet
    .create({
      x: x[0].name,
      y: label.$value.value,
    })
    .then((r) => console.log(r));
});

await trainingSet.ready;

captureWebcam.$pressed.subscribe((x) => {
  if (x) {
    captureWebcam.title = 'Stop recording';
  } else {
    captureWebcam.title = 'Hold to record instances';
  }
});

//captureAudio.$pressed.subscribe(() => console.log('audioFile:', audioUpload.$files));

//For dataset table, try to create a view dataset which sift the dataset to only show specific labels
//https://marcelle.dev/api/data-storage.html#sift
//https://marcelle.dev/api/components/data-displays.html#datasettable
//https://echarts.apache.org/en/index.html
//https://echarts.apache.org/examples/en/editor.html?c=line-polar&lang=js


export const emotionChartVisu = emotionChart(musicData, emotionsColors);

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

//Currently dummy title. Change with the music title of the audio file
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

/**
 * Specific data from the video analysed
 * Edit this object with set() to change the music data (! replace old data))
 * Currently is dummy data
 */
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

export const songSearch = spotifySearch();
