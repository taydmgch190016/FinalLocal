import React, {useEffect} from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../../redux/CartReducer";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // useEffect(() => {
    
  // }, []);
  const handleLogout = async () => {
    try{
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('selectedStoreId');
      dispatch(cleanCart());
      console.log("logout completed")
      navigation.navigate('Login');
    }catch(error){
      console.log(error);
    }
  }
  const navigateToInfo = () => {
    navigation.navigate('Info');
  };
  const navigateToOders = () => {
    navigation.navigate('OrderHistory');
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View style={{alignItems:"center"}}>
        <Image
          style={{width: 150, height: 100, marginTop: 110 }}
          source={{
            uri: "https://res.cloudinary.com/dcc0yhyjq/image/upload/v1712695169/xakwryqc6r1gwhptqfzt.png",
          }}
        />
        <Text style={{textAlign:"center", fontSize: 25, fontWeight:"500"}}>Hello</Text>
        <TouchableOpacity style={{
            width: 300,
            backgroundColor: "#87D796",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
            alignContent: "center",
          }}
          onPress={navigateToInfo}>
        <Text style={{textAlign:"center"}}>Your Information</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
            width: 300,
            backgroundColor: "#87D796",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
            alignContent: "center",
            marginTop: 10
          }}
          onPress={navigateToOders}>
        <Text style={{textAlign:"center"}}>Your Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
            width: 300,
            backgroundColor: "#87D796",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
            alignContent: "center",
            marginTop: 10
          }}
          onPress={handleLogout}>
        <Text style={{textAlign:"center"}}>Log Out</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
