import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { BlurView } from 'expo-blur';
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const SeriesCard = ({
  series,
}: {
  series: {
    adult: boolean;
    id: number;
    poster_path: string;
    name: string;
    vote_average: number;
    first_air_date: String;
  };
}) => {
  return (
    <Link href={`/series/${series.id}` as "/series/[id]"} asChild>
      <TouchableOpacity className="w-32 relative">
        <Image
          source={{
            uri: series.poster_path
              ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
              : "https://via.placeholder.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full rounded-lg h-52"
          resizeMode="cover"
        />
        <View className="mt-2">
            <Text className="font-bold text-sm text-accent" numberOfLines={1}>{series.name}</Text> 
            <Text className="font-semibold text-xs text-light-200">{series.first_air_date?.split("-")[0]}</Text>
        </View>
        <BlurView className="w-[30px] h-[20px] rounded-lg absolute top-2 right-2 flex-row justify-between items-center px-1" intensity={125} style={{borderRadius:50, overflow:"hidden"}}>
            <Image source={icons.star} className="size-4"/>
            <Text className="text-primary text-sm font-bold">{Math.round(series.vote_average / 2)}</Text>
        </BlurView>
      </TouchableOpacity>
    </Link>
  );
};

export default SeriesCard;

const styles = StyleSheet.create({});
