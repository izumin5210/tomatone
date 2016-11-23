/* @flow */
export default class SoundPlayer {
  static AudioContext = window.AudioContext || window.webkitAudioContext;

  uri: string;
  context: AudioContext;
  buffer: AudioBuffer;

  constructor(uri: string) {
    this.uri = uri;
    this.context = new SoundPlayer.AudioContext();
  }

  fetch(): Promise<AudioBuffer> {
    return fetch(this.uri)
      .then(res => res.arrayBuffer())
      .then(data => this.context.decodeAudioData(data))
      .then(buf => (this.buffer = buf));
  }

  play() {
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.context.destination);
    source.start(0);
  }
}
