import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import paypalApi from "../apis/paypalApi";
import queryString from "query-string";
import { cleanCart } from "../../redux/CartReducer";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const PaymentScreen = () => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [paypalUrl, setPaypalUrl] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantities)
    .reduce((curr, prev) => curr + prev, 0);
  const navigation = useNavigation();
  const [userID, setUserID] = useState(null);
  const [storeID, setStoreID] = useState(null);
  const orderItems = cart.map((item) => ({
    name: item.name,
    image: item.imageURL[0],
    price: item.price,
    quanlity: item.quantities,
    product: item._id,
  }));

  useEffect(() => {
    // Lấy giá trị từ AsyncStorage khi component được mount
    AsyncStorage.getItem("userID")
      .then((value) => {
        setUserID(value);
      })
      .catch((error) => {
        console.error("Error retrieving user ID:", error);
      });
  }, []);
  useEffect(() => {
    // Lấy giá trị từ AsyncStorage khi component được mount
    AsyncStorage.getItem("selectedStoreId")
      .then((value) => {
        setStoreID(value);
      })
      .catch((error) => {
        console.error("Error retrieving store ID:", error);
      });
  }, []);

  const onPressPaypal = async () => {
    try {
      const token = await paypalApi.generateToken();
      const res = await paypalApi.createOrder(total, token);
      setAccessToken(token);
      console.log("res----", res);
      if (!!res?.links) {
        const findUrl = res.links.find((data) => data?.rel == "approve");
        setPaypalUrl(findUrl.href);
      }
      if (!fullName || !address || !city || !phone || orderItems.length === 0) {
        Alert.alert(
          "Please fill in all fields and add at least one order item"
        );
        return;
      }
    } catch (error) {
      console.error("Error when pressing Paypal:", error);
    }
  };

  const handleCOD = async () => {
    // Validate form fields
    if (!fullName || !address || !city || !phone || orderItems.length === 0) {
      Alert.alert("Please fill in all fields and add at least one order item");
      return;
    }

    // Prepare order data
    const orderData = {
      shippingAddress: { fullName, address, city, phone },
      totalPrice: total,
      user: userID,
      storeId: storeID,
      paymentMethod: "COD",
      orderItems: orderItems,
    };

    try {
      // Send order data to the backend API using Axios
      const response = await axios.post(
        "http://10.0.2.2:5000/api/orders/create",
        orderData
      );
      dispatch(cleanCart());
      setFullName("");
      setAddress("");
      setCity("");
      setPhone("");
      console.log("Order saved successfully:", response.data);
      ToastAndroid.show("Order successful", ToastAndroid.SHORT);
      navigation.navigate("Payment");
      // Optionally, you can navigate to a success screen or perform any other action
      
    } catch (error) {
      console.error("Error saving order:", error);
      // Handle error - show an error message to the user or retry the operation
      Alert.alert("Error", "Failed to save order. Please try again later.");
    }
  };

  const onUrlChange = (webviewState) => {
    console.log("webviewState", webviewState);
    if (webviewState.url.includes("https://example.com/cancel")) {
      clearPaypalState();
      alert("close webview");
      return;
    }
    if (webviewState.url.includes("https://example.com/return")) {
      const urlValues = queryString.parseUrl(webviewState.url);
      console.log("my urls value", urlValues);
      const { token } = urlValues.query;
      if (!!token) {
        paymentSucess(token);
      }
    }
  };
  const paymentSucess = async (id) => {
    try {
      const res = paypalApi.capturePayment(id, accessToken);
      console.log("capturePayment res++++", res);
      alert("Payment sucessfull...!!!");
      clearPaypalState();
      

      // Prepare order data
      const orderData = {
        shippingAddress: { fullName, address, city, phone },
        totalPrice: total,
        user: userID,
        storeId: storeID,
        paymentMethod: "Paypal",
        orderItems: orderItems,
      };

      try {
        // Send order data to the backend API using Axios
        const response = await axios.post(
          "http://10.0.2.2:5000/api/orders/create",
          orderData
        );
        setFullName("");
        setAddress("");
        setCity("");
        setPhone("");
        dispatch(cleanCart());
        console.log("Order saved successfully:", response.data);
        // Optionally, you can navigate to a success screen or perform any other action
      } catch (error) {
        console.error("Error saving order:", error);
        // Handle error - show an error message to the user or retry the operation
        Alert.alert("Error", "Failed to save order. Please try again later.");
      }
    } catch (error) {
      console.log("error raised in payment capture", error);
    }
  };
  const clearPaypalState = () => {
    setPaypalUrl(null);
    setAccessToken(null);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 35 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={47} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Subtotal : </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "red" }}>
          {total}$
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#D0D0D0",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 30,
            width: 300,
          }}
        >
          <MaterialIcons
            style={{ marginLeft: 8 }}
            name="drive-file-rename-outline"
            size={34}
            color="black"
          />
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={{
              color: "black",
              marginVertical: 10,
              width: 300,
              fontSize: fullName ? 15 : 17,
              fontWeight: "bold",
              marginLeft: 20,
            }}
          />
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
          }}
        >
          <Entypo
            style={{ marginLeft: 8 }}
            name="address"
            size={34}
            color="black"
          />
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            style={{
              color: "black",
              marginVertical: 10,
              width: 300,
              fontSize: address ? 15 : 17,
              fontWeight: "bold",
              marginLeft: 20,
            }}
          />
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
          }}
        >
          <FontAwesome5
            style={{ marginLeft: 8 }}
            name="city"
            size={34}
            color="black"
          />
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            style={{
              color: "black",
              marginVertical: 10,
              width: 300,
              fontSize: city ? 15 : 17,
              fontWeight: "bold",
              marginLeft: 20,
            }}
          />
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
          }}
        >
          <AntDesign
            style={{ marginLeft: 8 }}
            name="phone"
            size={34}
            color="black"
          />
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
            style={{
              color: "black",
              marginVertical: 10,
              width: 300,
              fontSize: phone ? 15 : 17,
              fontWeight: "bold",
              marginLeft: 20,
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={onPressPaypal}
        style={{
          width: 200,
          backgroundColor: "#FEBE10",
          borderRadius: 6,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 15,
          alignContent: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ textAlign: "center" }}>Payment with Paypal</Text>
      </TouchableOpacity>
      <Modal visible={!!paypalUrl}>
        <TouchableOpacity onPress={clearPaypalState} style={{ margin: 24 }}>
          <Ionicons name="arrow-back-circle" size={47} color="black" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {paypalUrl && (
            <WebView
              source={{ uri: paypalUrl }}
              onNavigationStateChange={onUrlChange}
            />
          )}
        </View>
      </Modal>
      <TouchableOpacity
        onPress={handleCOD}
        style={{
          width: 200,
          backgroundColor: "#0c378b",
          borderRadius: 6,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 15,
          alignContent: "center",
          marginTop: 5,
        }}
      >
        <Text style={{ textAlign: "center" }}>COD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentScreen;
