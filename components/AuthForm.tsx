import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router } from "expo-router";
import { authFormSchema } from "@/utils";
import { Signin, Signup } from "@/services/appwrite";
import Toast from "react-native-toast-message";

const AuthForm = ({ type }: { type: "signin" | "signup" }) => {
  const formSchema = authFormSchema(type);
  type Schema = z.infer<typeof formSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(formSchema),
  });

  const onSuccess = (msg: string) => {
    Toast.show({
      type: "success",
      text1: msg,
      text2: "Welcome to the app 👋",
      position: "top",
      visibilityTime: 2000,
    });
  };

  const onError = (msg: string) => {
    Toast.show({
      type: "error",
      text1: msg,
      text2: "Please try again",
      position: "top",
      visibilityTime: 2000,
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (type === "signup") {
        const newData = {
          password: data.password,
          firstName: data.firstName!,
          lastName: data.lastName!,
          email: data.email,
        };
        const result = await Signup(newData);
        if (result.success) {
          onSuccess(result.message);
          router.replace("/");
        } else {
          onError(result.message);
        }
      } else {
        const result = await Signin({
          email: data.email,
          password: data.password,
        });
        if (result.success) {
          onSuccess(result.message);
          router.replace("/");
        } else {
          onError(result.message);
        }
      }
    } catch (error) {
      console.log("Error signing in", error);
    }
  });

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <View className="w-[80%] border border-gray-300 rounded-lg p-5">
        <View className="bg-[#F8F8F8] flex flex-row justify-center items-center p-2 rounded-lg mb-5">
          <Text className="text-xl font-bold text-accent">
            {type === "signin" ? "Signin" : "Signup"}
          </Text>
        </View>

        {type === "signup" && (
          <View className="flex flex-row justify-between items-center mb-3 gap-2">
            <View className="w-[46%]">
              <Text className="text-sm font-semibold text-white">
                Firstname
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-2 text-white"
                onChangeText={(text) => setValue("firstName", text)}
                placeholder="John"
                placeholderTextColor={"#A0A0A0"}
              />
              {errors.firstName && (
                <Text className="text-red-500">{errors.firstName.message}</Text>
              )}
            </View>

            <View className="w-[46%]">
              <Text className="text-sm font-semibold text-white">Lastname</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-2 text-white"
                onChangeText={(text) => setValue("lastName", text)}
                placeholder="Doe"
                placeholderTextColor={"#A0A0A0"}
              />
              {errors.lastName && (
                <Text className="text-red-500">{errors.lastName.message}</Text>
              )}
            </View>
          </View>
        )}

        <View className="mb-3">
          <Text className="text-sm font-semibold text-white">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-2 text-white"
            onChangeText={(text) => setValue("email", text)}
            placeholder="Johndoe@gmail.com"
            placeholderTextColor={"#A0A0A0"}
          />
          {errors.email && (
            <Text className="text-red-500">{errors.email.message}</Text>
          )}
        </View>

        <View className="mb-3">
          <Text className="text-sm font-semibold text-white">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-2 text-white"
            onChangeText={(text) => setValue("password", text)}
            placeholder="*Topsecret*"
            placeholderTextColor={"#A0A0A0"}
            secureTextEntry={true} 
          />
          {errors.password && (
            <Text className="text-red-500">{errors.password.message}</Text>
          )}
        </View>

        <View className="flex flex-row justify-center items-center mb-3 gap-2">
          <Text className="text-sm font-semibold text-white">
            {type === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </Text>
          <Link
            href={type === "signin" ? "/signup" : "/signin"}
            className="font-bold text-accent"
          >
            {type === "signin" ? "Signup" : "Signin"}
          </Link>
        </View>

        <TouchableOpacity className="bg-accent rounded-lg" onPress={onSubmit}>
          <Text className="text-center text-lg font-bold p-2 rounded-lg text-white">
            {type === "signin" ? "Signin" : "Signup"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({});
