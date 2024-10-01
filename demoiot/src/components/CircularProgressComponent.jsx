import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const ScoreComponent = ({ score }) => {
    return (
        <View style={styles.scoreWrap}>
            <View style={styles.score}>
                <View style={styles.scoreBar}>
                    <View style={styles.placeholder}>{progressBar(100)}</View>
                    <View style={styles.scoreCircle}>{progressBar(score, true)}</View>
                </View>
                <View style={styles.scoreValue}>
                    <Text style={styles.scoreNumber}>{Math.round(score)}°C</Text>
                </View>
            </View>
        </View>
    );
};

const progressBar = (widthPerc, gradient = false) => {
    const radius = 65;
    const circumference = Math.PI * radius * 2;
    const arcLength = (circumference * 240) / 360; // 240 degrees
    const dashArray = (arcLength * widthPerc) / 100;

    return (
        <Svg width="150" height="150" viewBox="0 0 190 180">
            <Defs>
                {gradient && (
                    <LinearGradient id="temperature-gradient" x1="70%" y1="10%" x2="90%" y2="50%">
                        <Stop offset="0%" stopColor="#3b82f6" />
                        <Stop offset="25%" stopColor="#34d399" />
                        <Stop offset="50%" stopColor="orange" />
                        {/* <Stop offset="75%" stopColor="#f97316" /> */}
                        <Stop offset="100%" stopColor="#ef4444" />
                    </LinearGradient>
                )}
            </Defs>

            <Circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                strokeWidth="25"
                strokeLinecap="round"
                strokeDashoffset={-(circumference - arcLength) / 2}
                strokeDasharray={`${dashArray} ${circumference}`}
                stroke={gradient ? 'url(#temperature-gradient)' : '#e5e5e5'}
                transform="rotate(90 100 100)"
            />
        </Svg>
    );
};

const styles = StyleSheet.create({
    scoreWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: -30
    },
    score: {
        width: 140,
        height: 140,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    scoreBar: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 100,
        top: 0,
    },
    scoreCircle: {
        position: 'absolute',
        top: 0,
    },
    scoreValue: {
        marginBottom: 5,
        textAlign: 'center',
        marginHorizontal: 'auto',
        marginTop: 25
    },
    scoreName: {
        color: '#777',
    },
    scoreNumber: {
        fontSize: 25,
        fontWeight: '600',
    },
});

export default ScoreComponent;
