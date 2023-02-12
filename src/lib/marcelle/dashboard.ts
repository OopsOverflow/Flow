import { dashboard } from '@marcellejs/core';
import { capture, input, label, trainingSetBrowser,
  modelParams, trainButton, progress, plotTraining,
  predToggle, plotResults, store, trainingSet, classifier
} from '.';

const dash = dashboard({
  title: 'YourFlow',
  author: 'Tonny, Houssem, and Mathilde',
  closable: true,
});

dash.page('Data Management').sidebar(input).use([label, capture], trainingSetBrowser);
dash.page('Training').sidebar(trainButton, progress).use(modelParams, plotTraining);
dash.page('Real-time Prediction').sidebar(input).use(predToggle, plotResults);
dash.settings.dataStores(store).datasets(trainingSet).models(classifier);

export function showDashboard() {
  dash.show();
}
