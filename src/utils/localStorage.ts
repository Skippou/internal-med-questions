export function saveToLocalStorage(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log('Saved to localStorage:', key, value);
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const value = localStorage.getItem(key);
    console.log('Read from localStorage:', key, value);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error('Failed to read from localStorage:', e);
    return defaultValue;
  }
}
