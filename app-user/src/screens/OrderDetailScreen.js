import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'; 
import PropTypes from 'prop-types';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const OrderDetailScreen = ({ route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:5000/api/orders/${orderId}`);
        setOrder(response.data); // Giả sử dữ liệu trả về là một đơn hàng
      } catch (error) {
        console.error('Error fetching order detail:', error);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#85F2CC" }}>
      <View style={{ marginTop: 35 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle" size={47} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={{textAlign:"center", fontSize: 25, fontWeight: "bold", fontStyle:'italic'}}>Order Detail</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{marginLeft:10, marginRight:10}}>
      {order ? (
        <View>
          <Text>Order ID: {order._id}</Text>
          <Text>Name: {order.shippingAddress.fullName}</Text>
          <Text>Phone numbers: {order.shippingAddress.phone}</Text>
          <Text>Address: {order.shippingAddress.address}, {order.shippingAddress.city}</Text>
          <Text style={{fontWeight:"bold"}}>Order Items:</Text>
          {order.orderItems.map((item, itemIndex) => (
            <View key={itemIndex} style={{backgroundColor:"#78CDD3", margin:3, borderRadius: 5}}>
              <Text>Product Name: {item.name}</Text>
              <Text>Product Price: {item.price}$</Text>
              <Text>Quantity: {item.quanlity}</Text>
            </View>
          ))}
          <Text style={{fontWeight:"bold", color:"red"}}>Total Price: {order.totalPrice}$</Text>
          <Text>Payment Method: {order.paymentMethod}</Text>
          <Text style={{fontStyle:"italic"}}>Ordered At: {order.orderedAt}</Text>
          <Text style={{fontSize:20, fontWeight:"bold"}}>Delivery: {order.delivery ? "Done" : "Pending"}</Text>
        </View>
      ) : (
        <Text>Loading order detail...</Text>
      )}
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

OrderDetailScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

export default OrderDetailScreen;
