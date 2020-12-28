import * as React from 'react';
import { Text, 
        View,
        StyleSheet,
        FlatList, 
        TextInput, 
        Button, 
        KeyboardAvoidingView, 
        Keyboard, 
        TouchableOpacity, 
        ImageBackground, 
        Alert, 
        Platform
        } from 'react-native';
import  CheckBox  from 'react-native-check-box';
import { Constants } from 'expo';
import AsyncStorage from '@react-native-community/async-storage';


export default class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state= {
      keyTodo:"",
      isChecked:false,
      data:[
        {id: 1,title:"GMAT Data Sufficiency Prep", done:true},
        {id: 2,title:"Complete pitch deck", done:false}
      ]
    }
  }

  saveData = async () => {
    console.log("Saving");
     try {
        await AsyncStorage.setItem('todos', JSON.stringify(this.state.data));
      } catch (error) {
        console.log("Error saving")
      }
  }

  loadData = async () => {
    try {
    const value = await AsyncStorage.getItem('todos');
    if (value !== null) {
      console.log("Old data loaded")
      this.setState( {data: JSON.parse(value)})
    } 
   } catch (error) {
    //  alert("Problem retriving data");
   }
  }

  componentDidMount = () => {
    // initial load
    this.loadData();
  }

 addTodo = () => {
        if (this.state.tempTodo.trim() != '') {
            let newTodo = {
                id: Math.random(1000000, 999999), // naive way of generating an unique
                title: this.state.tempTodo.trim(),
                done: false,
            };

            this.setState({
                tempTodo: '', // reset temp todo to empty,
                data: [...this.state.data, newTodo],
            });

            setTimeout(() => { this.saveData(); }, 0);

            Keyboard.dismiss();
            this.setState({ modalVisible: false });
            Alert.alert('Task Added!');
        }
        else {
            this.setState({
                tempTodo: '', // reset temp todo to empty,
            }); 
        }

    };

  deleteTodo = (item) => {
      let index = this.state.data.findIndex((each) => {
        return each.id == item.id;  
      });

      let copy = [...this.state.data];
      copy.splice(index, 1);
      this.setState({
        data: copy
      });
        setTimeout(() => { this.saveData(); }, 0);
        Alert.alert('Task Deleted!');
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
    // if we found the item
    if (foundIndex != null) {
      // clone the todo
      const newTodo = {...currentItem};
      // inverse it's done status
      newTodo.done = !newTodo.done;

      todos[foundIndex]=newTodo;
    }


    this.setState({
      data: todos
    })
  }

   renderListItem = (info) => {
        let currentItem = info.item;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 15, borderColor: "#9b9b9b", borderBottomWidth: 2 }}>
                <CheckBox
                    style={{ paddingTop: 10}}
                    onClick={() => {
                        this.toggleCheckbox(currentItem);
                        setTimeout(() => { this.saveData(); }, 0);
                    }}
                    isChecked={currentItem.done}
                />
                
                <TouchableOpacity style={{ paddingTop: 10, paddingLeft: 10, flex: 1, }} onPress={() => {
                    AsyncStorage.setItem('current', JSON.stringify(currentItem));
                    this.props.navigation.navigate('Focus');
                }}>
                    <Text style={{ fontSize: 18, fontFamily: 'monospace',}}>
                        {currentItem.title}
                    </Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity style={styles.styleBtn} onPress={() => {
                        this.deleteTodo(currentItem);}}> 
                        <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


  render() {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>      
          <ImageBackground style={styles.backgroundImage} source={require('./assets/3.jpg')} imageStyle= 
          {{opacity:0.5}} >

          <FlatList
            renderItem={this.renderListItem}
            data={this.state.data}
            keyExtractor={(item) => item.id}
          >
          </FlatList>

          <View style={styles.alternativeLayoutButtonContainer}>
            <TextInput style={styles.textbox} 
                value={this.state.tempTodo} 
                onChangeText={ (text) => {this.setState({tempTodo:text})}} 
                placeholder={"Enter task"}
            />
              <TouchableOpacity style={styles.styleBtn} onPress={ this.addTodo} >
                <Text style={{ fontFamily: 'monospace',}}>Add</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
      </KeyboardAvoidingView>
    

    );
  }
}

const styles = StyleSheet.create({
  container: {    
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  textbox: {    
    borderColor:'black',
    borderWidth: 1,
    borderStyle: 'solid',
    height: 35,
    width: 220, 
    paddingHorizontal: 20, 
    fontFamily: 'monospace',
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }, 
  styleBtn: {
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 8,
    paddingLeft: 20,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50
  },
  deleteBtnText: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'monospace',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor:'transparent',
    justifyContent: 'flex-start',
  },
});