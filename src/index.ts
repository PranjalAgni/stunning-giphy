import faker from 'faker/locale/en_US';
// @ts-ignore
import * as ml5 from 'ml5';

const GIPHY_API_KEY = 'Tne7LiT79HXXntOhyyXPzSDDuBAYMbJP';
const BASE_API_URL = 'https://api.giphy.com/v1/gifs/random?';
const TAGS = ['cars', 'apple', 'google', 'mountains', 'coffee', 'resort'];
const gifContainer = document.querySelector('#gifcontainer');

interface IGIPHY {
  label: string;
  confidence: number;
}

const modelLoaded = () => {
  console.log('Model loaded....');
  setInterval(renderGIF, 5000);
};

const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

const getRandomTag1 = () => {
  const randomIndex = Math.floor(Math.random() * TAGS.length);
  return TAGS[randomIndex];
};

const getRandomTag = () => {
  return faker.random.word();
};

const getRandomGIF = async (): Promise<string> => {
  const randomTag = getRandomTag();
  console.log('Actual keyword: ', randomTag);
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    rating: 'G',
    tag: randomTag,
  });
  const API_URL = `${BASE_API_URL}${params}`;

  const response = await fetch(API_URL);
  const { data } = await response.json();
  return data['image_url'];
};

const classifyImage = async (
  imageElement: HTMLImageElement
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    classifier.classify(imageElement, (err: Error, results: Array<IGIPHY>) => {
      if (err) reject(err);
      const tags = results.map((tag) => tag?.label);
      resolve(tags);
    });
  });
};

const renderGIF = async () => {
  try {
    const imageElement = document.createElement('img');
    imageElement.src = await getRandomGIF();
    imageElement.crossOrigin = 'anonymous';
    imageElement.addEventListener('load', async () => {
      try {
        const results = await classifyImage(imageElement);
        console.log('Predicted array: ', results);
      } catch (ex) {
        console.error(ex);
      }
    });
    gifContainer.innerHTML = '';
    gifContainer.appendChild(imageElement);
  } catch (ex) {
    console.error(ex);
  }
};
