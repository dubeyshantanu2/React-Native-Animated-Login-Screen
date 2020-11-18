import React from 'react';

import {Asset} from 'expo-asset';
import {AppLoading} from 'expo';

import B2BApp from './app/index';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor() {
    super(); 
    this.state = {
      isReady: false
    };
  }
  
  async _loadAssestsAsync(){
    const imageAssets = cacheImages([require('./assets/Background.png')]);

    await Promise.all([...imageAssets]);
  }

  render(){
    if (!this.state.isReady){
      return (
        <AppLoading
          startAsync={this._loadAssestsAsync}
          onFinish={() => this.setState({ isReady: true})}
          onError={console.warn}
          />
      );
    }
    return <B2BApp />;
  }
}
