import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import MaskedView from "@react-native-masked-view/masked-view";

const TrendingCard = ({movie, index}:TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>
        <TouchableOpacity className="w-32 relative pl-5">
            <Image source={{
                uri: movie.poster_url,
            }} className="w-32 h-48 rounded-lg"
            resizeMode="cover"/>

            <View className="absolute bottom-9 -left-2 px-1 py-1">
                <MaskedView
                maskElement={
                    <Text className="text-white text-6xl font-bold">{index+1}</Text>
                }
                >
                    <Image source={images.rankingGradient} className="size-14" resizeMode="cover"/>
                </MaskedView>
            </View>
            <Text className="text-sm font-bold mt-2 text-accent" numberOfLines={1}>{movie.title}</Text>
        </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;

const styles = StyleSheet.create({});
