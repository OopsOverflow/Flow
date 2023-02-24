import { dashboard } from '@marcellejs/core';
import {
  captureWebcam,
  captureAudio,
  input,
  label,
  trainingSetBrowser,
  videoUpload,
  videoTitle,
  audioTrainingSetBrowser,
  modelParams,
  trainButton,
  progress,
  plotTraining,
  predToggle,
  plotResults,
  store,
  trainingSet,
  classifier,
  musicPlayerComponent,
  videoChart,
  emotionLegend,
  musicTitlesComponent,
  plotResultsVideo,
  songSearch,
  emotionChartVisu,
} from '.';

const dash = dashboard({
  title: 'YourFlow',
  author: 'Tony, Houssem, and Mathilde',
  closable: true,
});

dash.page('Training').sidebar(input, label).use(captureWebcam, trainingSetBrowser, plotTraining);

dash
  .page('Data Management')
  .sidebar(label, songSearch)
  .use([audioTrainingSetBrowser, emotionChartVisu]);

dash.page('Real-time Prediction').sidebar(input).use(predToggle, musicPlayerComponent, plotResults);
dash
  .page('Video Analysis')
  .sidebar(videoUpload, videoTitle)
  .use(videoChart, [musicTitlesComponent, emotionLegend], plotResultsVideo);

dash.settings.dataStores(store).datasets(trainingSet).models(classifier);

export function showDashboard() {
  dash.show();
}
