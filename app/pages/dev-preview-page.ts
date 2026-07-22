import { EventData, Page, Frame, Observable, ObservableArray } from '@nativescript/core';
import { AudioHelper } from '../shared/audio-helper';
import { TopicService } from '../shared/topic-service';

let viewModel: Observable;
let currentTopicId = 'animals';

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  viewModel = new Observable();

  loadTopic('animals');

  page.bindingContext = viewModel;
}

function loadTopic(topicId: string) {
  currentTopicId = topicId;
  const topic = TopicService.getTopicById(topicId);

  const itemsArray = new ObservableArray<any>();
  for (const item of topic.items) {
    const itemData = TopicService.getItemByValue(topicId, item.value, 'en');

    itemsArray.push({
      valueStr: `#${item.value}`,
      icon: itemData.icon,
      fontClass: itemData.fontClass,
      nameEn: item.name.en,
      nameId: `ID: ${item.name.id}`
    });
  }

  viewModel.set('activeTopic', topicId);
  viewModel.set('topicItems', itemsArray);
}

export function selectTopicAnimals() {
  AudioHelper.playTap();
  loadTopic('animals');
}

export function selectTopicVehicles() {
  AudioHelper.playTap();
  loadTopic('vehicles');
}

export function selectTopicPlants() {
  AudioHelper.playTap();
  loadTopic('plants');
}

export function selectTopicFoods() {
  AudioHelper.playTap();
  loadTopic('foods');
}

export function selectTopicSports() {
  AudioHelper.playTap();
  loadTopic('sports');
}

export function selectTopicBrands() {
  AudioHelper.playTap();
  loadTopic('brands');
}

export function selectTopicNumbers() {
  AudioHelper.playTap();
  loadTopic('numbers');
}

export function goBack() {
  AudioHelper.playTap();
  Frame.topmost().navigate({
    moduleName: 'pages/about-page',
    animated: true,
    transition: {
      name: 'slideRight',
      duration: 300
    }
  });
}
