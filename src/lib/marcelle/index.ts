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

const emotionsLabel = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];

const emotionsColors = {
  Surprise: '#ffae19',
  Happy: '#ffea00',
  Neutral: '#4d8000',
  Disgust: '#f36c02',
  Sad: '#808080',
  Angry: '#b20000',
  Fear: '#000000',
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
  Neutral: [],
  Happy: [],
  Sad: [],
  Angry: [],
  Fear: [],
  Surprise: [],
  Disgust: [],
});

export const input = webcam({ width: 500, height: 500 });

const featureExtractor = mobileNet();

export const label = select(emotionsLabel);
label.title = 'Instance label';

export const videoTitle = text(`No video selected`);
videoTitle.title = 'Your uploaded video';

export const captureWebcam = button('Hold to record instances');
captureWebcam.title = 'Capture webcam instances to the training set';

export const captureAudio = button('Press to add music to the training set');
captureAudio.title = 'Capture music instances to the training set';

export const store = dataStore('localStorage');

export const trainingSet = dataset('training-set-dashboard', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);

export const audioStore = dataStore('localStorage');
export const audioTrainingSet = dataset('audio-training-set-dashboard', audioStore);

audioTrainingSet.$changes
  .filter((change) => change[0] !== undefined)
  .filter((change) => change[0].level === 'instance')
  .subscribe((change) => {
    const y_ = change[0].data.y;
    audioTrainingSet.find({ y: y_ }).then((liste) => {
      musicData.update((oldValue) => {
        // eslint-disable-next-line no-param-reassign
        oldValue[y_] = liste.data.map(function (dictionnaire) {
          return dictionnaire.x;
        });
        return oldValue;
      });
    });
  });

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

const sendToRetrain = async (img: ImageData) => {
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
  formData.append('label', label.$value.value);

  const res = await fetch('http://localhost:5000/retrain', {
    method: 'POST',
    body: formData,
  });

  return res.json();
};

input.$images
  .filter(() => captureWebcam.$pressed.value)
  .subscribe(async (img) => {
    const res = await sendToRetrain(img);
    console.log(res);
    const { status } = res;

    if (status === 'success') {
      // eslint-disable-next-line no-alert
      alert(`Successfully added ${label.$value.value} instance to training set`);
    }
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
    { label: emotionsLabel[1], start: 10, end: 30 },
    { label: emotionsLabel[2], start: 30, end: 50 },
    { label: emotionsLabel[3], start: 50, end: 60 },
    { label: emotionsLabel[4], start: 60, end: 100 },
    { label: emotionsLabel[5], start: 100, end: 120 },
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
    title: 'My '+ emotionsLabel[0] +' song',
  },
  {
    label: emotionsLabel[1],
    title: 'My '+ emotionsLabel[1] +' song',
  },
  {
    label: emotionsLabel[2],
    title: 'My '+ emotionsLabel[2] +' song',
  },
  {
    label: emotionsLabel[3],
    title: 'My '+ emotionsLabel[3] +' song',
  },
  {
    label: emotionsLabel[4],
    title: 'My '+ emotionsLabel[4] +' song',
  },
  {
    label: emotionsLabel[5],
    title: 'My '+ emotionsLabel[5] +' song',
  },
  {
    label: emotionsLabel[6],
    title: 'My '+ emotionsLabel[6] +' song',
  },
]);

export const videoChart = videoVisu(video, emotions.colors);
//Call to change the video
//setVideo(newVideo);

export const emotionLegend = colorLegend(emotions);

export const musicTitlesComponent = listVisu(videoChart.currentLabel, musicTitles);

export const plotResultsVideo = confidencePlot($predictions);

export const songSearch = spotifySearch(audioTrainingSet);

const postVideo = async (videoFile: File) => {
  const formData = new FormData();
  formData.append('file', videoFile);

  const res = await fetch('http://localhost:5000/segment', {
    method: 'POST',
    body: formData,
  });

  const response = await res.json();
  return response;
};

let videoResult = null as {
  segment_emotions: string[];
  segment_accuracy: number[];
  time: number;
};
export const videoUpload = fileUpload();
videoUpload.title = 'Upload your video file';
videoUpload.$files.subscribe(async (x) => {
  videoTitle.$value.set(x[0].name);
  videoResult = await postVideo(x[0]);

  const newVideo = {
    name: 'My video',
    length: videoResult?.segment_emotions.length || 0,
    parts: videoResult?.segment_emotions.map((emotion, index) => ({
      label: emotion as (typeof emotionsLabel)[number],
      start: index * 120,
      end: (index + 1) * 120,
    })),
  };

  if (videoResult) {
    videoChart.setVideo(newVideo);
  }
});
