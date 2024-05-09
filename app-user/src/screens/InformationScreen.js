import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Đảm bảo bạn đã cài đặt axios
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const InformationScreen = () => {
    const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        if (userID) {
          const response = await axios.get(
            `http://10.0.2.2:5000/api/customers/${userID}`
          );
          setUserData(response.data); // Giả sử dữ liệu trả về là object của người dùng
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white"}}
    >
        <View style={{marginTop:35,}}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={47} color="black" />
            </TouchableOpacity>
        </View>
      <View style={{ alignItems: "center" }}>
      <Image
          style={{ width: 150, height: 150, marginTop: 5 }}
          source={{
            uri: "https://res.cloudinary.com/dcc0yhyjq/image/upload/v1713780667/products/user-avatar_o6ceck.png",
          }}
        />
        {userData ? (
          <View>
            <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 10,
            width: 300,
            justifyContent: "center",
          }}
        >
            <Text>Username: {userData.username}</Text>
            </View>
            <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 10,
            width: 300,
            justifyContent: "center",
          }}
        >
            <Text>Email: {userData.email}</Text>
            </View>
            <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 10,
            width: 300,
            justifyContent: "center",
          }}
        >
            <Text>Address: {userData.address}</Text>
            </View>
          </View>
        ) : (
          <Text>Loading user data...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default InformationScreen;
