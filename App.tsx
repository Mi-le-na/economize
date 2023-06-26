import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import {
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [task, setTask] = useState<any>([]);
  const [newTask, setNewTask] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [customInterval, setCustonInterval] = useState<NodeJS.Timer>();

  async function addTask() {
    if (newTask == "") {
      Alert.alert("Atenção", "Nome da tarefa vazio!");
      return;
    }
    if (minutes == 0 && seconds == 0) {
      Alert.alert("Atenção", "Tempo vazio!");
      return;
    }
    const search = task.filter((task: any) => task.name === newTask);

    if (search.length !== 0) {
      Alert.alert("Atenção", "Nome da tarefa repetido!");
      return;
    }

    setTask([...task, { name: newTask, minutes, seconds }]);
    setNewTask("");
    Clear();
    Keyboard.dismiss();
  }

  const starTimer = () => {
    setCustonInterval(
      setInterval(() => {
        changeTime();
      }, 1000)
    );
  };

  const stopTimer = () => {
    if (customInterval) {
      clearInterval(customInterval);
    }
  };

  const Clear = () => {
    stopTimer();
    setSeconds(0);
    setMinutes(0);
  };

  const changeTime = () => {
    setSeconds((prevState) => {
      if (prevState + 1 == 60) {
        setMinutes((prevState) => {
          return prevState + 1;
        });
        return 0;
      }
      return prevState + 1;
    });
  };


  // const changeTimer = () => {
  //   setSeconds((prevState) => {
  //     if (prevState + 1 == 60) {
  //       setMinutes((prevState) => {
  //         return prevState + 1;
  //       });
  //       return 0;
  //     }
  //     return prevState + 1;
  //   });
  // };



  async function removeTask(item: any) {
    Alert.alert(
      "Deletar Task",
      "Tem certeza que deseja remover esta anotação?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => setTask(task.filter((tasks: any) => tasks.name !== item))
        }
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    async function carregaDados() {
      const task = await AsyncStorage.getItem("task");

      if (task) {
        setTask(JSON.parse(task));
      }
    }
    carregaDados();
  }, []);

  useEffect(() => {
    async function salvaDados() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    salvaDados();
  }, [task]);

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === "ios"}
      >
        <View style={styles.container2}>
          <Text style={styles.textTimer}>
            {minutes < 10 ? "0" + minutes : minutes}:
            {seconds < 10 ? "0" + seconds : seconds}
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Iniciar" onPress={starTimer} />
            <Button title="Parar" onPress={stopTimer} />
            <Button title="Limpar" onPress={Clear} />
          </View>
          <View style={styles.nometarefa}>
            <TextInput
              style={styles.Input}
              placeholderTextColor="#999"
              autoCorrect={true}
              value={newTask}
              placeholder="Adicione uma tarefa"
              maxLength={25}
              onChangeText={text => setNewTask(text)}
            />
            <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
              <Ionicons name="ios-add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.Body}>
            <FlatList
              data={task}
              // keyExtractor={item => item.toString()} 
              showsVerticalScrollIndicator={false}
              style={styles.FlatList}
              renderItem={({ item }) => (
                <View style={styles.ContainerView}>
                  <Text style={styles.Texto}>{item.name}</Text>
                  <Text style={styles.Texto}>{item.minutes}:{item.seconds}</Text>
                  <TouchableOpacity onPress={() => removeTask(item.name)}>
                    <MaterialIcons
                      name="delete-forever"
                      size={25}
                      color="#f64c75"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  nometarefa: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    padding: 15,
    paddingBottom: 0,
  },

  container2: {
    flex: 1,
    backgroundColor: "#00BCD4",  //fundo do timer
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  textTimer: {
    fontSize: 55,
    backgroundColor: "#303F9F",
    borderRadius: 10,
    padding: 5,
    color: "#fff",
    marginTop: 5,
  },
  buttonContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 5,
    backgroundColor: "#00BCD4"  //tela dos lembretes
  },
  Body: {
    flex: 1
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#fff"
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10
  },
  FlatList: {
    flex: 1,
    marginTop: 5
  },
  Texto: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center"
  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: "#fff",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#BDBDBD"
  }
});