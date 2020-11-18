import React, { Component} from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TextInput } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

let googleimg = { uri: 'https://developers.google.com/identity/images/g-logo.png'};

const {width, height} = Dimensions.get('window');

const {Value, event, block, cond, eq, set, Clock, startClock, stopClock, debug, timing, clockRunning, interpolate, Extrapolate, concat } = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 800,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock),0,[
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))
        ),
        state.position
    ]);
}

class B2BApp extends Component {
    constructor(){
        super();
        this.buttonOpacity = new Value(1);
        
        this.OnStateChange = event([
            {
                nativeEvent: ({state})=>
                    block([
                        cond(
                            eq(state, State.END), 
                            set(this.buttonOpacity, runTiming(new Clock(),1,0))
                            )
                        ])
            }
        ]);

        this.onCloseState = event([
            {
                nativeEvent: ({state})=>
                    block([
                        cond(
                            eq(state, State.END), 
                            set(this.buttonOpacity, runTiming(new Clock(),0,1))
                            )
                        ])
            }
        ]);

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [300, 0],
            extrapolate: Extrapolate.CLAMP
          });
      
          this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 2.5, 0],
            extrapolate: Extrapolate.CLAMP
          });
          this.bglogo = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height /1.2, 0],
            extrapolate: Extrapolate.CLAMP
          });

          this.textInputZindex = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
          });
          this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, 100],
            extrapolate: Extrapolate.CLAMP
          });
          this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
          });
          this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0,1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
          });
    }
    render() {
        return (
            <View 
                style={{ 
                    flex: 1, 
                    backgroundColor: 'white',
                    justifyContent: 'flex-end' 
                    }}
                    >
                    
                     <Animated.View
                        style={{
                            ...StyleSheet.absoluteFill,
                            transform: [{ translateY: this.bgY }]
                        }}
                        >
                          <Image
                            source={require('../assets/Background.png')}
                            style={{ flex: 1, height: null, width: null }}
                        />
                    </Animated.View>

                    <Animated.View
                        style={{
                            ...StyleSheet.absoluteFill,
                            transform: [{ translateY: this.bglogo }]
                        }}
                        >
                    <Image
                        source={require('../assets/Logo.png')}
                        style={styles.logo}
                        />
                    </Animated.View>

                <View style={{ height: height / 2.5, justifyContent: 'center'}}>
                    <TapGestureHandler onHandlerStateChange={this.OnStateChange}>
                    <Animated.View 
                        style={{
                            ...styles.button, 
                            opcaity: this.buttonOpacity,
                            transform: [{ translateY: this.buttonY }]
                            }}
                        >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                    </Animated.View>
                    </TapGestureHandler>
                    
                    <Animated.View
                        style={{...styles.googlebutton, 
                                opacity: this.buttonOpacity,
                                transform: [{ translateY: this.buttonY }]
                                }}>
                        
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            SIGN IN WITH   
                            <Image source={googleimg} style = {{ height: 30, width: 30}}/>
                            
                        </Text>
                    </Animated.View>

                    <Animated.View
                        style={{
                            zIndex: this.textInputZindex,
                            opcaity: this.textInputOpacity,
                            transform:[{ translateY:this.textInputY }],
                            height:height/2.5,
                            ...StyleSheet.absoluteFill, 
                            top:null,
                            justifyContent:'center',}}
                            >

                            <TapGestureHandler onHandlerStateChange=
                                {this.onCloseState}>
                                <Animated.View style={styles.closeButton}>
                                    <Animated.Text style={{ fontSize:15, 
                                    transform:[{rotate: concat(this.rotateCross, 'deg')}]}}>X
                                    </Animated.Text>
                                </Animated.View>
                            </TapGestureHandler>

                            <TextInput
                            placeholder="EMAIL"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            />
                            
                            <TextInput
                            placeholder="PASSWORD"
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholderTextColor="black"
                            />
                            
                            <Animated.View
                                style={styles.button} >
                                <Text style={{fontSize:20, fontWeight: 'bold'}}>SIGN IN</Text>
                            </Animated.View>


                            <Animated.View
                                style={styles.button} >
                                <Text style={{fontSize:20, fontWeight: 'bold'}}>REGISTER</Text>
                            </Animated.View>

                           
                    </Animated.View>

                </View>
            </View>
        );
    } 
}

export default B2BApp;

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 250, 
        width:160,
        marginLeft: 130,
        marginTop:200
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 3
    },
    googlebutton: {
        backgroundColor: '#fff',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        marginVertical: 5,
        alignItems: 'center',
        paddingVertical: 15,
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -20,
        left: width/2 -20,
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 3
    },
    signup: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        
    },
});