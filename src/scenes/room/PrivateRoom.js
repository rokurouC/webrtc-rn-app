import React from 'react';
import { 
    View, 
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import {
    RTCView,
    mediaDevices,
    RTCPeerConnection,
} from 'react-native-webrtc';
import { Actions } from 'react-native-router-flux';
import { BaseScene } from '../BaseScene';
import { WaitingView } from './components';

const CLOSE_IMG = require('../../images/png/icon_close_room.png');

export class PrivateRoom extends BaseScene {
    /**
     * 
     * @param {{ 
     * roomName: string, 
     * roomId: string, 
     * role: 'answer' | 'offer' }} props 
     */
    constructor(props) {
        super(props);
        this.room
        this.state = {
            /**
             * @type {MediaStream}
             */
            localStream: null,
            /**
             * @type {MediaStream}
             */
            remoteStream: null,
        }
        /**
         * @type {{
         * roomName: string,
         * roomId: string,
         * role: 'offer' | 'answer',
         * peerConnection: RTCPeerConnection
         * }}
         */
        this.room = {
            roomName: props.roomName,
            roomId: props.roomId,
            role: props.role,
            peerConnection: undefined
        }
    }

    componentDidMount() {
        this.setupLocalStream();
    }

    componentWillUnmount() {
        this.leave();
    }

    setupLocalStream = () => {
        const isFront = true;
        mediaDevices.enumerateDevices()
        .then(sourceInfos => {
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }

            /**
             * @type {MediaStreamConstraints}
             */
            const constraints = {
                audio: true,
                video: {
                  mandatory: {
                    minWidth: 500,
                    minHeight: 300,
                    minFrameRate: 30
                  },
                  facingMode: (isFront ? "user" : "environment"),
                  optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            }

            mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                console.log('getUserMedia Succeed:');
                console.log(stream.toURL());
                this.setState({
                    localStream: stream
                }, () => {
                    this.connect();
                });
            })
            .catch((e) => {
                console.log('getUserMedia Error:')
                console.log(e)
            })
        })
    } 

    connect = () => {
        this.room.role === 'offer' ? (
            this.firebaseRepo.createRoomWithName(
                this.room.roomName,
                this.state.localStream,
                (room) => {
                    this.room = room
                },
                (track) => {
                    this.setState({
                        remoteStream: track
                    })
                },
                () => {
                    this.setState({
                        remoteStream: undefined
                    })
                }
            )
        ) : 
        (
            this.firebaseRepo.joinRoomById(
                this.room.roomId, 
                this.state.localStream, 
                (room) => {
                    this.room = room;
                }, 
                (track) => {
                    this.setState({
                        remoteStream: track
                    })
                },
                () => {
                    Alert.alert(
                        'The host has left the room', 
                        '', [
                            {
                                text: 'OK',
                                onPress: () => { Actions.pop(); }   
                            }
                        ])
                }
            )
        )
    }

    leave = () => {
        this.firebaseRepo.leaveRoom(this.room);
    }

    renderRemoteView = () => {
        return this.state.remoteStream ? 
        (
            <RTCView
                key={'remote'}
                mirror={true}
                style={styles.remoteRTCView}
                objectFit={'contain'}
                zOrder={0}
                streamURL={this.state.remoteStream && this.state.remoteStream.toURL()}
            />
        ) : 
        (
            <WaitingView messages={this.room.role === 'answer' ? 'Connected' : 'Waitting for someone'} />
        );
    }

    switchCamera = () => {
        this.state.localStream._tracks[1]._switchCamera();
    }

    renderLocalView = () => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.switchCamera}
                style={styles.localRTCViewWrap}
            >
                <RTCView
                    key={'local'}
                    objectFit={'cover'}
                    style={styles.localRTCView}
                    zOrder={1}
                    streamURL={this.state.localStream && this.state.localStream.toURL()}
                />
            </TouchableOpacity>
        )
    }

    renderCloseButton = () => {
        return (
            <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => { Actions.pop(); }}
            >
                <Image source={CLOSE_IMG} style={styles.image} />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderRemoteView()}
                {this.renderLocalView()}
                {this.renderCloseButton()}
            </View>
        )
    }
}

const CLOSE_BTN_SIZE = { width: 40, height: 40 }

const styles = StyleSheet.create({
    remoteRTCView: {
        flex: 1,
        backgroundColor: 'black'
    },
    localRTCViewWrap: {
        width: 100,
        height: 200,
        position: 'absolute',
        right: 10,
        bottom: 30
    },
    localRTCView: {
        flex: 1,
        backgroundColor: 'black',
    },
    closeBtn: {
        ...CLOSE_BTN_SIZE,
        position: 'absolute',
        left: 20,
        top: 30
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    }
})