import { navigate } from '@reach/router';

export const APP_NAME = '文档管理';
export const ALT_IMAGE_URL =
  'https://static.productionready.io/images/smiley-cyrus.jpg';

export function getLocalStorageValue(key: string) {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, JSON.stringify(value));
}


export function routeJump(to: string) {
  navigate(to);
}