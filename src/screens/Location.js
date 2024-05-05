import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Card from '../components/OpenCageCard';
import { Header, Icon, Button, Input } from 'react-native-elements';
import { COLORS, DIMENS } from '../common/constants';
import AccessStore from '../services/AsyncStorage';
import Dialog from 'react-native-dialog';
import useSavedLocations from '../components/useSavedLocations';
import ImagePicker from '../components/useImagePicker';

import {
  getDetailFromLatLong,
  showToast,
  copyToClipboard,
  post,
  upload,
  compressOpenCageData,
  getLatlongFromPlusCode,
  translatePlusCodeToYeneCode,
  translateYeneCodeToPlusCode,
} from '../common/utils';
import Geolocation from 'react-native-geolocation-service';
import Audio from '../components/useAudioRecorder';
import NetInfo from '@react-native-community/netinfo';
const SendIntentAndroid = require('react-native-send-intent');
const opencage = require('opencage-api-client');
import { OCD_API_KEY } from '../env.json';
import IconInbox from '../components/IconInbox';
import { useSelector, useDispatch } from 'react-redux';
import { storeUser } from '../actions/user';
import SearchMap from '../screens/SearchMap';

// const Info = () => {
//   return (
//     <Tooltip
//       height={400}
//       width={350}
//       backgroundColor={COLORS.eshi_light}
//       popover={<Text style={styles.infoText}>{INFO}</Text>}>
//       <Icon
//         name="question"
//         type="evilicon"
//         color={COLORS.eshi_color}
//         size={30}
//       />
//     </Tooltip>
//   );
// };

