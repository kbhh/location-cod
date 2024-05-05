import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {COLORS, DIMENS} from '../common/constants';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RECORDING_STAUTSES = {
  NOT_STARTED: 0,
  RECORDING: 1,
  FINISHED: 2,
};

const PLAYING_STAUTSES = {
  NOT_STARTED: 0,
  PLAYING: 1,
  PAUSED: 2,
  FINISHED: 3,
};

const Audio = (props) => {
  const {uri, onAudioSelected} = props;
  const [recordingStatus, setRecordingStatus] = useState(
    RECORDING_STAUTSES.NOT_STARTED,
  );
  const [playingStatus, setPlayingStatus] = useState(
    PLAYING_STAUTSES.NOT_STARTED,
  );
  const [filePath, setFilePath] = useState('');
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [duration, setDuration] = useState('00:00:00');
  const [playTime, setPlayTime] = useState('00:00:00');

  const handleStartRecording = () => {
    onStartRecord();
    setRecordingStatus(RECORDING_STAUTSES.RECORDING);
  };

  const handleStopRecording = () => {
    onStopRecord();
    setRecordingStatus(RECORDING_STAUTSES.FINISHED);
  };

  const handleStartPlaying = () => {
    onStartPlay();
    setPlayingStatus(PLAYING_STAUTSES.PLAYING);
  };

  const handlePausePlaying = () => {
    onPausePlay();
    setPlayingStatus(PLAYING_STAUTSES.PAUSED);
  };

  const handleStopPlaying = () => {
    onStopPlay();
    setPlayingStatus(PLAYING_STAUTSES.FINISHED);
  };

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    console.log(' on START Record ');
    const path = Platform.select({
      ios: `${new Date().getTime().toString()}.mp4`,
      android: `sdcard/${new Date().getTime().toString()}.mp4`,
    });
    setFilePath(path);
    audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.current_position);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      if (Math.floor(e.current_position) >= 58800) {
        handleStopRecording();
      }
    });
  };

  const onStopRecord = () => {
    console.log(' on STOP Record ');
    audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    onAudioSelected(filePath);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    await audioRecorderPlayer.startPlayer(filePath ? filePath : uri);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        setPlayingStatus(PLAYING_STAUTSES.FINISHED);
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
      }
      setCurrentPositionSec(e.current_position);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      return;
    });
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <View style={styles.container}>
      {!uri && (
        <View>
          {(recordingStatus === RECORDING_STAUTSES.NOT_STARTED || !uri) &&
            recordingStatus !== RECORDING_STAUTSES.RECORDING && (
              <TouchableOpacity
                style={styles.voiceRecorder}
                onPress={handleStartRecording}>
                <Icon
                  name="microphone"
                  type="simple-line-icon"
                  color={COLORS.eshi_color}
                  size={35}
                />
              </TouchableOpacity>
            )}
          {recordingStatus === RECORDING_STAUTSES.RECORDING && (
            <TouchableOpacity
              style={styles.voiceRecorder}
              onPress={handleStopRecording}>
              <Icon name="stop" color={COLORS.eshi_color} size={35} />
            </TouchableOpacity>
          )}
          {recordingStatus === RECORDING_STAUTSES.RECORDING && (
            <Text style={styles.txtRecordCounter}>{recordTime}</Text>
          )}
        </View>
      )}

      {uri && (
        <View>
          {(uri ||
            playingStatus === PLAYING_STAUTSES.NOT_STARTED ||
            playingStatus === PLAYING_STAUTSES.PAUSED ||
            playingStatus === PLAYING_STAUTSES.FINISHED) &&
            playingStatus !== PLAYING_STAUTSES.PLAYING && (
              <TouchableOpacity
                style={styles.voiceRecorder}
                onPress={handleStartPlaying}>
                <Icon name="play-arrow" color={COLORS.eshi_color} size={35} />
              </TouchableOpacity>
            )}
          {playingStatus === PLAYING_STAUTSES.PLAYING && (
            <TouchableOpacity
              style={styles.voiceRecorder}
              onPress={handlePausePlaying}>
              <Icon name="pause" color={COLORS.eshi_color} size={35} />
            </TouchableOpacity>
          )}

          {
            <Text style={styles.txtCounter}>
              {playTime} / {duration}
            </Text>
          }
        </View>
      )}
    </View>
  );
};

export default Audio;

const styles = StyleSheet.create({
  voiceRecorder: {
    borderRadius: Math.round(DIMENS.full_width + DIMENS.full_height) / 2,
    width: DIMENS.full_width * 0.15,
    height: DIMENS.full_width * 0.15,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.eshi_color,
    marginTop: 8,
  },
});
