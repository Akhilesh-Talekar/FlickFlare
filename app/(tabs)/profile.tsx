import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getAccout, Signout } from "@/services/appwrite";
import { router } from "expo-router";

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getAccout();
      if (!user) {
        return;
      } else if (user.success) {
        setUserData(user.user);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const result = await Signout();
    router.replace("/signin");
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Header */}
      <View className="pt-12 px-6 pb-6 bg-[#1E293B] rounded-b-3xl shadow-lg">
        <Text className="text-white text-2xl font-bold mb-8">My Profile</Text>

        {/* Avatar and name section */}
        <View className="items-center mb-3">
          <View className="border-4 border-[#38BDF8] rounded-full mb-4">
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
              }}
              className="w-28 h-28 rounded-full"
            />
          </View>
          <Text className="text-white text-xl font-bold">{userData?.firstName} {userData?.lastName}</Text>
          <Text className="text-gray-400">{userData?.email}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around bg-[#111827] mx-6 -mt-6 p-4 rounded-xl shadow-lg">
        <View className="items-center">
          <Text className="text-[#38BDF8] text-xl font-bold">{10}</Text>
          <Text className="text-gray-400">Favorites</Text>
        </View>
        <View className="h-full w-[1px] bg-gray-700"></View>
        <View className="items-center">
          <Text className="text-[#38BDF8] text-xl font-bold">{20}</Text>
          <Text className="text-gray-400">Watchlist</Text>
        </View>
      </View>

      {/* Settings Section */}
      <View className="mt-8 mx-6">
        <Text className="text-white font-bold">Settings</Text>
        <View className="flex-row flex-wrap justify-between mt-4">
          <TouchableOpacity className="flex-row items-center bg-[#1E293B] p-4 rounded-xl mb-3 w-[46%]">
            <Ionicons name="person-outline" size={22} color="#38BDF8" />
            <Text className="ml-3 text-white">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-[#1E293B] p-4 rounded-xl mb-3 w-[46%]">
            <Ionicons name="notifications-outline" size={22} color="#38BDF8" />
            <Text className="ml-3 text-white">Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-[#1E293B] p-4 rounded-xl mb-3 w-[46%]">
            <Ionicons name="settings-outline" size={22} color="#38BDF8" />
            <Text className="ml-3 text-white">App Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-[#1E293B] p-4 rounded-xl mb-3 w-[46%]">
            <Ionicons name="help-circle-outline" size={22} color="#38BDF8" />
            <Text className="ml-3 text-white">Help & Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <View className="px-6 mt-3 mb-8">
        <TouchableOpacity
          className="bg-[#DC2626] p-4 rounded-xl flex-row justify-center items-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="white" />
          <Text className="ml-2 text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
