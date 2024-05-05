import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextBase } from 'react-native';
import { Icon } from 'react-native-elements';
import Barcode from 'react-native-barcode-builder';

import { COLORS } from '../common/constants';

export default function DeliveryPackageDetail({ navigation }) {
  const getItemInfo = (label, value) => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoLabel}>{label} : </Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderPackage = (item) => (
    <View style={styles.item}>
      <View style={styles.itemIcon}>
        <Icon
          name="ios-archive"
          type="ionicon"
          style={styles.icon}
          color={COLORS.eshi_color}
        />
      </View>
      <View style={styles.itemContent}>
        {getItemInfo('PackageId', '23453324')}
        {getItemInfo('Agent', 'Abebe Solomon')}
        {getItemInfo('Date of Arrival', 'Nov 1, 2020')}
        {getItemInfo('Status', 'In Progress')}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon
            name="ios-arrow-back"
            type="ionicon"
            style={styles.icon}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Items</Text>
      </View>
      <View style={styles.content}>{renderPackage()}</View>
      <View style={styles.barcode}>
        <Text style={styles.subTitle}>Your Recipient Code</Text>
        <Barcode
          text="23453335234532"
          value="23453335234532"
          format="CODE128"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  backButton: {
    backgroundColor: COLORS.eshi_color,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  icon: {
    color: COLORS.white,
  },
  content: {
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    color: COLORS.eshi_color,
    fontSize: 15,
  },
  itemIcon: {
    width: 30,
    height: 30,
  },
  item: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
  },
  itemContent: {
    marginLeft: 15,
  },
  title: {
    fontSize: 17,
    color: COLORS.eshi_color,
    padding: 15,
    flex: 1,
    textAlign: 'center',
  },
  barcode: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  subTitle: {
    color: COLORS.eshi_color,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 15,
  },
});
