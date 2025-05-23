import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { router, Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { getAccout } from "@/services/appwrite";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: any;
  icon: any;
  title: any;
}) => {
  if (focused) {
    return (
      <ImageBackground
        source={require("@/assets/images/highlight.png")}
        className="flex flex-row flex-1 min-w-[100px] min-h-[60px] justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor={"#151312"} className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  } else {
    return (
      <View className="size-full justify-center items-center mt-1 rounded-full">
        <Image source={icon} tintColor={"#A8B5DB"} className="size-5" />
        {/* <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text> */}
      </View>
    );
  }
};

const _layout = () => {

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAccout();
      if(!result || !result.success) {
        router.replace("/signin")
      }
    }
    fetchData();
  },[])

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Saved" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
