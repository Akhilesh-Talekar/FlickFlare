import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies, fetchSeries } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getAccout, getTrendingMovies} from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import SeriesCard from "@/components/SeriesCard";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  const {
    data: series,
    loading: seriesLoading,
    error: seriesError,
  } = useFetch(fetchSeries);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

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

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: 100, paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <Text className="text-4xl text-accent text-center font-bold">Hello {user?.firstName}</Text>

        {(moviesLoading || trendingMoviesLoading || seriesLoading) ? (
          <ActivityIndicator
            size="large"
            color={"#0000ff"}
            className="mt-10 self-center"
          />
        ) : (moviesError || trendingMoviesError || seriesError) ? (
          <View className="h-full w-full flex-col justify-end items-center">
            <Image source={require("@/assets/images/Error.png")} />
            <Text className="text-white text-lg font-bold mt-5">
              Oops! Something went wrong.
            </Text>
          </View>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder={"Search for a Movie, TV Show, Person..."}
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg font-bold text-white mb-3">
                  Trending Movies
                </Text>
              </View>
            )}

            <FlatList
              data={trendingMovies}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View className="w-[30px]"/>
              )}
              keyExtractor={(item) => item.$id.toString()}
              renderItem={({ item, index }) => (
                <TrendingCard movie={item} index={index}/>
              )}
            />

            {series && (
              <View className="mt-10">
                <Text className="text-lg font-bold text-white mb-3">
                  Trending Series
                </Text>
              </View>
            )}

            <FlatList
            data={series}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View className="w-[30px]"/>
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <SeriesCard series={item}/>
            )}
            />


            <>
              <Text className="text-lg text-white font-bold mt-10 mb-3">
                Latest Movies
              </Text>

              <FlatList
                showsHorizontalScrollIndicator={false}
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  padding: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
