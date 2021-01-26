import faker from 'faker/locale/en_US';
// @ts-ignore
import * as ml5 from 'ml5';

const GIPHY_API_KEY = 'Tne7LiT79HXXntOhyyXPzSDDuBAYMbJP';
const BASE_API_URL = 'https://api.giphy.com/v1/gifs/random?';
const TAGS = ['cars', 'apple', 'google', 'mountains', 'coffee', 'resort'];
const gifContainer = document.querySelector('#gifcontainer');

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

const classifyImage = (imageElement: HTMLImageElement) => {
  classifier.classify(imageElement, (err: Error, results: Array<any>) => {
    if (err) throw err;
    results = results.map((tag) => tag?.label);
    console.log('Predicted keywords: ', results);
  });
};

const renderGIF = async () => {
  try {
    const imageElement = document.createElement('img');
    imageElement.src = await getRandomGIF();
    imageElement.crossOrigin = 'anonymous';
    imageElement.addEventListener('load', () => {
      classifyImage(imageElement);
    });
    gifContainer.innerHTML = '';
    gifContainer.appendChild(imageElement);
  } catch (ex) {
    console.error(ex);
  }
};
