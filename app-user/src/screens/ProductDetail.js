import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Pressable
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartReducer";
const ProductDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const addItemToCart = (item) =>{
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
        setAddedToCart(false);
    }, 6000);
  }
  const cart = useSelector((state)=> state.cart.cart);
  console.log(cart);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{marginTop:35, flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Ionicons name="arrow-back-circle" size={47} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate("Cart")}>
            <MaterialCommunityIcons name="cart-arrow-right" size={47} color="black" />
            </TouchableOpacity>
        </View>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={{ marginTop: "100" }}>
          <Image
            source={{ uri: route?.params?.productImage }}
            style={{ width: "100%", height: 300 }}
          />
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontWeight: "bold", marginLeft:5, fontSize: 20}}>{route?.params?.productName}</Text>
        <Text style={{fontWeight: "bold",fontSize: 20, color:"red"}}>Price: {route?.params?.productPrice} $</Text>
        </View>
        <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />
        <ScrollView style={{height:200}}>
        <Text style={{}}>{route?.params?.productDes}</Text>
        </ScrollView>
        <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />
        <Text style={{fontWeight: "bold", marginLeft:5, fontSize: 20}}>In stock: {route?.params?.productQuantity}</Text>
        <Pressable
        onPress={() => addItemToCart(route?.params?.product)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        {addedToCart ? (
          <Text>Added to cart</Text>
        ) : (
          <Text>Add to cart</Text>
        )}
        </Pressable>

        <Pressable
        style={{
          backgroundColor: "#FFAC1C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
        onPress={async () => {
          try {
            await addItemToCart(route?.params?.product);
            navigation.navigate("Payment");
          } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error adding item to cart:", error);
          }
        }}
      >
        <Text>Buy Now</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