const Location = ({
  route: { params = {} } = {},
  navigation,
  inside,
  setLocationVisible,
  setLandingTitle = () => { },
  setForceRefresh = () => { },
}) => {
  const dispatch = useDispatch();
  const [isUpdatedLocation, setisUpdatedLocation] = useState(false);
  const [isPluscodeEditable, setIsPluscodeEditable] = useState(false);
  const [newPlusCode, setNewPlusCode] = useState('');
  const pluscodeInput = useRef();
  const [SavedLocations, setRefresh] = useSavedLocations();
  const [isSearching, setSearching] = useState(false);
  const fcmToken = useSelector((state) => state.user.fcmToken);
  const { receivedLocation = {}, from } = params;
  const [visible, setVisible] = useState(false);
  const [userDialogVisible, setUserDialogVisible] = useState(false);
  const [codeDialogVisible, setCodeDialogVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUserEmailValid, setIsUserEmailValid] = useState(true);
  const [isUserPhoneValid, setIsUserPhoneValid] = useState(true);
  const [isUserNamevalid, setIsUserNamevalid] = useState(true);
  const [userId, setUserId] = useState(false);
  const [code, setCode] = useState('');
  const [fromIntent, setFromIntent] = useState(false);
  const [keyboardDialogVisible, setKeyboardDialogVisible] = useState(false);
  const [infosToBeSaved, setInfosToBeSaved] = useState({
    locationName: '',
  });
  const [userInfos, setUserInfos] = useState({
    userName: '',
    userEmail: '',
    phoneNumber: '',
  });
  const [location, setLocation] = useState({});

  const fromLocations = from === 'Locations';
  const fromPinner = from === 'Pinner';
  const insideLanding = inside === 'Landing';

  if (!insideLanding) {
    setForceRefresh = setRefresh;
  }

  const getDetail = useCallback(async (loc) => {
    console.log('Getting,.... ', loc);
    const detailLocation = await getDetailFromLatLong(loc);
    console.log('CALLED, ', detailLocation);
    setLocation({ ...detailLocation });
    if (!detailLocation.address) {
      doReverseGeocode({ ...detailLocation });
    }
  }, []);

  useEffect(() => {
    if (fromLocations || fromPinner || receivedLocation.from) {
      if (receivedLocation.from === 'Intent') {
        setFromIntent(true);
      }
      delete receivedLocation.from;
      getDetail(receivedLocation);

      if (receivedLocation.infos) {
        setInfosToBeSaved(receivedLocation.infos);
      }
    }
  }, [fromLocations, fromPinner, getDetail, receivedLocation]);

  const restoreUserFromStorage = async () => {
    const STORE = await AccessStore.get();
    const hasStoredCredentials = STORE && STORE.USER_ID;
    if (hasStoredCredentials) {
      setUserId(STORE.USER_ID);
    }
  };

  useEffect(() => {
    restoreUserFromStorage();
  }, []);

  useEffect(() => {
    if (insideLanding && !location.code) {
      getCurrentPosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insideLanding, getCurrentPosition]);

  const getCustumerId = (fullName, phoneNumber) => {
    try {
      if (!fullName || !phoneNumber) {
        return null;
      }
      // get name initials
      let splittedFullName = fullName.split(' ');
      let nameInitial =
        splittedFullName.length > 1
          ? `${splittedFullName[0].substr(0, 1)}${splittedFullName[1].substr(
            0,
            1,
          )}`
          : `${splittedFullName[0].substr(0, 2)}`;

      // get last 4 digit of phone number
      let phonumberLastFourDigits = phoneNumber.substr(4);
      // get current date initals
      const now = new Date();
      let dateSuffixes =
        `${now.getDate()}`.length === 1
          ? `0${now.getDate()}`
          : `${now.getDate()}`;
      let hourSuffixes =
        `${now.getHours()}`.length === 1
          ? `0${now.getHours()}`
          : `${now.getHours()}`;

      return `${nameInitial.toUpperCase()}${phonumberLastFourDigits}${dateSuffixes}${hourSuffixes}`;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getCurrentPosition = useCallback(
    async (info = {}) => {
      const iosPermision =
        Platform.OS === 'ios' && (await Geolocation.requestAuthorization());
      if (Platform.OS === 'android') {
        console.log(
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ),
        );
      }
      if (iosPermision === 'granted' || Platform.OS === 'android') {
        Geolocation.getCurrentPosition(
          (position) => {
            const region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            getDetail({ ...location, ...region, ...info });
          },
          (error) => {
            console.log(error);
            showToast(
              'Unable to get current location.\nPlease check whether location services is on and try again.',
            );
            setLocationVisible(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 15000,
          },
        );
      }
    },
    [getDetail, location, setLocationVisible],
  );

  const doReverseGeocode = useCallback((args) => {
    if (!args.latitude || !args.longitude) {
      return;
    }
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        opencage
          .geocode({
            q: ` ${args.latitude} ${args.longitude}`,
            language: 'native',
            key: OCD_API_KEY,
          })
          .then((data) => {
            const address = compressOpenCageData(data.results[0]);
            setLocation({ ...args, address });
          })
          .catch((error) => {
            console.log('error', error.message);
          });
      } else {
        showToast('Not Connected to internet.');
      }
    });
    unsubscribe();
  }, []);

  const shareLocation = useCallback(
    async (locationId) => {
      console.log('sharing...');
      const regex = / /gi;
      const encodedData = `${locationId}@@${location.address.replace(
        regex,
        '%20',
      )}`;
      const text = `Here is my location.\n\nhttps://www.yenecode.com/maps@${location.latitude}@@${location.longitude}@@${encodedData}\n\n Use your Address Locator app to open the link. If you don't have the locator app, please download using:\n\nhttps://play.google.com/9348tyh349th3`;
      SendIntentAndroid.sendText({
        text,
        title: 'My locations',
        type: SendIntentAndroid.TEXT_PLAIN,
      });
    },
    [location],
  );

  let locationNameInput = useRef(null);
  let userEmailInput = useRef(null);
  let userPhoneInput = useRef(null);

  const handleRegister = async () => {
    const okName = validateName();
    const okEmail = validateEmail(true);
    const okPhone = validatePhoneNumber();
    if (!okName || !okEmail || !okPhone) {
      return;
    }
    const { userName, userEmail, phoneNumber } = userInfos;
    const payload = {
      phone: phoneNumber,
      email: userEmail,
      full_name: userName,
      customerId: getCustumerId(userName, phoneNumber),
      fcmToken,
    };
    console.log('Payload is ', payload);
    const STORE = (await AccessStore.get()) || { locations: [] };
    post('accounts', payload)
      .then(async (response) => {
        console.log('accounts....', response);
        setUserDialogVisible(false);
        setUserId(response.id);
        STORE.USER_ID = response.id;
        dispatch(storeUser({ ...payload, ...response }));
        await AccessStore.set(STORE);
        // const sendCodePayload = {
        //   phone: phoneNumber,
        // };
        // post('login', sendCodePayload)
        //   .then((res) => {
        //     setCodeDialogVisible(true);
        //   })
        //   .catch(console.error);
      })
      .catch(console.error);
  };

  const handleCodeConfirm = () => {
    setCodeDialogVisible(false);
    const payload = {
      phone: userInfos.phoneNumber,
      key: code,
    };

    post('login', payload, false).then((res) => {
      console.log('CODE CONFIRMED', res);
      createLocation();
    });
  };

  const createLocation = () => {
    const { code: plus_code } = location;

    const locationPayload = {
      plus_code,
    };
    post(`locations/${userId}`, locationPayload)
      .then((createdLocation) => {
        console.log('LOCATTION CREATED', createdLocation);
        if (location.image_uri) {
          upload(createdLocation, location.image_uri, 'image').then(
            (updatedLocaion) => {
              console.log('IMAGE UPDATED', updatedLocaion);
              post(`locations/${userId}/image`, {
                imageUrl: updatedLocaion.metadata.fullPath,
              }).then(() => {
                console.log('updated..');
              });
            },
          );
        }
        if (location.voice_uri) {
          upload(createdLocation, location.voice_uri, 'voice').then(
            (updatedLocaion) => {
              console.log('VOICE UPDATED', updatedLocaion);
              post(`locations/${userId}/voice`, {
                imageUrl: updatedLocaion.metadata.fullPath,
              }).then(() => {
                console.log('updatd..');
              });
            },
          );
        }
        shareLocation(createdLocation.id);
      })
      .catch(console.error);
  };

  const handleShareLocation = () => {
    console.log('User IS', userId);
    if (userId) {
      createLocation();
    } else {
      setUserDialogVisible(true);
    }
  };
  const handleSave = async () => {
    if (infosToBeSaved.locationName.trim() === '') {
      return;
    }

    const STORE = (await AccessStore.get()) || { locations: [] };

    const locationName = STORE.locations.map((savedLocation) =>
      savedLocation.infos.locationName.toLowerCase(),
    );

    // update
    if (fromLocations) {
      if (
        infosToBeSaved.locationName.toLowerCase() !==
        receivedLocation.infos.locationName.toLowerCase() &&
        locationName.includes(infosToBeSaved.locationName.toLowerCase())
      ) {
        showToast('Location with same location name exists.');
        return;
      }

      const NEW_STORE_LOCATIONS = STORE.locations
        .map((savedLocation) => {
          if (
            savedLocation.infos.locationName.toLowerCase() ===
            receivedLocation.infos.locationName.toLowerCase()
          ) {
            return null;
          }
          return savedLocation;
        })
        .filter((savedLocation) => savedLocation);
      await AccessStore.set({
        ...STORE,
        locations: [
          { ...location, infos: { ...infosToBeSaved }, modifiedDate: new Date() },
          ...NEW_STORE_LOCATIONS,
        ],
      });
    } else {
      // save
      if (locationName.includes(infosToBeSaved.locationName.toLowerCase())) {
        showToast('Location with same location name exists.');
        return;
      }
      await AccessStore.set({
        ...STORE,
        locations: [
          {
            ...location,
            infos: { ...infosToBeSaved },
            modifiedDate: new Date(),
          },
          ...STORE.locations,
        ],
      });
    }
    console.log(
      {
        ...location,
        infos: { ...infosToBeSaved },
        modifiedDate: new Date(),
      },
      'location to be saved',
    );
    showToast('Location saved successfully.');
    setForceRefresh(Math.floor(Math.random() * 99));
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
    setUserDialogVisible(false);
    setCodeDialogVisible(false);
  };

  const handleStateChange = (changedState) => {
    setInfosToBeSaved({ ...infosToBeSaved, ...changedState });
  };

  const handleUserStateChange = (changedState) => {
    setUserInfos({ ...userInfos, ...changedState });
  };

  const toPinner = () => {
    navigation.navigate('SearchMap', {
      receivedLocation: location,
      from: 'Location',
    });
  };

  const handlePhotoSelected = (uri) => {
    getCurrentPosition({ image_uri: uri });
  };

  const handleAudioRender = (uri) => {
    setLocation({ ...location, voice_uri: uri });
  };

  const validateEmail = (user = false) => {
    const trimmedEmail = user
      ? userInfos.userEmail
      : infosToBeSaved.locationEmail;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = re.test(trimmedEmail.trim());
    user ? setIsUserEmailValid(validEmail) : setIsEmailValid(validEmail);
    return validEmail;
  };

  const validatePhoneNumber = () => {
    const trimmedPhonenumber = userInfos.phoneNumber.trim();
    const validPhone =
      !isNaN(trimmedPhonenumber) && trimmedPhonenumber.length === 10;
    setIsUserPhoneValid(validPhone);
    return validPhone;
  };

  const validateName = () => {
    const trimmedName = userInfos.userName.trim();
    const validName = trimmedName.length > 0;
    setIsUserNamevalid(validName);
    return validName;
  };

  const onPlusCodeUpdated = () => {
    try {
      setIsPluscodeEditable(false);
      const pluscode = translateYeneCodeToPlusCode(newPlusCode);
      const decodedAddresss = getLatlongFromPlusCode(pluscode);
      const newLocation = {
        locationId: pluscode,
        code: newPlusCode,
        latitude: decodedAddresss.latitudeCenter,
        longitude: decodedAddresss.longitudeCenter,
      };
      setLocation({}); // reset previous location
      getDetail(newLocation); // fetch location details
      setNewPlusCode(''); // reset new pluscode input value
      setisUpdatedLocation(true);
      setLandingTitle('New Location');
    } catch (error) {
      console.log("error..", error);
      setNewPlusCode('');
      alert('invalid yene code value');
    }
  };

  const showRoute = () => {
    navigation.navigate('Navigate', { destination: location });
  };

  useEffect(() => {
    console.log(JSON.stringify(location, null, 4));
  }, [location]);

  return (
    <View style={styles.container}>
      {!insideLanding && (
        <View>
          <StatusBar backgroundColor={COLORS.eshi_color} />

          <Header
            centerComponent={
              <View style={styles.centerComponent}>
                {isUpdatedLocation || fromPinner ? null : <IconInbox />}
                <Text style={styles.headerTitle}>
                  {fromPinner
                    ? 'Picked Location'
                    : fromIntent
                      ? 'Shared Location'
                      : isUpdatedLocation
                        ? 'New Location'
                        : 'Saved Location'}
                </Text>
              </View>
            }
            placement="center"
            containerStyle={styles.toolbar}
          />
        </View>
      )}
      {
        !isSearching ? (<ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => copyToClipboard(location.code)}
              style={[styles.item]}>
              <Text style={styles.title}>Yene Code</Text>
              <TextInput
                ref={pluscodeInput}
                onChangeText={(code) => setNewPlusCode(code)}
                style={[styles.code, isPluscodeEditable && styles.editable]}
                placeholder="Yene Code"
                value={
                  isPluscodeEditable
                    ? newPlusCode
                    : translatePlusCodeToYeneCode(location.code)
                }
                editable={isPluscodeEditable}
              />
            </TouchableOpacity>

            <View style={{ margin: 0, padding: 0 }}
            >

              {!isPluscodeEditable ? (
                <Button
                  onPress={() => {
                    // setNewPlusCode(translatePlusCodeToYeneCode(location.code))
                    setKeyboardDialogVisible(true)
                  }}
                  icon={
                    <Icon
                      name="pencil"
                      size={30}
                      color={COLORS.eshi_color}
                      type="evilicon"
                    />
                  }
                  type="clear"
                />
              ) : (
                <Button
                  onPress={onPlusCodeUpdated}
                  icon={
                    <Icon
                      name="play"
                      size={30}
                      color={COLORS.eshi_color}
                      type="evilicon"
                    />
                  }
                  type="clear"
                />
              )}
              {
                // <Info />
              }
            </View>
            {/* <Button
              onPress={() => {
                setSearching(true);
              }}
              icon={
                <Icon
                  name="location"
                  size={30}
                  color={COLORS.eshi_color}
                  type="evilicon"
                />
              }
              type="clear"
            /> */}
          </View>

          <TouchableOpacity onPress={() => toPinner()} style={styles.buttonLink}>
            <Text style={styles.buttonText}> Pin On Map </Text>
          </TouchableOpacity>
          <Card item={location} onShowRoute={showRoute} />

          <View style={styles.mediaContainer}>
            <Text style={styles.mediaInfo}>
              Insert a location picture and a short voice message to make it
              easier for a visitor to find your place
          </Text>
            <View style={styles.medias}>
              <ImagePicker
                uri={location.image_uri}
                onPhotoSelected={handlePhotoSelected}
              />

              <Audio
                uri={location.voice_uri}
                onAudioSelected={handleAudioRender}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setVisible(true)}
              style={[styles.button]}>
              <Text style={styles.buttonText}>
                {fromLocations ? 'Edit' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShareLocation}
              style={[styles.button]}>
              <Text style={styles.buttonText}> Share </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        ) : (<SearchMap onFinish={(data) => {
          getDetail(data);
          setSearching(false);
        }}> </SearchMap>)
      }

      <Dialog.Container
        visible={visible}
        contentStyle={styles.dialogContainer}
        onRequestClose={onCancel}
        onBackdropPress={onCancel}>
        <View style={styles.header}>
          <Dialog.Title style={styles.dialogTitle}>Save Location</Dialog.Title>
          <Icon
            onPress={onCancel}
            name="close-o"
            type="evilicon"
            color={COLORS.eshi_color}
            size={46}
          />
        </View>
        <Dialog.Input
          textInputRef={(ref) => (locationNameInput = ref)}
          label="Location Name"
          value={infosToBeSaved.locationName}
          locationName
          onChangeText={(locationName) => handleStateChange({ locationName })}
          style={styles.input}
          placeholder="Ex. Home or Office..."
          selectionColor={COLORS.eshi_color}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            handleSave();
          }}
        />

        <View style={styles.dialogButtonContainer}>
          <Dialog.Button
            label={fromLocations ? 'Update' : 'Save'}
            onPress={handleSave}
            color={COLORS.eshi_color}
          />
        </View>
      </Dialog.Container>
      <Dialog.Container
        visible={userDialogVisible}
        contentStyle={styles.dialogContainer}
        onRequestClose={onCancel}
        onBackdropPress={onCancel}>
        <View style={styles.header}>
          <Dialog.Title style={styles.dialogTitle}>Register</Dialog.Title>
          <Icon
            onPress={onCancel}
            name="close-o"
            type="evilicon"
            color={COLORS.eshi_color}
            size={46}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <Dialog.Input
            label="Name"
            value={userInfos.userName}
            userName
            onChangeText={(userName) => handleUserStateChange({ userName })}
            style={styles.input}
            placeholder="Ex. Abebe Kebede"
            onSubmitEditing={() => {
              !validateName() || userEmailInput.focus();
            }}
            selectionColor={COLORS.eshi_color}
            returnKeyType="next"
            blurOnSubmit={false}
            autoFocus
          />
          {!isUserNamevalid && (
            <Text style={styles.errorInputStyle}>Name is invalid.</Text>
          )}
          <Dialog.Input
            textInputRef={(ref) => (userEmailInput = ref)}
            label="Email"
            value={userInfos.userEmail}
            userEmail
            onChangeText={(userEmail) => handleUserStateChange({ userEmail })}
            style={styles.input}
            onSubmitEditing={() => {
              !validateEmail(true) || userPhoneInput.focus();
            }}
            selectionColor={COLORS.eshi_color}
            blurOnSubmit={false}
            placeholder="Ex. abc@abc.com"
            returnKeyType="next"
          />
          {!isUserEmailValid && (
            <Text style={styles.errorInputStyle}>Email is invalid.</Text>
          )}
          <Dialog.Input
            textInputRef={(ref) => (userPhoneInput = ref)}
            label="Phone Number"
            value={userInfos.phoneNumber}
            placeholder="Ex. 0912345678"
            phoneNumber
            onChangeText={(phoneNumber) => handleUserStateChange({ phoneNumber })}
            onSubmitEditing={() => {
              !validatePhoneNumber() || handleRegister();
            }}
            keyboardType="phone-pad"
            maxLength={10}
            blurOnSubmit={true}
            returnKeyType="send"
            style={[styles.input]}
            selectionColor={COLORS.eshi_color}
          />
          {!isUserPhoneValid && (
            <Text style={styles.errorInputStyle}>Phone number is invalid.</Text>
          )}
          <View style={styles.dialogButtonContainer}>
            <Dialog.Button
              label="Sign Up"
              onPress={handleRegister}
              color={COLORS.eshi_color}
            />
          </View>
        </ScrollView>
      </Dialog.Container>
      <Dialog.Container
        visible={keyboardDialogVisible}
        contentStyle={styles.dialogContainer}
        onRequestClose={onCancel}
        onBackdropPress={onCancel}
      >

        <View>

          <Input
            label="Yene Code"
            value={newPlusCode}
            onChangeText={setNewPlusCode}
            style={styles.input}
            editable={false}
            disabledInputStyle={{ color: 'red', opacity: 1 }}
            placeholder="Please write your yene code..."
            selectionColor={COLORS.eshi_color}
            returnKeyType="next"
            blurOnSubmit={false}
            autoFocus
          />
        </View>
        <FlatList
          columnWrapperStyle={{
            backgroundColor: COLORS.white,
            borderRadius: 0,
            borderColor: "black",
            borderWidth: 0.5,
          }}
          data={[2, 3, 4, 5, 6, 7, 8, 9, 'ለ', 'መ', 'ረ', 'ሸ', 'ቀ', 'በ', 'ተ', 'ቸ', 'አ', 'ከ', 'ወ', 'ዘ', '፡', 'DELETE']}
          numColumns={8}
          // maxDimension={30}
          renderItem={({ item }) => (


            <Button title={`${item}`} style={{ alignSelf: 'center' }} titleStyle={{
              color: "black", fontSize: Number.isInteger(item) ? 19 : 16, textAlign: "center",
              alignSelf: 'center'
            }} buttonStyle={{
              padding: 13, color: "black", backgroundColor: COLORS.white,
              borderColor: "black",
              alignSelf: 'center'
            }} onPress={() => {
              if (item === '←') {
                //todo
              } else if (item === '→') {
                //todo
              } else if (item === 'DELETE') {
                setNewPlusCode(newPlusCode.substring(0, newPlusCode.length - 1));
              } else {
                setNewPlusCode(newPlusCode + item)
              }
            }} type="clear"
            />
          )} />
        <View >
          <Text style={{ color: COLORS.eshi_color, margin: 20 }}> Example:   "6ረወወዘቸ68፡6ዘ" </Text>
        </View>
        <View style={{ marginBottom: 90, marginHorizontal: 20 }}>
          <Text>• A total minimum of 11 characters including the ":"</Text>
          <Text></Text>
          <Text>• Eight values before the ":" and a minimum of two after </Text>
        </View>

        {/* 
        <FlatGrid
          itemDimension={35}
          style={{
            gridView: {
              marginTop: 20,
              flex: 1,
            },
          }}
          data={[2, 3, 4, 5, 6, 7, 8, 9, 'ለ', 'መ', 'ረ', 'ሸ', 'ቀ', 'በ', 'ተ', 'ቸ', 'አ', 'ከ', 'ወ', 'ዘ', '፡', '✖']}
          itemContainerStyle={{
            borderRadius: 0,
            borderColor: "grey",
            borderWidth: 1,

          }}
          // numRows={3}
          // maxDimension={30}
          spacing={0}
          renderItem={({ item }) => (
            <Button title={`${item}`} titleStyle={{ color: "black" }} buttonStyle={{ padding: 10, color: "black" }} onPress={() => {
              if (item === '←') {
                //todo
              } else if (item === '→') {
                //todo
              } else if (item === '✖') {
                setNewPlusCode(newPlusCode.substring(0, newPlusCode.length - 1));
              } else {
                setNewPlusCode(newPlusCode + item)
              }
            }} type="clear"
            />)}
        /> */}
        <Dialog.Button
          label="cancel"
          onPress={() => setKeyboardDialogVisible(false)}
          color={COLORS.eshi_color}
        />
        <Dialog.Button
          label="Confirm"
          onPress={() => {
            onPlusCodeUpdated();
            setKeyboardDialogVisible(false);
          }}
          color={COLORS.eshi_color}
        />
      </Dialog.Container>
      <Dialog.Container
        visible={codeDialogVisible}
        contentStyle={styles.dialogContainer}
        onRequestClose={onCancel}
        onBackdropPress={onCancel}>
        <View style={styles.header}>
          <Dialog.Title style={styles.dialogTitle}>Verify Code</Dialog.Title>
          <Icon
            onPress={onCancel}
            name="close-o"
            type="evilicon"
            color={COLORS.eshi_color}
            size={46}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <Dialog.Input
            label="Verification Code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
            placeholder="Your 4 Digit Code"
            onSubmitEditing={() => {
              handleCodeConfirm();
            }}
            selectionColor={COLORS.eshi_color}
            returnKeyType="next"
            blurOnSubmit={false}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
          />

          <View style={styles.dialogButtonContainer}>
            <Dialog.Button
              label="Confirm"
              onPress={handleCodeConfirm}
              color={COLORS.eshi_color}
            />
          </View>
        </ScrollView>
      </Dialog.Container>
      { !insideLanding && <SavedLocations style={styles.locationsBottomSheet} />}
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: DIMENS.full_height,
  },
  toolbar: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.eshi_color,
    fontSize: 18,
    marginLeft: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },

  input: {
    borderWidth: 0,
    borderColor: COLORS.info_color_light,
    borderRadius: 5,
    paddingLeft: 8,
    marginTop: 10,
    textAlignVertical: 'bottom',
  },
  locationsBottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: DIMENS.full_width,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '8%',
  },
  button: {
    width: '30%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderColor: COLORS.eshi_color,
    borderWidth: 1,
  },
  buttonText: {
    color: COLORS.eshi_color,
  },
  buttonLink: {
    color: COLORS.eshi_color,
    alignSelf: 'center',
  },
  dialogContainer: {
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  dialogTitle: {
    width: '80%',
    fontSize: 20,
    color: COLORS.eshi_color,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  header: {
    marginBottom: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.info_color_light,
  },
  dialogButtonContainer: {
    borderColor: COLORS.eshi_color,
    borderWidth: 1,
    borderRadius: 20,
    width: 100,
    paddingHorizontal: 5,
    alignSelf: 'center',
    marginTop: 10,
    // marginBottom: 20,
    // paddingBottom: 20,
  },
  mediaContainer: {
    flexDirection: 'column',
    borderColor: COLORS.eshi_color,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  medias: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mediaInfo: {
    width: '90%',
    marginVertical: 4,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
    alignSelf: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    padding: 15,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    backgroundColor: COLORS.white,
    width: '75%',
  },
  title: {
    fontSize: 18,
    marginLeft: 8,
    marginRight: 16,
    color: COLORS.plus_code_color,
    fontWeight: '500',
  },
  code: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: 'bold',
    flexGrow: 1,
    padding: 0,
    margin: 0,
  },
  infoText: {
    color: COLORS.white,
  },
  // eslint-disable-next-line react-native/no-color-literals
  errorInputStyle: {
    textAlign: 'center',
    color: 'red',
    fontSize: 12,
  },
  editable: {
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
    paddingBottom: -3,
    fontWeight: 'normal',
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
});

export default Location;
