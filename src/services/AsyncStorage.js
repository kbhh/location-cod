import AsyncStorage from '@react-native-async-storage/async-storage';
const AsyncStorageKey = 'PLUS_CODES';

class AccessAsyncStore {
  constructor() {
    this.data = null;
    this.initialCall();
  }

  initialCall = () => {
    AsyncStorage.getItem(AsyncStorageKey)
      .then((data) => {
        if (data) this.data = JSON.parse(data);
      })
      .catch((err) => console('Error initializing asyncStore', err));
  };

  get() {
    return new Promise((next, error) => {
      if (this.data) return next(this.data);
      AsyncStorage.getItem(AsyncStorageKey)
        .then((data) => {
          if (data) {
            this.data = JSON.parse(data);
            next(this.data);
          } else {
            next(null);
          }
        })
        .catch((err) => error(err));
    });
  }

  set(data) {
    return new Promise((next, error) => {
      let dataHolder = data;
      if (data) {
        this.data = data;
        if (typeof dataHolder !== 'string')
          dataHolder = JSON.stringify(dataHolder);

        AsyncStorage.setItem(AsyncStorageKey, dataHolder)
          .then(() => {
            next(data);
          })
          .catch((err) => error(err));
      } else {
        error('Error encountered while storing data to asyncStore.');
      }
    });
  }

  clear() {
    this.data = null;
    return AsyncStorage.removeItem(AsyncStorageKey);
  }
}

export default new AccessAsyncStore();
