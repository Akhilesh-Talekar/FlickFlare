import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

const SearchBar = ({onPress, placeholder, value, onChangeText}:{onPress?:() => void, placeholder:string, value?:string, onChangeText?:(text:string) => void}) => {
  return (
    <View className="flex flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search} className="size-5" resizeMode="contain" tintColor={"#ab8bff"}/>
      <TextInput
      onPress={onPress}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={"#a8b5db"}
      className="flex-1 ml-2 text-white"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
