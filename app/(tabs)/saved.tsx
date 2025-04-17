import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { images } from "@/constants/images";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { getAccout } from "@/services/appwrite";
import { Link, useFocusEffect } from "expo-router";
import { icons } from "@/constants/icons";

const Saved = () => {
  const [user, setUser] = useState<any>(null);
  // Mockup data for watchlist
  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        const user = await getAccout();
        if (!user.success) return;
        setUser(user.user);
      };

      getUserData();
    }, [])
  );

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full" />

      {/* Header with decoration */}
      <View className="pt-14 px-5 flex-row items-center justify-between">
        <View className="w-10" />
        <View className="flex-row items-center">
          <FontAwesome5 name="bookmark" size={22} color="#f1f5f9" />
          <Text className="text-slate-200 font-bold text-3xl ml-2">
            Watchlist
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#f1f5f9" />
        </TouchableOpacity>
      </View>

      {/* Main content */}

      {/* Decorative elements */}
      <View className="bg-slate-800/50 p-5 rounded-2xl mb-6 border border-slate-700 mx-3 mt-10 flex flex-row items-center justify-between">
        <Text className="text-white font-bold text-3xl">Your Collection</Text>
        <View className="w-px h-12 bg-slate-600" />
        <View className="flex flex-row">
          <View className="flex flex-col items-center justify-center">
            <Text className="text-accent font-bold text-3xl">
              {user ? user.watchlist.length : 0}
            </Text>
            <Text className="text-slate-200 font-bold text-sm">Movies</Text>
          </View>
          <Image
            source={require("@/assets/images/movieIcon.png")}
            className="size-20"
            tintColor={"#AB8BFF"}
          />
        </View>
      </View>
      <ScrollView className="flex-1 px-5 pt-6">
        {!user ? (
          <ActivityIndicator
            size="large"
            color={"#0000ff"}
            className="mt-10 self-center"
          />
        ) : user && user.watchlist.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Image
              source={require("@/assets/images/empty.png")}
              className="w-32 h-32"
            />
            <Text className="text-slate-200 font-bold text-lg mt-5">
              No movies in your watchlist
            </Text>
          </View>
        ) : (
          <View className="flex-col mt-3">
            {user?.watchlist.map((movie: any) => (
              <Link href={`/movies/${movie.movie_id}`} key={movie.$id} asChild>
                <TouchableOpacity>
                  <View
                    className="bg-slate-800/50 border border-slate-700 mx-3 flex-row justify-between rounded-2xl p-5 mb-4 gap-4"
                  >
                    <Image
                      source={{
                        uri: movie.poster_path,
                      }}
                      className="w-1/3 h-40"
                    />
                    <View className="flex-col w-[63%]">
                      <Text className="text-xl font-bold text-accent mb-2">
                        {movie?.title}
                      </Text>
                      <Text
                        className="text-xs font-bold text-slate-500 mb-2"
                        numberOfLines={3}
                      >
                        {movie?.overview}
                      </Text>
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                          <Image source={icons.star} className="size-4" />
                          <Text className="text-white text-bold text-sm">
                            {Math.round(movie?.vote_average / 2) || 0}/5
                          </Text>
                        </View>
                        <View className="flex-row bg-blue-500/50 rounded-full items-center justify-center px-3 py-1 gap-x-2 mt-2">
                          <View className="rounded-lg size-2 bg-red-500" />
                          <Text>Watch Now</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({});
