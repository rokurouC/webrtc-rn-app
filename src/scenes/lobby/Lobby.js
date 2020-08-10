import React from 'react';
import { 
    View, 
    FlatList, 
    TouchableOpacity, 
    Text,
    StyleSheet,
    Modal,
    TextInput
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BaseScene } from '../BaseScene';
import { ItemSeparatorLine } from '../../components/shared';

export class Lobby extends BaseScene {
    static navigationOptions = ({navigation}) => {
        return {
            ...navigation.state.params,
            headerRight: (
                <TouchableOpacity 
                    style={{ ...styles.btnWrap, marginRight: 10 }}
                    onPress={navigation.getParam('onCreateRoom')}
                >
                    <Text style={styles.btnTitle}>{'Create'}</Text>
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            /**
             * @type {{ roomName: string, roomId: string }[]}
             */
            list: [],
            roomNameInputBoxShow: false,
            roomName: '',
            roomNameBoxHint: ''
        }
        /**
         * @type {TextInput}
         */
        this.roomNameTextInput = undefined;
    }

    componentDidMount() {
        this.firebaseRepo.listenRooms((list) => {
            console.log(list);
            this.setState({ list });
        })
        this.props.navigation.setParams({ onCreateRoom: this.onTapCreateRoom });
    }

    onTapCreateRoom = () => {
        this.setState({ roomNameInputBoxShow: true });
    }

    onConfirmCreateRoom = () => {
        if (this.state.roomName === '') {
            this.setState({ roomNameBoxHint: `Room's name must be provided.` })
            return;
        }
        const roomName = this.state.roomName;
        this.setState({
            roomNameInputBoxShow: false,
            roomName: '',
            roomNameBoxHint: '' 
        }, () => {
            Actions.push('privateRoom', { roomName, role: 'offer' });
        })
    }

    /**
     * 
     * @param {{ roomName: string, roomId: string }} roomInfo 
     */
    joinRoom = (roomInfo) => {
        Actions.push('privateRoom', { ...roomInfo, role: 'answer' });
    }

    /**
     * 
     * @param {{ 
     * item: { roomName: string, roomId: string }, 
     * index:number }} info 
     */
    renderRoomListRow = (info) => {
        return (
            <View style={styles.rowWrap}>
                <Text style={styles.roomTitle}>{info.item.roomName}</Text>
                <TouchableOpacity 
                    style={styles.btnWrap}
                    onPress={() => { this.joinRoom(info.item); }}
                >
                    <Text style={styles.btnTitle}>{'Join'}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderRoomNameInputBox = () => {
        return (
            <Modal
                visible={this.state.roomNameInputBoxShow}
                transparent
            >
                <View style={styles.maskBackground}>
                    <View style={styles.inputBox}>
                        <View style={styles.inputAreaWrap}>
                            <Text>{'Give the room a name:'}</Text>
                            <TextInput
                                ref={(ref) => { this.roomNameTextInput = ref; }} 
                                placeholder={`Let's Rolo!`}
                                style={styles.textInput}
                                autoCorrect={false}
                                returnKeyType={'done'}
                                value={this.state.roomName}
                                onChangeText={(text) => { this.setState({ roomName: text }) }}
                                onFocus={() => { this.setState({ roomNameBoxHint: '' }) }}
                            />
                        </View>
                        <Text style={styles.roomNameBoxHint}>{this.state.roomNameBoxHint}</Text>
                        <View style={styles.btnArea}>
                            <TouchableOpacity 
                                style={styles.btnWrap}
                                onPress={() => { this.setState({ roomNameInputBoxShow: false }); }}
                            >
                                <Text style={styles.btnTitle}>{'Cancel'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.btnWrap}
                                onPress={this.onConfirmCreateRoom}
                            >
                                <Text style={styles.btnTitle}>{'Confirm'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    keyExtractor={(item, index) => `${item.roomId}_${index}`}
                    style={{ flex: 1 }}
                    renderItem={this.renderRoomListRow}
                    data={this.state.list}
                    ItemSeparatorComponent={ItemSeparatorLine}
                />
                {this.renderRoomNameInputBox()}
            </View>
        )
    }
}

const LIST_ROW_SIZE = { width: '100%', height: 60 }
const BTN_SIZE = { width: 60, height: 30 }
const INPUT_BOX_SIZE = { width: '65%', height: undefined }
const INPUT_AREA_SIZE = { width: '70%', height: 60 }
const BTN_AREA_SIZE = { width: '60%', height: 45 }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30
    },
    rowWrap: {
        ...LIST_ROW_SIZE,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roomTitle: {
        maxWidth: 200,
        fontWeight: 'bold'
    },
    btnWrap: {
        ...BTN_SIZE,
        borderRadius: BTN_SIZE.height / 2,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        color: 'white'
    },
    maskBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputBox: {
        width: INPUT_BOX_SIZE.width,
        height: INPUT_BOX_SIZE.height,
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputAreaWrap: {
        width: INPUT_AREA_SIZE.width,
        height: INPUT_AREA_SIZE.height,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textInput: {
        borderWidth: 0.5,
        borderColor: '#D8D8D8',
        width: '100%',
        height: 30,
        textAlign: 'center',
        padding: 0
    },
    roomNameBoxHint: {
        color: '#D0021B',
        marginTop: 10
    },
    btnArea: {
        width: BTN_AREA_SIZE.width,
        height: BTN_AREA_SIZE.height,
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    }
})