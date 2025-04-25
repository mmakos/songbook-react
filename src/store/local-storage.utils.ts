export const saveStringToStorage = (key: string, value?: string) => {
  if (value !== undefined) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
};

export const saveObjectToStorage = (key: string, value?: object) => {
  if (value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.removeItem(key);
  }
};

export const saveSimpleToStorage = (key: string, value?: number | boolean) => {
  if (value !== undefined) {
    localStorage.setItem(key, value.toString());
  } else {
    localStorage.removeItem(key);
  }
};

export const getBoolFromStorage = (key: string): boolean | undefined => {
  const item = localStorage.getItem(key);
  return item ? item === "true" : undefined;
};

export const getStringFromStorage = (key: string): string | undefined => {
  const item = localStorage.getItem(key);
  return item ?? undefined;
};

export const getNumberFromStorage = (key: string): number | undefined => {
  const item = localStorage.getItem(key);
  if (item) {
    const n = +item;
    if (!isNaN(n)) return n;
  }
}

export const getObjectFromStorage = (key: string): object => {
  const item = localStorage.getItem(key);
  if (!item) return {};
  try {
    return JSON.parse(item);
  } catch (_) {
    return {};
  }
};
