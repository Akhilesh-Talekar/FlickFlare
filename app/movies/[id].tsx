import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Toast from "react-native-toast-message";
import { addToWatchlist, getAccout, removeFromWatchlist, setStatus } from "@/services/appwrite";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col item-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-200 font-bold text-sm mt-2">
      {value ? value : "N/A"}
    </Text>
  </View>
);

const GenresInfo = ({ label, generes }: { label: string; generes?: any[] }) => (
  <View className="flex-col item-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    {generes && generes.length > 0 ? (
      <View className="flex flex-row flex-wrap justify-start items-center">
        {generes.map((genre) => (
          <View
            key={genre.id}
            className="bg-slate-500 px-2 py-1 rounded-md mr-2 mt-2"
          >
            <Text className="text-white text-sm text-bold">{genre.name}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-light-200 font-bold text-sm mt-2">N/A</Text>
    )}
  </View>
);

const BudgetInfo = ({ label, value }: { label: string; value: number }) => (
  <View className="flex-col item-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-200 font-bold text-sm mt-1">
      {!value
        ? "N/A"
        : value === 0
        ? "N/A"
        : `$${Math.round(value / 1000000)} million`}
    </Text>
  </View>
);

const ProductionInfo = ({ label, value }: { label: string; value: any[] }) => (
  <View className="flex-col item-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    {value && value.length > 0 ? (
      <View className="flex flex-row flex-wrap justify-start items-center">
        {value.map((val) => (
          <View
            key={val.id}
            className="bg-slate-500 px-2 py-1 rounded-md mr-2 mt-2"
          >
            <Text className="text-white text-sm text-bold">{val.name}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-light-200 font-bold text-sm mt-2">N/A</Text>
    )}
  </View>
);

const Moviedetails = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = React.useState<any>(null);
  const [watchlist, setWatchlist] = React.useState<boolean>(false);

  useEffect(() => {
    const getUserData = async () => {
      const user = await getAccout();
      if (!user.success) {
        return;
      }
      setUser(user.user);
    };
    getUserData();
  },[])

  useEffect(() => {
    const checkWatchlist = async () => {
      if(user){
        const status = await setStatus({user: user.$id, id: id as string});
        if (status) {
          setWatchlist(true);
        }
        else {
          setWatchlist(false);
        }
      }
    }
    checkWatchlist();
  },[user])

  const onSuccess = (msg: string) => {
      Toast.show({
        type: "success",
        text1: msg,
        position: "top",
        visibilityTime: 2000,
      });
    };
  
    const onError = (msg: string) => {
      Toast.show({
        type: "error",
        text1: msg,
        position: "top",
        visibilityTime: 2000,
      });
    };

  const changeWatchlist = async() => {
    setWatchlist(!watchlist);
    if (!watchlist) {
      // Add to watchlist
      await addToWatchlist({id: id as string, user: user.$id});
      onSuccess("Added to watchlist");
    } else {
      // Remove from watchlist
      await removeFromWatchlist(id as string);
      onError("Removed from watchlist");
    }
  };

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(id as string));

  return (
    <View className="bg-primary flex-1" style={{ minHeight: 100 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className="flex-1"
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`,
            }}
            className="w-full h-[600px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex flex-row justify-between items-center w-full">
            <Text className="text-white font-bold text-xl" numberOfLines={2}>
              {movie?.title}
            </Text>
            {watchlist ? (
              <TouchableOpacity onPress={changeWatchlist}>
                <Image
                  source={require("@/assets/images/bookmarkAdded.png")}
                  className="size-8"
                  tintColor={"#AB8BFF"}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={changeWatchlist}>
                <Image
                  source={require("@/assets/images/bookmark.png")}
                  className="size-8"
                  tintColor={"white"}
                />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row item-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}min</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white text-bold text-sm">
              {Math.round(movie?.vote_average / 2) || 0}/5
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <GenresInfo label="Genres" generes={movie?.genres} />
          <View className="flex-row items-center gap-x-5 mt-3">
            <BudgetInfo label="Budget" value={movie?.budget} />
            <BudgetInfo label="Revenue" value={movie?.revenue} />
          </View>
          <ProductionInfo
            label="Production Companies"
            value={movie?.production_companies}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row justify-center items-center z-50"
        onPress={() => {
          router.back();
        }}
      >
        <Image
          source={icons.arrow}
          className="size-5 rounded-full bg-accent rotate-180"
          resizeMode="contain"
          tintColor={"#fff"}
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Moviedetails;

const styles = StyleSheet.create({});
