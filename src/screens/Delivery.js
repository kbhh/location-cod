import React from 'react';
import {Header, Icon, ListItem, Avatar} from 'react-native-elements';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLORS} from '../common/constants';
import {useSelector} from 'react-redux';

export default function Delivery({navigation}) {
  const user = useSelector((state) => state.user.user);
  console.log(navigation);
  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.toggleDrawer();
              console.log('rsadfnsalf');
            }}>
            <Icon
              name="ios-menu"
              type="ionicon"
              style={styles.icon}
              color={COLORS.eshi_color}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <View style={styles.centerComponent}>
            <Text style={styles.headerTitle}>{'Delivery'}</Text>
          </View>
        }
        containerStyle={styles.toolbar}
      />
      {!user ? (
        <View style={styles.notRegisteredContainer}>
          <Text style={styles.notRegisteredText}>
            You are not registered yet.
          </Text>
        </View>
      ) : (
        <View style={styles.notRegisteredContainer}>
          <Text style={styles.notRegisteredText}>
            You have not received delivery package yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  toolbar: {
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.eshi_color,
    fontSize: 18,
    marginLeft: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  notRegisteredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  notRegisteredText: {
    fontSize: 17,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
