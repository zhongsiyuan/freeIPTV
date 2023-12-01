import { useEffect } from 'react';

import LiveAudioStream from 'react-native-live-audio-stream';

export default ({ recordRef }) => {
  // useEffect(() => {
  //   LiveAudioStream.init({
  //     sampleRate: 32000, // default is 44100 but 32000 is adequate for accurate voice recognition
  //     channels: 1, // 1 or 2, default 1
  //     bitsPerSample: 16, // 8 or 16, default 16
  //     audioSource: 6, // android only (see below)
  //     bufferSize: 4096, // default is 2048
  //   });
  //   LiveAudioStream.start();
  //
  //   LiveAudioStream.on('data', (data) => {
  //     // base64-encoded audio data chunks
  //     console.log(data, 'data');
  //   });
  //
  //   // eslint-disable-next-line no-param-reassign
  //   recordRef.current = () => {
  //     console.log('rcc')
  //     LiveAudioStream.start();
  //
  //     setTimeout(() => {
  //       LiveAudioStream.stop();
  //     }, 3000);
  //   };
  // }, []);
};
