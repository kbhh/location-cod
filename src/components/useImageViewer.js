import React, {useState} from 'react';
import {Modal, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {COLORS, DIMENS} from '../common/constants';
import ImageViewer from 'react-native-image-zoom-viewer';

const useImageViewer = () => {
  const [modalVisible, setViewerVisible] = useState(false);
  const Viewer = ({files}) => (
    <Modal visible={modalVisible} transparent={true}>
      <ImageViewer
        saveToLocalByLongPress={false}
        imageUrls={files.map((file) => {
          return {
            url: file,
          };
        })}
        onSwipeDown={() => setViewerVisible(false)}
        onClick={() => setViewerVisible(false)}
        enableSwipeDown
        enablePreload
        loadingRender={() => <ActivityIndicator />}
        renderFooter={() => (
          <Text style={styles.footerContent}>Location Picture</Text>
        )}
      />
    </Modal>
  );
  return [Viewer, setViewerVisible];
};

export default useImageViewer;

const styles = StyleSheet.create({
  footerContent: {
    color: COLORS.white,
    textAlign: 'center',
    width: DIMENS.full_width,
  },
});
