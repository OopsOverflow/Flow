import '@marcellejs/core/dist/marcelle.css';
import { mobileNet, datasetBrowser, button, dataset, dataStore, textInput, webcam, text, datasetTable,
  mlpClassifier, modelParameters, trainingProgress, trainingPlot,
  confidencePlot, toggle, fileUpload

} from '@marcellejs/core';


// -----------------------------------------------------------
// DATA MANAGEMENT
// -----------------------------------------------------------


export const input = webcam();

const featureExtractor = mobileNet();

export const label = textInput();
label.title = 'Instance label';

export const audioTitle = text(
  `No music selected`,
);
audioTitle.title = 'Music title';

export const audioUpload = fileUpload();
audioUpload.$files.subscribe((x) => console.log('fileUpload $files:', x));
audioUpload.title = 'Upload audio files';
audioUpload.$files.subscribe((x) => audioTitle.$value.set(x[0].name));

export const captureWebcam = button('Hold to record instances');
captureWebcam.title = 'Capture webcam instances to the training set';

export const captureAudio = button('Hold to record instances');
captureAudio.title = 'Capture music instances to the training set';

export const store = dataStore('localStorage');
//export const trainingSet = dataset<ImageData, string>('training-set-dashboard', store);
export const trainingSet = dataset('training-set-dashboard', store);
export const trainingSetBrowser = datasetBrowser(trainingSet);

export const audioStore = dataStore('localStorage');
export const audioTrainingSet = dataset('audio-training-set-dashboard', audioStore);
/*export const audioTrainingSetBrowser = datasetTable(audioTrainingSet, [
  'name',
]);
*/
export const audioTrainingSetBrowser = datasetTable(audioTrainingSet);

/*input.$images
  .filter(() => capture.$pressed.value)
  .map((x) => ({ x, y: label.$value.value, thumbnail: input.$thumbnails.value }))
  .subscribe(trainingSet.create);
  */

  captureAudio.$pressed.subscribe(() => console.log('audioTrainingSet button:', audioTrainingSet.$count.value));
 
input.$images
  .filter(() => captureWebcam.$pressed.value)
  .map(async (img) => ({ x: await featureExtractor.process(img), y: label.$value.value, thumbnail: input.$thumbnails.value }))
  .awaitPromises()
  .subscribe(trainingSet.create);

  

  audioUpload.$files
  .filter(() => captureAudio.$pressed.value) //problem here ? test of log in suscribe does not work. Nothing in training set when replaced with audioTrainingSet.create;
  .map((file) => ({ x: file[0].name, y: label.$value.value }))
  .awaitPromises()
  .subscribe(() => console.log('test audio upload'));

  function testAndLog(){
    console.log('test and log');
    console.log('audioTrainingSet:', audioTrainingSet.items.toString());
    audioTrainingSet.create;
    //(file) => audioTrainingSet.create(file)
    console.log('audioFile:', audioUpload.$files);
    console.log('audioTrainingSet:', audioTrainingSet.items.toString());
  }

  /*const instancesTest = await audioTrainingSet
  .items() // get iterable
  .query({ y: 'sad' }) // query instances with label 'A'
  .select(['id', 'thumbnail', 'name', 'x', 'y']) // select the fields to return
  .toArray(); // convert to array


  captureAudio.$pressed.subscribe(() => console.log('audioTrainingSet[sad]:', instancesTest));
  */

  /*const instancesTest = await trainingSet
  .items() // get iterable  //TypeError: this.instanceService is undefined in manifest.js:18:41
  .toArray(); // convert to array

  captureWebcam.$pressed.subscribe(() => console.log('trainingSet[sad]:', instancesTest));
*/
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