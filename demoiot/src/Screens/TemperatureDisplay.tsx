import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface TemperatureDisplayProps {
    temperature: number;
}

const getGradientColors = (temperature: number): [string, string] => {
    if (temperature <= 0) {
        return ['#00f', '#00a']; // Cold: Blue shades
    } else if (temperature <= 20) {
        return ['#00f', '#0ff']; // Cool: Blue to Cyan
    } else if (temperature <= 40) {
        return ['#0ff', '#0f0']; // Mild: Cyan to Green
    } else if (temperature <= 60) {
        return ['#0f0', '#ff0']; // Warm: Green to Yellow
    } else if (temperature <= 80) {
        return ['#ff0', '#f90']; // Hot: Yellow to Orange
    } else {
        return ['#f90', '#f00']; // Very Hot: Orange to Red
    }
};

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ temperature }) => {
    const maxTemperature = 100; // Define the maximum temperature for the progress bar
    const barHeight = 200; // Height of the progress bar
    const fillHeight = (temperature / maxTemperature) * barHeight; // Calculate the filled height based on temperature

    const [startColor, endColor] = getGradientColors(temperature); // Get the gradient colors based on temperature

    return (
        <View style={styles.container}>
            <Text style={styles.temperatureText}>{temperature}°C</Text>
            <View style={styles.svgContainer}>
                <Svg height={barHeight} width="60" viewBox={`0 0 60 ${barHeight}`}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={startColor} stopOpacity="1" />
                            <Stop offset="1" stopColor={endColor} stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect
                        x="20"
                        y={barHeight - fillHeight}
                        width="20"
                        height={fillHeight}
                        fill="url(#grad)"
                        rx="10" // Rounded corners
                    />
                    <Rect
                        x="20"
                        y="0"
                        width="20"
                        height={barHeight}
                        fill="none"
                        stroke="#BDBDBD"
                        strokeWidth="2"
                        rx="10" // Rounded corners
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20,
    },
    temperatureText: {
        fontSize: 30,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    svgContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6, // Adds a shadow for Android
    },
});

export default TemperatureDisplay;
