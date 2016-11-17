import { ipcMain }      from "electron";
import { Map }          from "immutable";
import PromisedReducer  from "promised-reducer";

const initialState = Map({
});

export default class Reducer {
  constructor() {
    this.reducer = new PromisedReducer(initialState);
  }

  connect(onUpdate) {
    this.reducer.on(":update", state => onUpdate(state.toJS()));

    ipcMain.on("initialize", () => this.update(state => state));
  }

  disconnect() {
    // do nothing
  }

  update(fn) {
    this.reducer.update(fn);
  }

  get state() {
    return this.reducer.state;
  }
}
