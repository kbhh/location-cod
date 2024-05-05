import MapView from 'react-native-maps';
import {
    StyleSheet, TouchableOpacity,
    Text, Dimensions, View,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, LATITUDE_DELTA, LONGITUDE_DELTA } from '../common/constants';

const SearchMap = ({ navigation, route: { params = {} } = {} }) => {
    const { receivedLocation = {}, from } = params;

    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    const map = useRef(null);
    const selectLocation = () => {
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Location',
                    params: {
                        receivedLocation: region,
                        from: 'Pinner',
                    },
                },
            ],
        });
    };
    const fromLocation = from === 'Location';
    const [isNewPosition, setisNewPosition] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(0);

    const handleRegionChange = (position) => {
        setRegion(position);
        isFirstTime <= 1 && setIsFirstTime(isFirstTime + 1);
        isFirstTime >= 1 && !isNewPosition && setisNewPosition(true);
    };
    useEffect(() => {
        if (!fromLocation) {
            return;
        }
        const region = {
            latitude: receivedLocation.latitude,
            longitude: receivedLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        setRegion(region);
        map.current.animateToRegion(region, 2000);
    }, [fromLocation, receivedLocation.latitude, receivedLocation.longitude]);

    return (
        <View style={styles.container}>
            <MapView ref={map} onRegionChange={(region) => setRegion(region)} style={styles.map} initialRegion={region} showsUserLocation={true}
                showsMyLocationButton={true} zoomEnabled={true} followsUserLocation={true}
                onRegionChangeComplete={handleRegionChange}
            >
                <MapView.Marker
                    coordinate={{
                        "latitude": region.latitude,
                        "longitude": region.longitude
                    }}
                    title={"Your Location"}
                    draggable />
            </MapView>
            <View style={{ position: 'absolute', top: 40, width: Dimensions.get('window').width * 0.90 }} >
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    fetchDetails={true}
                    style={styles.searchBar}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                        setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        });
                        map.current.animateToRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.0059397161733585335,
                            longitudeDelta: 0.005845874547958374
                        });
                    }}
                    query={{
                        key: '',
                        language: 'en',
                    }}
                />
            </View>
            <View style={{
                position: 'absolute', bottom: 10,
                right: 10,

            }} >
                {isNewPosition && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => selectLocation()}
                            style={[styles.bubble]}>
                            <Text style={styles.buttonText}>Get Yene Code</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* <Button style={{
                    width: 100,
                    height: 100,
                    borderRadius: 30,
                    backgroundColor: COLORS.eshi_color,
                    position: 'absolute',
                }} title="Get Yene Code" onPress={() => selectLocation()} /> */}
            </View>



        </View>


    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        position: "absolute"
    },
    buttonContainer: {
        // flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        height: '15%',
        marginBottom: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 15,
    },
    bubble: {
        backgroundColor: COLORS.eshi_color,
        paddingHorizontal: 18,
        borderRadius: 20,
        width: 200,
        height: 40,
        padding: 8,
        marginHorizontal: 5,
    },

    searchBar: {
        // position: "absolut
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
export default SearchMap;
