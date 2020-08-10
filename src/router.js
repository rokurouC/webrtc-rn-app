import React from 'react';
import { 
    Router, 
    Stack, 
    Scene 
} from 'react-native-router-flux';
import { 
    Lobby, 
    PrivateRoom 
} from './scenes';

export const AppRouter = () => {
    return (
        <Router>
            <Stack>
                <Scene key={'lobby'} title={'Rolo room list'} component={Lobby} initial />
                <Scene key={'privateRoom'} title={''} component={PrivateRoom} hideNavBar />
            </Stack>
        </Router>
    )
}