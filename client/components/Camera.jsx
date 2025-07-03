import React from 'react';
import { useCameraDevice } from 'react-native-vision-camera'
import { Camera as VisionCamera } from 'react-native-vision-camera'
import { StyleSheet } from 'react-native'
import { NoCameraErrorView } from 'react-native-vision-camera'

export function Camera() {
    const device = useCameraDevice('back')

    if (device == null) return <NoCameraErrorView />
    return (
        <VisionCamera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
        />
    )
}