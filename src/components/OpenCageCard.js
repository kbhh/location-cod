import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Label } from '../components/Label';
import { COLORS } from '../common/constants';
import NetInfo from '@react-native-community/netinfo';
import { showToast } from '../common/utils';

const LocationCard = ({ item, onShowRoute }) => {
  const [isConnected, setIsConnected] = useState('');
  item.address = item.address ? item.address : '';
  console.log(item);
  const name = item?.infos?.locationName || '';
  const [
    neighbourhood = '',
    suburb = '',
    county = '',
    state = '',
    formatted = '',
  ] = item && item.address && item.address.split('##');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      setIsConnected(netState.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const toMapRoute = () => {
    onShowRoute();
  };
  return (
    <TouchableOpacity onPress={toMapRoute}>


      <View onPress={toMapRoute}>
        {item.address || isConnected ? (
          <View style={[styles.item, styles.address, styles.border]}>
            <Label
              label="Location Name:"
              value={name}
              titleStyle={{ color: COLORS.eshi_color }}
              valueStyle={{ color: COLORS.eshi_color }}
            />
            <Label label="Neighbourhood:" value={neighbourhood} />
            <Label label="Suburb:" value={suburb} />
            <Label label="Sub City:" value={county} />
            <Label label="State:" value={state} />
            <Label label="Address:" value={formatted} />
            <Text style={styles.navigate}>Navigate</Text>
          </View>
        ) : (
          <Text style={styles.connectionInfo}>
            Try again after turning on your mobile data to get more information
            about the location.
          </Text>
        )}
      </View>
    </TouchableOpacity>


  );
};

export default LocationCard;

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    width: '80%',
  },
  border: {
    borderRadius: 20,
    borderColor: COLORS.grey,
    borderWidth: 1,
  },
  address: {
    marginHorizontal: '5%',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '90%',
  },
  connectionInfo: {
    width: '80%',
    textAlign: 'center',
    alignSelf: 'center',
    color: COLORS.info_color,
  },
  navigate: {
    color: COLORS.eshi_color,
    textAlign: 'center',
    marginTop: 8,
    alignSelf: 'center',
  },
});
