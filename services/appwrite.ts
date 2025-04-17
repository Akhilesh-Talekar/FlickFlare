import { Client, Databases, Account, Query, ID } from "react-native-appwrite";
import * as SecureStore from "expo-secure-store";
import { fetchMovieDetails } from "./api";
import { set } from "zod";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_METRICS_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_ID!;
const APPWRITE_USER_ID = process.env.EXPO_PUBLIC_APPWRITE_USER_ID!;
const APPWRITE_WATCHLIST_ID = process.env.EXPO_PUBLIC_APPWRITE_WATCHLIST_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(APPWRITE_PROJECT_ID); // Your project ID

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      APPWRITE_METRICS_ID,
      [Query.equal("searchTerm", query.toLowerCase())]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        APPWRITE_METRICS_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        APPWRITE_METRICS_ID,
        ID.unique(),
        {
          searchTerm: query.toLowerCase(),
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          title: movie.title,
          movie_id: movie.id,
        }
      );
    }
  } catch (error) {
    console.log("Error updating search count", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      APPWRITE_METRICS_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );

    return result.documents as unknown as TrendingMovie[];
  } catch (err) {
    console.log("Error fetching trending movies", err);
  }
};

export const Signup = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  try {
    const result = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    const session = await account.createEmailPasswordSession(email, password);
    const createUser = await database.createDocument(DATABASE_ID, APPWRITE_USER_ID, result.$id, {
      sessionId: result.$id,
      firstName: firstName,
      lastName: lastName,
      email: email,
    })
    return { success: true, message: "Signup Successful" };
  } catch (err: any) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

export const Signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, message: "Signin Successful" };
  } catch (err: any) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

export const Signout = async () => {
  try {
    const result = await account.deleteSession("current");
    return{ success: true, result }
  } catch (err) {
    return { success: false, message: "Signout err try again" };
  }
};

export const getAccout = async () => {
  try {
    const result = await account.get();
    const user = await database.listDocuments(
      DATABASE_ID,
      APPWRITE_USER_ID,
      [Query.equal("sessionId", result.$id)]
    );
    return { success: true, user: user.documents[0] };
  } catch (err) {
    return { success: false, message: "Error fetching account" };
  }
}

export const addToWatchlist = async ({id, user}:{id:string, user:string}) => {
  try{
    const movie = await fetchMovieDetails(id);
    const result = await database.createDocument(
      DATABASE_ID,
      APPWRITE_WATCHLIST_ID,
      ID.unique(),
      {
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        title: movie.title,
        vote_average: Math.round(movie.vote_average),
        user: user,
        movie_id: id,
        overview: movie.overview,
      }
    );
  }
  catch (err) {
    console.log(err);
  }
}

export const removeFromWatchlist = async (id: string) => {
  try {
    const res = await database.listDocuments(
      DATABASE_ID,
      APPWRITE_WATCHLIST_ID,
      [Query.equal("movie_id", id)]
    );

    const result = await database.deleteDocument(
      DATABASE_ID,
      APPWRITE_WATCHLIST_ID,
      res.documents[0].$id
    );
  } catch (err) {
    console.log(err);
  }
  return { success: true, message: "Removed from watchlist" };
}


export const setStatus = async ({user, id}:{user:string, id:string}) => {
 try{
   const inList = await database.listDocuments(
      DATABASE_ID,
      APPWRITE_WATCHLIST_ID,
      [Query.equal("user", user), Query.equal("movie_id", id)]
   )
    if (inList.total > 0) {
      return true;
    } else {
      return false;
    }
 } 
 catch (err) {
    console.log(err);
    return false;
 }
}