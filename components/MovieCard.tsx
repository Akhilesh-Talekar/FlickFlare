import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  adult
}: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://via.placeholder.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <View className="mt-2">
          <Text className="text-white text-sm font-bold" numberOfLines={1}>{title}</Text>
          <View className="flex-row justify-between items-center mt-1">
            <View className="flex-row items-center mt-1">
              <Image
                source={icons.star}
                className="size-4"
                resizeMode="contain"
              />
              <Text className="text-white text-xs font-bold">
                {Math.round(vote_average / 2)}
              </Text>
            </View>
            {adult && (
              <View className="rounded-full px-2 py-[2px] flex-row items-center justify-center gap-1 border border-red-500">
                {/* <View className="size-1 rounded-full bg-red-500"/> */}
                <Text className="text-red-500 text-xs">
                  18+
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-1">
            <Text className="text-gray-400 text-xs">{release_date?.split("-")[0]}</Text>
            <Text className="text-gray-400 text-xs">Movie</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;

const styles = StyleSheet.create({});
