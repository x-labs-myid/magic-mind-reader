import { EventData, Page, Frame, Observable } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';
import { TopicService } from '../shared/topic-service';
import { getAppLocale } from '../shared/locale-manager';

// Import target pages statically to ensure Webpack bundles them
import * as topicPreviewPageModule from './topic-preview-page';

let viewModel: Observable;

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  const lang = getAppLocale();
  const isIndonesian = lang === 'id';

  const animals = TopicService.getTopicById('animals');
  const vehicles = TopicService.getTopicById('vehicles');
  const plants = TopicService.getTopicById('plants');
  const foods = TopicService.getTopicById('foods');
  const sports = TopicService.getTopicById('sports');
  const brands = TopicService.getTopicById('brands');
  const numbers = TopicService.getTopicById('numbers');

  viewModel = new Observable();
  viewModel.set('animalsTitle', isIndonesian ? animals.title.id : animals.title.en);
  viewModel.set('animalsDesc', isIndonesian ? animals.description.id : animals.description.en);

  viewModel.set('vehiclesTitle', isIndonesian ? vehicles.title.id : vehicles.title.en);
  viewModel.set('vehiclesDesc', isIndonesian ? vehicles.description.id : vehicles.description.en);

  viewModel.set('plantsTitle', isIndonesian ? plants.title.id : plants.title.en);
  viewModel.set('plantsDesc', isIndonesian ? plants.description.id : plants.description.en);

  viewModel.set('foodsTitle', isIndonesian ? foods.title.id : foods.title.en);
  viewModel.set('foodsDesc', isIndonesian ? foods.description.id : foods.description.en);

  viewModel.set('sportsTitle', isIndonesian ? sports.title.id : sports.title.en);
  viewModel.set('sportsDesc', isIndonesian ? sports.description.id : sports.description.en);

  viewModel.set('brandsTitle', isIndonesian ? brands.title.id : brands.title.en);
  viewModel.set('brandsDesc', isIndonesian ? brands.description.id : brands.description.en);

  viewModel.set('numbersTitle', isIndonesian ? numbers.title.id : numbers.title.en);
  viewModel.set('numbersDesc', isIndonesian ? numbers.description.id : numbers.description.en);

  page.bindingContext = viewModel;
}

export function goBack() {
  AudioHelper.playTap();
  Frame.topmost().navigate({
    moduleName: 'main-page',
    clearHistory: true,
    animated: true,
    transition: {
      name: 'slideRight',
      duration: 300
    }
  });
}

function selectTopic(topicId: string) {
  AudioHelper.playTap();
  TopicService.setSelectedTopicId(topicId);
  Frame.topmost().navigate({
    moduleName: 'pages/topic-preview-page',
    context: { topicId: topicId },
    animated: true,
    transition: {
      name: 'slide',
      duration: 300,
      curve: 'easeInOut'
    }
  });
}

export function onSelectAnimals() {
  selectTopic('animals');
}

export function onSelectVehicles() {
  selectTopic('vehicles');
}

export function onSelectPlants() {
  selectTopic('plants');
}

export function onSelectFoods() {
  selectTopic('foods');
}

export function onSelectSports() {
  selectTopic('sports');
}

export function onSelectBrands() {
  selectTopic('brands');
}

export function onSelectNumbers() {
  selectTopic('numbers');
}
