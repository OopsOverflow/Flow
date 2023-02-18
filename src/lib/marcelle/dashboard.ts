import { dashboard } from '@marcellejs/core';
import { captureWebcam, captureAudio, input, label, trainingSetBrowser, audioUpload, audioTitle, audioTrainingSetBrowser,
  modelParams, trainButton, progress, plotTraining,
  predToggle, plotResults, store, trainingSet, classifier, musicPlayerComponent,
  videoChart
} from '.';

const dash = dashboard({
  title: 'YourFlow',
  author: 'Tonny, Houssem, and Mathilde',
  closable: true,
});

dash.page('Data Management').sidebar(input, audioUpload, audioTitle).use([label, captureWebcam, captureAudio], [trainingSetBrowser, audioTrainingSetBrowser]);
dash.page('Training').sidebar(trainButton, progress).use(modelParams, plotTraining);
dash.page('Real-time Prediction').sidebar(input).use(predToggle,musicPlayerComponent, plotResults);
dash.page('Video Analysis').sidebar(input).use(videoChart);

dash.settings.dataStores(store).datasets(trainingSet).models(classifier);

export function showDashboard() {
  dash.show();
}
