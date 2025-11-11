import { useContext, useState, useEffect } from "react";
import {
  ColorSchemeName,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Animated, { LinearTransition } from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import { data } from "@/data/todos.js";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ThemeContext } from "@/context/ThemeContext";

import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Octicons from "@expo/vector-icons/Octicons";

import { Colors } from "@/Constants/Colors";

// interface Todo {
//   id: number;
//   title: string;
//   completed: boolean;
// }

export default function Index() {
  const [todos, setTodos] = useState<
    {
      id: number;
      title: string;
      completed: boolean;
    }[]
  >([]);

  const [text, setText] = useState("");

  const [loaded, error] = useFonts({ Inter_500Medium });

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async function () {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          setTodos(
            storageTodos.sort(
              (
                a: { id: number; title: string; completed: boolean },
                b: { id: number; title: string; completed: boolean }
              ) => b.id - a.id
            )
          );
        } else {
          setTodos(
            data.sort(
              (
                a: { id: number; title: string; completed: boolean },
                b: { id: number; title: string; completed: boolean }
              ) => b.id - a.id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    const storeData = async function () {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (e) {
        console.log(e);
      }
    };

    storeData();
  }, [todos]);

  if (!loaded && !error) {
    return null;
  }
  const styles = createStyles(theme, colorScheme);

  const addTodo = function () {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;

      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  };

  const toggleTodo = function (id: number) {
    setTodos(
      todos.map(function (todo: {
        id: number;
        title: string;
        completed: boolean;
      }): { id: number; title: string; completed: boolean } {
        if (todo.id === Number(id)) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      })
    );
  };

  const removeTodo = function (id: number) {
    setTodos(
      todos.filter(function (todo: {
        id: number;
        title: string;
        completed: boolean;
      }) {
        return todo.id !== Number(id);
      })
    );
  };

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; completed: boolean };
  }) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons
          name="delete-circle"
          size={36}
          color="red"
          selectable={undefined}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new Todo"
          placeholderTextColor="grey"
          value={text}
          onChangeText={setText}
        />

        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginLeft: 10 }}
        >
          {colorScheme === "dark" ? (
            <Octicons
              name="moon"
              color={theme.text}
              size={36}
              selectable={undefined}
              style={{ width: 36 }}
            />
          ) : (
            <Octicons
              name="sun"
              color={theme.text}
              size={36}
              selectable={undefined}
              style={{ width: 36 }}
            />
          )}
        </Pressable>
      </View>

      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo: {
          id: number;
          title: string;
          completed: boolean;
        }): string => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(
  theme: typeof Colors.light | typeof Colors.dark,
  colorScheme: ColorSchemeName
) {
  return StyleSheet.create({
    addButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
      fontFamily: "Inter_500Medium",
    },

    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },

    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
      padding: 10,
      borderBottomColor: "gray",
      borderBottomWidth: 1,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text,
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  });
}
