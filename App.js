import React from 'react';
import {
  Text,
  View,
  Button, 
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground, 
  Alert, 
  CheckBox, 
  Keyboard, 
  KeyboardAvoidingView
} from 'react-native';
import Constants from 'expo-constants';
import { Icon } from 'react-native-elements'
import { vibrate } from './utils';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import CountDown from 'react-native-countdown-component';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import DashboardComponent from './dashboard'; 
import AsyncStorage from "@react-native-community/async-storage";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


class FocusScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: [ 
        // have id, title, done prop
      ], 
      data: [], 
      running: false,
      until: 1500,
      id: 1,
    };

    this.secondsRemaining;
    this.isRunning = false;
  }

  saveData = async () => {
        try {
            await AsyncStorage.setItem('todos', JSON.stringify(this.state.data));
            await AsyncStorage.setItem('current', JSON.stringify(this.state.current));
            console.log('Test', AsyncStorage.getItem('todos'));
            // alert('Save is successful!');
            console.log("Save is successful")
        } catch (error) {
            console.log('Error saving');
        }
    };

    loadData = async () => {
        try {
            const value = await AsyncStorage.getItem('current');
            const todos = await AsyncStorage.getItem('todos');
            if (value !== null) {
                console.log('Old data loaded');
                this.setState({ current: JSON.parse(value) });
                this.setState({ data: JSON.parse(todos) });
            }
        } catch (error) {
            Alert.alert('Problem retriving data');
        }
    };

      componentDidMount = () => {
        this.loadData();
    };

    toggleCheckbox = (currentItem) => {
        const todos = [...this.state.data];

        // linear search to find the item to update
        let foundIndex = null;
        for (let i = 0; i < this.state.data.length; i++) {
            if (todos[i].id == currentItem.id) {
                foundIndex = i;
            }
        }
      
        if (foundIndex != null) {
            // clone the todo
            const newTodo = { ...currentItem };
            // inverse it's done status
            newTodo.done = !newTodo.done;

            todos[foundIndex] = newTodo;
        }

        // update current 
        this.state.current.done = !this.state.current.done;
  

        // merge back into the state
        this.setState({
            data: todos,
        });
    };


  render() {
    return (  
      <View style={styles.container}> 
        <ImageBackground style={styles.backgroundImage} source={require('./assets/2.jpg')} imageStyle= 
          {{opacity:0.5}} >
        <View style={{ alignItems: 'center', marginBottom: 30}}>
            <Text style={styles.heading}>👏🏻 Pomodoro Todo! 👏🏻</Text>  
        </View>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
          source={{ uri: "https://img.icons8.com/office/80/000000/tomato.png" }}
          style={{ width: 60, height: 60, marginBottom: 10}}
          />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.focusTaskText}>Focus Task:</Text>
           <Text style={styles.currentTaskText}>{this.state.current.title}</Text>
        <CountDown
        running={this.state.running}
        until= {this.state.until}
        id={this.state.id}
        onFinish={() => alert('you did it! (❁´◡`❁)')} 
        onPress={() => {
            this.setState({running: false})
            alert('real time doesnt stop just because you press on it #facts')
          }}
        size={35}
        digitStyle={{backgroundColor: '#F4F6F6', 
                    opacity: 0.8,
                     borderWidth: 2,
                     borderStyle: 'dotted',
                     borderColor: '#F5B7B1',
                     shadowOffset:{  width: 1,  height: 2,  },
                     shadowColor: 'black',
                     shadowOpacity: 0.2, 
                     }}
        digitTxtStyle={{color: '#8cb5de', 
                        fontFamily: 'monospace', 
                        fontSize:35,
                        opacity: 1 
                        }}
        timeLabelStyle={{fontFamily:'monospace', 
                         fontWeight: 'bold', 
                         color:'grey',
                         fontSize:15, 
                         marginTop:5
                         }}
        timeToShow={['M', 'S']}
        timeLabels={{m: 'm i n', s: 's e c'}}       />

        <View style={styles.btnContainer}> 
          <TouchableOpacity style={styles.startButton}
          onPress={() => {
            this.setState({ running: true });
          }}>          
          <Text style={styles.startButtonSymbol}>(╯‵□′)╯︵┻┻ </Text>
          <Text style={styles.startButtonText}>  s t a r t </Text>  
          </TouchableOpacity> 

          <TouchableOpacity style={styles.startButton}
          onPress={() => {
            this.setState({until: 1500, running: false, id: this.state.id+1})
          }}
          >
          <MaterialCommunityIcons name="space-invaders" size={30} color="#8cb5de" iconStyle={styles.restartButtonStyle} /> 
          <Text style={styles.startButtonText}> Restart </Text>
          </TouchableOpacity>
    </View>
        </View>
      </View>
      <View style={{marginTop: 50, alignItems: 'center'}}>
          <TouchableOpacity style={styles.startButton}
            onPress={() => this.props.navigation.navigate('Dashboard')}>
            <Text style={styles.taskListBtnText}>Task List</Text>
          </TouchableOpacity>
      </View>
    </ImageBackground>
      </View>
    );
  }
}

class DashboardScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          Task List
        </Text>
      </View>
    );
  }
}

const RootStack = createSwitchNavigator(
  {
    Focus: FocusScreen,
    Dashboard: DashboardComponent,
  },
  {
    initialRouteName: 'Focus',
  }
);

 
const styles = StyleSheet.create({
  heading: {
    fontSize: 25, 
    textAlign: 'center',
    color: 'grey', 
    marginTop: 15, 
    backgroundColor: '#F4F6F6', 
    paddingHorizontal: 5, 
    width: 300,
    fontFamily: 'monospace',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor:'transparent',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Constants.statusBarHeight,
    padding: 8,
  },
  taskListBtnText: {
    color: 'grey',
    fontSize: 15,
    textAlign: 'center', 
     fontFamily: 'monospace'
  },
  currentTaskText: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10, 
    fontFamily: 'monospace',
  }, 
  focusTaskText: { 
    fontSize: 20, 
    marginBottom: 5,
    textAlign:'center', 
    textDecorationLine: 'underline', 
    fontFamily: 'monospace',
  },
    startButton: {
    padding : 10,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#F5B7B1',
    backgroundColor: '#F4F6F6',
    shadowOffset:{  width: 1,  height: 2,  },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    alignItems: 'center', 
    margin: 10
  },

  startButtonSymbol: {
    color:'#8cb5de',
    fontWeight: 'bold',
  },

  startButtonText: {
    color:'#8cb5de',
    fontFamily: 'monospace',
    justifyContent: 'center',
    alignItems: 'center',
  },

  restartButtonStyle: {
    alignItems: 'center',
    padding: 50,
    marginTop: 50,
  },
  btnContainer: {
      flexDirection: 'row',
    },
});


const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
