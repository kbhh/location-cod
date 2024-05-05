import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../common/constants';

export default function Drawer(props) {
  console.log(props);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../assets/images/icon3.png')}
        />
      </View>
      <TouchableOpacity
        style={styles.drawerListItem}
        onPress={() => props.navigation.navigate('Landing')}>
        <Icon
          style={styles.drawerListItemIcon}
          name="ios-home"
          type="ionicon"
          size={20}
          iconStyle={props.state.index === 0 && styles.active}
        />
        <Text
          style={[
            styles.drawerListItemLabel,
            props.state.index === 0 && styles.active,
          ]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerListItem}
        onPress={() => props.navigation.navigate('Account')}>
        <Icon
          style={styles.drawerListItemIcon}
          name="ios-person"
          type="ionicon"
          size={20}
          iconStyle={props.state.index === 1 && styles.active}
        />
        <Text
          style={[
            styles.drawerListItemLabel,
            props.state.index === 1 && styles.active,
          ]}>
          Account
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.drawerListItem}
        onPress={() => props.navigation.navigate('Delivery')}>
        <Icon
          style={styles.drawerListItemIcon}
          name="ios-archive"
          type="ionicon"
          size={20}
          iconStyle={props.state.index === 2 && styles.active}
        />
        <Text
          style={[
            styles.drawerListItemLabel,
            props.state.index === 2 && styles.active,
          ]}>
          Delivery
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

const transparent = 'rgba(0,0,0,0.1)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    marginBottom: 15,
  },
  drawerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
    marginHorizontal: 15,
    borderBottomColor: transparent,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  drawerListItemIcon: {
    marginRight: 10,
    fontSize: 17,
  },
  drawerListItemLabel: {
    color: COLORS.black,
  },
  logo: {
    margin: 30,
    width: 200,
    height: 200,
  },
  active: {
    color: COLORS.eshi_color,
  },
});
