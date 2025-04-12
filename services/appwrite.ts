import { Client, Databases, Account, Query, ID } from "react-native-appwrite";
import * as SecureStore from "expo-secure-store";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(APPWRITE_PROJECT_ID); // Your project ID

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.equal("searchTerm", query.toLowerCase())]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        APPWRITE_COLLECTION_ID,
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
      APPWRITE_COLLECTION_ID,
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
    console.log("User signed up successfully", result);
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, message: "Signup Successful" };
  } catch (err: any) {
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
    console.log("User signed in successfully", session);
    return { success: true, message: "Signin Successful" };
  } catch (err: any) {
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
    return { success: true, result };
  } catch (err) {
    return { success: false, message: "Error fetching account" };
  }
}
