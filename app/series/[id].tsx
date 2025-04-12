import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchMovieDetails, fetchSeriesDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

interface MovieInfoProps {
  label: string;
  value?: { [key: string]: any };
}

const SeriesInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col item-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <View className="flex-row items-center gap-x-2">
      <Text className="text-light-200 font-bold text-sm mt-2">
        {value?.name ? value.name : "N/A"}
      </Text>
      <Text className="text-light-200 font-bold text-sm mt-2 ml-5">
        Release Year: {value?.air_date ? value.air_date.split("-")[0] : "N/A"}
      </Text>
    </View>
    <Text className="text-light-200 font-bold text-sm mt-2">
      {value?.overview ? value.overview : "N/A"}
    </Text>
    <View className="flex-row gap-x-2 justify-start items-center">
      <View className="p-2 bg-slate-500 rounded-md mt-5">
        <Text className="text-sm font-bold text-white">
          {value?.episode_count ? value.episode_count : "N/A"} Episodes
        </Text>
      </View>
      <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-5">
        <Image source={icons.star} className="size-4" />
        <Text className="text-white text-bold text-sm">
          {Math.round(value?.vote_average / 2) || 0}/5
        </Text>
      </View>
    </View>
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

const SeasonInfo = ({
  label,
  seasons,
  onSeasonChange,
}: {
  label: string;
  seasons?: any[];
  onSeasonChange: (index: number) => void;
}) => (
  <View className="flex-col item-start justify-start mt-5">
    <Text className="text-light-200 font-normal text-lg">{label}</Text>
    {seasons && seasons.length > 0 ? (
      <View style={{ height: 40 }}>
        <FlatList
          data={seasons}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
          ItemSeparatorComponent={() => <View className="w-[30px]" />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="bg-slate-500 px-2 py-1 rounded-md h-[30px] flex-row items-center justify-center"
              onPress={() => onSeasonChange(index)}
            >
              <Text className="text-white text-sm font-bold">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    ) : (
      <Text className="text-light-200 font-bold text-sm mt-2">N/A</Text>
    )}
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

const Seriesdetails = () => {
  const { id } = useLocalSearchParams();
  const [seasonData, setSeasonData] = React.useState<any>(null);

  const {
    data: series,
    loading,
    error,
  } = useFetch(() => fetchSeriesDetails(id as string));

  useEffect(() => {
    if (!seasonData && series) {
      setSeasonData(series.seasons[0]);
    }
  }, [series]);

  const handleSeasonChange = (season: any) => {
    setSeasonData(series.seasons[season]);
  };

  return (
    <View className="bg-primary flex-1" style={{ minHeight: 100 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        className="flex-1"
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${series?.poster_path}`,
            }}
            className="w-full h-[600px]"
            resizeMode="stretch"
          />
        </View>
        <View className="flex-col justify-start items-start mt-5 px-5">
          <Text className="text-xl text-light-200 font-bold" numberOfLines={2}>
            {series?.name}
          </Text>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white text-bold text-sm">
              {Math.round(series?.vote_average / 2) || 0}/5
            </Text>
            <Text className="text-light-200 text-sm">
              ({series?.vote_count} votes)
            </Text>
          </View>
          <GenresInfo label="Genres" generes={series?.genres} />
          <SeasonInfo
            label="Seasons"
            seasons={series?.seasons}
            onSeasonChange={handleSeasonChange}
          />
          <SeriesInfo label="Overview" value={seasonData} />
          <ProductionInfo
            label="Production Companies"
            value={series?.production_companies}
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

export default Seriesdetails;

const styles = StyleSheet.create({});
