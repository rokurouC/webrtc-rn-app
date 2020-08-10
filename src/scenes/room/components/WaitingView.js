import React, { useEffect, useRef, MutableRefObject } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    StyleProp, 
    ViewStyle, 
    TextStyle 
} from 'react-native';

/**
 * 
 * @param {{
 * messages: string, 
 * style: StyleProp<ViewStyle>, 
 * textStyle:StyleProp<TextStyle> }} props 
 */
export const WaitingView = ({ 
    messages = 'Waiting for someone',
    style,
    textStyle 
}) => {

    /**
     * @type {MutableRefObject<TextInput>}
     */
    const textInputRef = useRef(null);
    useEffect(() => {
        let dot = ''
        let timer = setInterval(() => {
            switch (dot) {
                case '':
                    dot = '.';
                    break;
                case '.':
                    dot = '..';
                    break;
                case '..':
                    dot = '...';
                    break;
                case '...':
                    dot = '';
                    break;
            }
            textInputRef.current.setNativeProps({ text: `${messages}${dot}` })
        }, 1000)
        
        return () => {
            clearInterval(timer);
        }
    })

    return (
        <View style={[styles.container, style]}>
            <TextInput 
                ref={textInputRef} 
                value={messages}
                style={[styles.text, textStyle]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    text: {
        color: 'white',
        fontSize: 16
    }
})