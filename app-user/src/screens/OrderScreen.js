import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userID = await AsyncStorage.getItem("userID");
        if (userID) {
          const response = await axios.get(
            `http://10.0.2.2:5000/api/orders/orderByUserId?userID=${userID}`
          );
          setOrders(response.data); // Giả sử dữ liệu trả về là một mảng các đơn hàng
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderPress = (orderId) => {
    // Chuyển đến trang orderDetail và truyền orderId
    navigation.navigate("OrderDetail", { orderId });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 35 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={47} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={{textAlign:"center", fontSize: 25, fontWeight: "bold", fontStyle:'italic'}}>Order History</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{margin:10}}>
          {orders.length > 0 ? (
            <View>
              {orders.map((order, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOrderPress(order._id)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "gray",
                      backgroundColor: "#B5BAC3",
                      marginTop: 10
                    }}
                  >
                    <Text>Order ID: {order._id}</Text>
                    <Text style={{fontWeight:"bold"}}>Total Price: {order.totalPrice} $</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text>No orders found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderScreen;
