import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { SearchBar } from 'react-native-elements';
import { COLORS } from '../common/constants';
import AccessStore from '../services/AsyncStorage';
import { useNavigation } from '@react-navigation/native';

const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Image
      style={{ width: 15, height: 15 }}
      source={require('../assets/images/4dots.png')}
    />
    <View style={styles.itemContent}>
      <Text style={styles.title}>
        {(item && item.infos && item.infos.locationName) || 'NA'}
      </Text>
      {
        item.infos.phoneNumber ? (<Text style={styles.textContent}>{item.infos.phoneNumber}</Text>) : null
      }
    </View>
  </TouchableOpacity>
);

const Locations = ({ setIsPanelActive }) => {
  const navigation = useNavigation();

  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');

  const toDetials = (location) => {
    setIsPanelActive(false);
    navigation.navigate('Location', {
      receivedLocation: location,
      from: 'Locations',
    });
  };
  const renderItem = ({ item }) => {
    return (
      <Item item={item} onPress={() => toDetials(item)} style={styles.item} />
    );
  };

  const restoreLocations = async () => {
    const STORE = (await AccessStore.get()) || { locations: [] };

    const hasStoredCredentials =
      STORE && STORE.locations && STORE.locations.length;
    if (hasStoredCredentials) {
      setLocations(STORE.locations);
    }
  };

  useEffect(() => {
    restoreLocations();
  }, []);

  const filterLocations = async (filter) => {
    const STORE = (await AccessStore.get()) || { locations: [] };
    const filteredLocations = STORE.locations.filter(
      (location) =>
        location.infos.locationName
          .toString()
          .toLowerCase()
          .includes(filter.toLowerCase()) ||
        (location.infos.phoneNumber &&
          location.infos.phoneNumber.toString().includes(filter)),
    );
    setLocations(filteredLocations);
  };

  const handleSearch = (filter) => {
    setSearch(filter);
    filterLocations(filter);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={styles.bar}
        placeholder="Type location here..."
        onChangeText={(filter) => handleSearch(filter)}
        value={search}
        platform="android"
        searchIcon={false}
        onClear={() => handleSearch('')}
        onCancel={() => handleSearch('')}
        cancelIcon={false}
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item) => item.locationName}
        ListEmptyComponent={
          <Text style={styles.none}> No Saved Locations Found. </Text>
        }
      />
    </View>
  );
};

export default Locations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    marginHorizontal: 20,
    marginVertical: 0,
    padding: 0,
    height: 50,
  },
  imageBackground: {
    width: 25,
    height: 30,
    padding: 4,
  },
  listContainer: {
    borderTopColor: COLORS.info_color_light,
    borderTopWidth: 2,
    borderRadius: 40,
  },
  none: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    alignSelf: 'center',
    color: COLORS.eshi_color,
  },
  item: {
    padding: 10,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    borderBottomColor: COLORS.info_color_light,
    borderBottomWidth: 2,
  },
  itemContent: {
    marginStart: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  textContent: {
    fontSize: 13,
    color: COLORS.info_color,
    textAlign: "center"
  },
});
