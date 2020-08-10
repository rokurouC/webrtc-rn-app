import React from 'react';
import { View } from 'react-native';
import { AppRouter } from './src/router';

const App = () => (
    <View style={{ flex: 1 }}>
        <AppRouter />
    </View>
);

export default App;
