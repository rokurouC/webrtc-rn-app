import React from 'react';
import { View } from 'react-native';

/**
 * 
 * @param {{
 * width: number | string
 * height: number | string
 * }} param0 
 */
export const ItemSeparatorLine = ({ 
    width = '100%', 
    height = 1,
    color = 'black'
}) => {
    return (
        <View style={{ width, height, backgroundColor: color }} />
    )
}

