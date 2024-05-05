import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../common/constants';

export function Label(props) {
  const {
    label,
    value,
    wrapperStyle,
    titleStyle,
    valueStyle,
    ...otherProps
  } = props;
  return value && value !== 'undefined' ? (
    <View style={[styles.detailText]}>
      <Text style={[styles.detailTextSize, titleStyle]} {...otherProps}>
        {label}
      </Text>
      <Text
        style={[styles.detailTextSize, styles.detailTextContent, valueStyle]}
        {...otherProps}>
        {`${value}`}
      </Text>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  detailText: {
    flexDirection: 'row',
    width: '70%',
    marginLeft: '1%',
  },
  detailTextSize: {
    fontSize: 12,
    color: COLORS.black,
    marginRight: 8,
    width: '50%',
    marginTop: 2,
  },
  detailTextContent: {
    marginLeft: 0,
    width: '98%',
    fontSize: 13,
  },
});
