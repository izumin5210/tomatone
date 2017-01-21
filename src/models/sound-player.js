/* @flow */
import axios from "axios";
import assert from "power-assert"; // eslint-disable-line

export default class SoundPlayer {
  static AudioContext = window.AudioContext || window.webkitAudioContext;

  uri: string;
  context: AudioContext;
  buffer: ?AudioBuffer;
  loaded: boolean

  constructor(uri: string) {
    this.uri = uri;
    this.context = new SoundPlayer.AudioContext();
    this.loaded = false;
  }

  async load(): Promise<void> {
    if (this.context.state === "closed") {
      this.context = new SoundPlayer.AudioContext();
    }
    const { data } = await axios(this.uri, { responseType: "arraybuffer" });
    this.buffer = await this.context.decodeAudioData(data);
    this.loaded = true;
  }

  play() {
    assert(this.loaded);
    assert(this.buffer != null);
    const source = this.context.createBufferSource();
    if (this.buffer != null) {
      source.buffer = this.buffer;
      source.connect(this.context.destination);
      source.start(0);
    }
  }

  async close(): Promise<void> {
    assert(this.context.state !== "closed");
    await this.context.close();
    this.buffer = null;
    this.loaded = false;
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
