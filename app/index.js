import React, { Component} from 'react';
import { StyleSheet, Image, View, Dimensions, Text } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

let googleimg = { uri: 'https://developers.google.com/identity/images/g-logo.png'};

const {width, height} = Dimensions.get('window');

const {Value, event, block, cond, eq, set, Clock, startClock, stopClock, debug, timing, clockRunning, interpolate, Extrapolate } = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
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
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

class B2BApp extends Component {
    constructor(){
        super();
        this.buttonOpacity = new Value(1);
        
        this.OnStateChange = event([
            {
                nativeEvent:({state})=>
                    block([
                        cond(
                            eq(state, State.END), 
                            set(this.buttonOpacity, runTiming(new Clock(),1,0))
                            )
                        ])
            }
        ]);
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
                <View style={{...StyleSheet.absoluteFill}}>
                    <Image
                        source={require('../assets/Background.png')}
                        style={{ flex: 1, height: null, width: null }}
                        />
                </View>
                <View style={{ height: height / 3, justifyContent: 'center' }}>
                    <TapGestureHandler onHandlerStateChange={this.OnStateChange}>
                    <Animated.View 
                        style={{
                            ...styles.button, 
                            opcaity: this.buttonOpacity}}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                    </Animated.View>
                    </TapGestureHandler>
                    <View style={{...styles.googlebutton}}>
                        
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            
                            <Image source={googleimg} style = {{ height: 30, width: 30}}/>
                            SIGN IN WITH GOOGLE
                        </Text>
                    </View>
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
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },
    googlebutton: {
        backgroundColor: '#fff',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        marginVertical: 5,
        alignItems: 'center',
        paddingVertical: 15,
    }
});