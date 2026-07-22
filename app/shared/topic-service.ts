import { ApplicationSettings } from '@nativescript/core';
import * as animalsJson from '../data/topics/animals.json';
import * as vehiclesJson from '../data/topics/vehicles.json';
import * as plantsJson from '../data/topics/plants.json';
import * as foodsJson from '../data/topics/foods.json';
import * as sportsJson from '../data/topics/sports.json';
import * as brandsJson from '../data/topics/brands.json';
import * as numbersJson from '../data/topics/numbers.json';

export interface TopicItem {
  value: number;
  icon: string;
  fontClass?: string;
  name: {
    en: string;
    id: string;
  };
}

export interface TopicData {
  id: string;
  icon: string;
  title: {
    en: string;
    id: string;
  };
  description: {
    en: string;
    id: string;
  };
  items: TopicItem[];
}

const topicsMap: Record<string, TopicData> = {
  animals: animalsJson as TopicData,
  vehicles: vehiclesJson as TopicData,
  plants: plantsJson as TopicData,
  foods: foodsJson as TopicData,
  sports: sportsJson as TopicData,
  brands: brandsJson as TopicData,
  numbers: numbersJson as TopicData
};

export class TopicService {
  public static getSelectedTopicId(): string {
    return ApplicationSettings.getString('selected_topic', 'animals');
  }

  public static setSelectedTopicId(topicId: string): void {
    if (topicId && topicsMap[topicId]) {
      ApplicationSettings.setString('selected_topic', topicId);
    }
  }

  public static getAllTopics(): TopicData[] {
    return Object.values(topicsMap);
  }

  public static getTopicById(topicId: string): TopicData {
    return topicsMap[topicId] || topicsMap[this.getSelectedTopicId()] || topicsMap['animals'];
  }

  public static getItemByValue(topicId: string, value: number, lang: string): { icon: string; name: string; value: number; fontClass: string } {
    const topic = this.getTopicById(topicId);
    const item = topic.items.find((i) => i.value === value) || topic.items[0];

    const isIndonesian = lang === 'id';
    const name = isIndonesian ? item.name.id : item.name.en;
    const fontClass = item.fontClass || (topicId === 'brands' ? 'fab' : 'fas');

    return {
      icon: item.icon,
      name: name,
      value: item.value,
      fontClass: fontClass
    };
  }
}
