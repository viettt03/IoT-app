import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const SensorComponent = ({ score, maxScore, gradientColors, unit }) => {
    const percentage = (Math.min(score, maxScore) / maxScore) * 100;
    const color = getGradientColor(percentage, gradientColors);

    return (
        <View style={styles.scoreWrap}>
            <View style={styles.score}>
                <View style={styles.scoreBar}>
                    <View style={styles.placeholder}>{progressBar(100, gradientColors)}</View>
                    <View style={styles.scoreCircle}>{progressBar(percentage, gradientColors, true)}</View>
                </View>
                <View style={styles.scoreValue}>
                    <Text style={[styles.scoreNumber, { color }]} className='text-center mx-auto' >{score} {unit}</Text>
                </View>
            </View>
        </View>
    );
};

const progressBar = (widthPerc, gradientColors, gradient = false) => {
    const radius = 65;
    const dashArray = (Math.PI * radius * widthPerc) / 100;

    return (
        <Svg width="150" height="150" viewBox="0 0 190 180">
            <Circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                strokeWidth="25"
                strokeLinecap="round"
                strokeDashoffset={-1 * Math.PI * radius}
                strokeDasharray={`${dashArray} 10000`}
                stroke={gradient ? 'url(#score-gradient)' : '#e5e5e5'}
            />
            {gradient && (
                <Defs>
                    <LinearGradient id="score-gradient">
                        {gradientColors.map((color, index) => (
                            <Stop key={index} offset={`${index * (100 / (gradientColors.length - 1))}%`} stopColor={color} />
                        ))}
                    </LinearGradient>
                </Defs>
            )}
        </Svg>
    );
};

const getGradientColor = (percentage, gradientColors) => {
    const gradientStops = gradientColors.length - 1;
    const colorIndex = Math.floor((percentage / 100) * gradientStops);
    const nextColorIndex = Math.min(colorIndex + 1, gradientStops);
    const colorPercentage = (percentage / 100) * gradientStops - colorIndex;

    const startColor = hexToRgb(gradientColors[colorIndex]);
    const endColor = hexToRgb(gradientColors[nextColorIndex]);

    const r = startColor.r + (endColor.r - startColor.r) * colorPercentage;
    const g = startColor.g + (endColor.g - startColor.g) * colorPercentage;
    const b = startColor.b + (endColor.b - startColor.b) * colorPercentage;

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};

const styles = StyleSheet.create({
    scoreWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: -30,
    },
    score: {
        width: 140,
        height: 100,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scoreCircle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scoreValue: {
        position: 'absolute',
        top: '80%',
        left: '70%',
        transform: [{ translateX: -50 }, { translateY: -10 }], // Center the text horizontally and slightly adjust vertically
        textAlign: 'center',
    },
    scoreNumber: {
        fontSize: 25,
        fontWeight: '600',
        margin: 'auto',
        textAlign: 'center'
    },
});

export default SensorComponent;
