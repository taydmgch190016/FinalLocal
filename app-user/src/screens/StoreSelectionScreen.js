// StoreSelectionScreen.js

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreSelectionScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:5000/api/client/stores/listStore"
      );
      const userID = await AsyncStorage.getItem('userID');
      console.log("userID",userID);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleStoreSelection = async (storeId) => {
    try{
      await AsyncStorage.setItem('selectedStoreId', storeId);
      console.log("save selectedStoreId done!")
    }catch (error) {
      console.error("Error fetching stores:", error);
    }
    navigation.replace("Main", {
      screen: "Home", 
      params: { storeId } 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
          style={{ width: 150, height: 100, marginTop: 100}}
          source={{
            uri: "https://res.cloudinary.com/dcc0yhyjq/image/upload/v1712695169/xakwryqc6r1gwhptqfzt.png",
          }}
        />
      <Text style={styles.title}>Select a Store</Text>
      <View style={styles.optionsContainer}>
        {stores.map((store) => (
          <TouchableOpacity
            key={store._id}
            style={styles.option}
            onPress={() => handleStoreSelection(store._id)}
          >
            <Text style={styles.optionText}>{store.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionsContainer: {
    width: "80%",
  },
  option: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1, // Độ dày của đường viền
    borderColor: "#ccc", // Màu của đường viền
  },
  optionText: {
    fontSize: 16,
  },
});

export default StoreSelectionScreen;
