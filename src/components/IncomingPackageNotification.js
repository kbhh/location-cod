import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../common/constants';

export default function IncomingPackageNotification(props) {
  return (
    <Modal visible={props.visible} style={styles.modal} transparent>
      <View style={styles.modalContentContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.description}>
            A delivery package is on it's way to you
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={props.onViewItemDetail}>
            <Icon
              name="ios-archive"
              type="ionicon"
              style={styles.buttonIcon}
              color={COLORS.eshi_color}
            />
            <Text style={styles.buttonText}>Tap here for details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const transparent = 'rgba(0,0,0,0.5)';
const white = '#fff';

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
  modalContent: {
    backgroundColor: white,
    padding: 30,
    borderRadius: 15,
    justifyContent: 'center',
    margin: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderBottomColor: COLORS.eshi_color,
    borderBottomWidth: 1,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  description: {
    fontSize: 22,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.eshi_color,
    paddingTop: 20,
  },
  buttonIcon: {
    fontSize: 17,
    color: COLORS.eshi_color,
    marginRight: 10,
  },
  buttonText: {
    color: COLORS.eshi_color,
    fontSize: 15,
  },
});
