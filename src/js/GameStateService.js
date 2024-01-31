export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    console.log('save',state)
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      const state = JSON.parse(this.storage.getItem('state'));
      console.log('load',state);

      return state;
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
