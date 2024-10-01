import { View, Text, Image, SafeAreaView, ScrollView, Switch, TouchableOpacity, Animated, Easing } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LineChart } from "react-native-gifted-charts"
import { Context } from '../Context/Context';
import axios from 'axios';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularGauge from '../components/CircularProgressComponent';
import ScoreComponent from '../components/CircularProgressComponent';
import SensorComponent from '../components/SensorComponent';


const HomeScreen = () => {
    const date = new Date();
    const [isEnabled1, setIsEnabled1] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const [isEnabled3, setIsEnabled3] = useState(false);
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);

    const { currentData, temps, hums, lights } = useContext(Context);

    const toggleSwitch = (deviceId, enabled, setEnabled) => {
        setEnabled(pre => !pre)
        sendData(deviceId, enabled)
    }

    const sendData = async (deviceId, enabled) => {
        await axios.post('http://10.0.2.2:8080/api/postDataControl', { deviceId, control: enabled === false ? 1 : 0 })
            .then(response => {
                console.log('Data sent successfully');
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    };

    // const { dataHome } = useContext(Context);
    // const reversedData = [...dataHome].reverse();
    // const temps = reversedData.map(item => ({ value: item.temp, dataPointText: String(item.temp) }));
    // const hums = reversedData.map(item => ({ value: item.humidity, dataPointText: String(item.humidity) }));
    // const lights = reversedData.map(item => ({ value: item.light, dataPointText: String(item.light) }));


    useEffect(() => {
        const ws = new WebSocket('ws://10.0.2.2:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            if (res.type === 'controlData') {
                const data = res.data;

                if (data[0] === '1')
                    if (data[1] === '1') {
                        setActive1(true);
                        setIsEnabled1(true);
                        startFanRotation(rotateValueY);
                    } else {
                        setActive1(false)
                        setIsEnabled1(false)
                        stopFanRotation(rotateValueY);
                    }

                if (data[0] === '2')
                    if (data[1] === '1') {
                        setActive2(true);
                        setIsEnabled2(true);
                        startFanRotation(rotateValue);
                    } else {
                        setActive2(false)
                        setIsEnabled2(false)
                        stopFanRotation(rotateValue);
                    }
                if (data[0] === '3')
                    if (data[1] === '1') {
                        setActive3(true);
                        setIsEnabled3(true)
                    } else {
                        setActive3(false)
                        setIsEnabled3(false)
                    }
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        return () => {
            ws.close();
        };
    }, []);


    // quay quat
    const rotateValue = useRef(new Animated.Value(0)).current;
    const rotateValueY = useRef(new Animated.Value(0)).current;

    const startFanRotation = (rotateValue, direction = 'normal') => {
        Animated.loop(
            Animated.timing(rotateValue, {
                toValue: 3, // Increased the value to allow for more rotation in the loop
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();
    };

    const stopFanRotation = (rotateValue) => {
        rotateValue.stopAnimation();
        rotateValue.setValue(0);
    };


    const rotation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const rotationY = rotateValueY.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const renderLegend = (text, color) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View
                    style={{
                        height: 3,
                        width: 25,
                        marginRight: 10,
                        borderRadius: 4,
                        backgroundColor: color || 'white',
                        marginTop: 10
                    }}
                />
                <Text style={{ color: 'black', fontSize: 16 }}>: {text || ''}</Text>
            </View>
        );
    };
    //--------


    return (
        <SafeAreaView>
            <ScrollView className='bg-white'>
                {/* Header */}
                <View className="flex-row items-center mx-6 mt-6 ">
                    <Image
                        source={{ uri: 'https://photo.znews.vn/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg' }} // Replace with actual image URL
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="ml-4">
                        <Text className="text-xl font-semibold">Hi, TTV!</Text>
                        <Text className="text-gray-500">Welcome home</Text>
                    </View>
                </View>

                <View className='w-[95%] my-auto flex-row justify-between border-b border-b-[#00000032] p-4 mb-4' />

                <View className='mt-5 -ml-3 flex-row '>
                    <View className=''>
                        <Text className="text-center font-semibold text-lg mb-4 ml-5">Temperature</Text>
                        <SensorComponent
                            score={currentData.temp || 0}
                            maxScore={50}
                            gradientColors={['#3eb1ff', '#ffff07', '#ff8801', '#fe0500']}
                            unit={'℃'}
                        />
                    </View>
                    {/* <View className='border-r border-r-[#00000032]' /> */}
                    <View>
                        <Text className="text-center font-semibold text-lg mb-4 ml-5">Humidity</Text>
                        <SensorComponent
                            score={currentData.humidity || 0}
                            maxScore={100}
                            gradientColors={['#c0e5fe', '#0084f3']}
                            unit={'%'}
                        />
                    </View>
                    <View>
                        <Text className="text-center font-semibold text-lg mb-4 ml-5">Light</Text>
                        <SensorComponent
                            score={currentData.light || 0}
                            maxScore={3000}
                            gradientColors={['#eac6f9', '#c65af3']}
                        />
                    </View>
                </View>

                <View className='w-[95%] flex-row justify-between border-b border-b-[#00000032] p-4 mb-9 -mt-4' />


                {/* <View className="flex-row justify-center mt-8">

                    <View className="mx-1 items-center">
                        <Text className="text-center font-semibold text-lg mb-4">Temperature</Text>
                        <AnimatedCircularProgress
                            size={125}
                            width={14}
                            fill={currentData?.temp || 0}
                            tintColor={'#2465FD'}
                            backgroundColor="#d1e1f0"
                            rotation={240}
                            arcSweepAngle={240}
                            lineCap="round"
                            activeStrokeColor={'#2465FD'}
                            activeStrokeSecondaryColor={'#C25AFF'}
                        >
                            {() => (
                                <Text className="font-bold text-2xl p-3 text-center text-gray-800">
                                    {currentData?.temp || 0}°C
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>


                    <View className="mx-1 items-center">
                        <Text className="text-center font-semibold text-lg mb-4">Humidity</Text>
                        <AnimatedCircularProgress
                            size={125}
                            width={14}
                            fill={currentData?.humidity || 0}
                            tintColor={getColor(currentData?.humidity)}
                            backgroundColor="#d1e1f0"
                            rotation={240}
                            arcSweepAngle={240}
                            lineCap="round"
                        >
                            {() => (
                                <Text className="font-bold text-2xl p-3 text-center text-gray-800">
                                    {currentData?.humidity || 0}%
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>


                    <View className="mx-1 items-center">
                        <Text className="text-center font-semibold text-lg mb-4">Light</Text>
                        <AnimatedCircularProgress
                            size={125}
                            width={14}
                            fill={currentData?.light || 0}
                            tintColor={getColor(currentData?.light)}
                            backgroundColor="#d1e1f0"
                            rotation={240}
                            arcSweepAngle={240}
                            lineCap="round"
                        >
                            {() => (
                                <Text className="font-bold text-2xl p-3 text-center text-gray-800">
                                    {currentData?.light || 0} lx
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>
                </View> */}

                {/* <View className="bg-blue-100 rounded-xl px-4 pb-4 mt-5">
                    <Text className="text-gray-500">Ha Noi, {date.toLocaleDateString()}</Text>
                    <View className="flex  justify-between mt-3 mx-6 border border-gray-300 rounded-lg py-1">
                        <Text className="text-blue-700 text-lg ml-2">Temperature</Text>
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="thermometer" size={30} color="#1e3a8a" />
                            <Text className="text-orange-500 text-4xl font-bold ml-3">
                                {currentData?.temp || '25'}°C
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-center mt-2">

                        <View className="mx-2 items-center px-4">
                            <View className="flex-row items-center justify-between w-full">
                                <View className="items-center border border-gray-300 px-5 rounded-lg">
                                    <Text className="text-blue-700 text-lg">Humidity</Text>
                                    <AnimatedCircularProgress
                                        size={110}
                                        width={14}
                                        fill={currentData?.humidity || 0}
                                        tintColor={getColor(currentData?.humidity)}
                                        backgroundColor="#d1e1f0"
                                        rotation={240}
                                        arcSweepAngle={240}
                                        lineCap="round"
                                    >
                                        {() => (
                                            <Text className="font-bold text-xl text-center text-gray-800">
                                                {currentData?.humidity || 0}%
                                            </Text>
                                        )}
                                    </AnimatedCircularProgress>
                                </View>

                                <View className="items-center border border-gray-300 px-4 rounded-lg">
                                    <Text className="text-blue-700 text-lg">Light</Text>
                                    <AnimatedCircularProgress
                                        size={110}
                                        width={14}
                                        fill={currentData?.light || 0}
                                        tintColor={getColor(currentData?.light)}
                                        backgroundColor="#d1e1f0"
                                        rotation={240}
                                        arcSweepAngle={240}
                                        lineCap="round"
                                    >
                                        {() => (
                                            <Text className="font-bold text-xl text-center text-gray-800">
                                                {currentData?.light || 0} lx
                                            </Text>
                                        )}
                                    </AnimatedCircularProgress>
                                </View>
                            </View>
                        </View>


                    </View>
                </View> */}

                {/* Chart */}
                <View className='pr-4  text-center justify-center content-center flex mx-auto'>
                    <LineChart

                        data={temps}
                        data2={hums}
                        data3={lights}
                        height={300}
                        showVerticalLines
                        spacing={40}
                        initialSpacing={6}
                        maxValue={600}
                        color1="skyblue"
                        color2="orange"
                        color3='green'
                        textColor1="skyblue"
                        textColor2="orange"
                        textColor3="green"
                        dataPointsHeight={3}
                        dataPointsWidth={3}
                        dataPointsColor1="skyblue"
                        dataPointsColor2="red"
                        dataPointsColor3="green"
                        textShiftY={-2}
                        textShiftX={-5}
                        textFontSize={13}
                    />

                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginTop: 20,
                        }}>
                        {renderLegend('Temp', 'skyblue')}
                        {renderLegend('Humidity', 'orange')}
                        {renderLegend('Light', 'green')}
                    </View>
                </View>

                {/* control */}

                <View className='w-[95%] my-auto flex-row justify-between border-b border-b-[#00000032] p-4 mb-4' />

                <View className="flex-1 justify-center items-center ">
                    <View className="flex justify-around w-full px-6">

                        <View className="w-30 h-40 bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-row justify-between my-auto items-center">
                            <View className="items-center mb-2 mt-5">
                                <Animated.View style={{
                                    transform: [
                                        { perspective: 1000 }, // Thiết lập perspective cho hiệu ứng 3D
                                        { rotateY: rotationY }, // Quay quanh trục Y
                                    ],
                                }}>
                                    <Text>
                                        <MaterialCommunityIcons name="ceiling-fan" size={90} color="#00f" />
                                    </Text>
                                </Animated.View>

                                {/* {active1 ?
                                    <MaterialCommunityIcons name="ceiling-fan-light" size={40} color="#60A5FA" /> :
                                    <MaterialCommunityIcons name="ceiling-fan" size={90} color="#60A5FA" />
                                } */}
                            </View>
                            <View className='mr-4'>
                                <Text className="text-lg font-semibold text-gray-900">Ceiling Fan</Text>
                                <Text className="text-sm text-gray-400 mt-1">Consumes 10 kWh</Text>
                            </View>
                            <View className="items-center mt- flex justify-between gap-12">
                                <View className={`w-3 h-3 rounded-full ${active1 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={!isEnabled1 ? '#f4f3f4' : '#f5dd4b'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => toggleSwitch(1, isEnabled1, setIsEnabled1)}
                                    value={isEnabled1}
                                    style={{ transform: [{ scale: 2 }] }}
                                />
                            </View>
                        </View>



                        <View className="w-30 h-40 bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-row justify-between mt-4 items-center">
                            <View className="items-center mb-4">


                                <Animated.View style={{
                                    transform: [
                                        { perspective: 1000 }, // Thiết lập perspective cho hiệu ứng 3D
                                        { rotate: rotation }, // Quay quanh trục Y
                                    ],
                                }}>
                                    <Text>
                                        <MaterialCommunityIcons name="fan" size={85} color="#34D399" />
                                    </Text>
                                </Animated.View>

                                {/* {active2 ?
                                    <MaterialCommunityIcons name="fan" size={80} color="#34D399" /> :
                                    <MaterialCommunityIcons name="fan-off" size={80} color="#34D399" />

                                } */}

                            </View>
                            <View className='mr-4'>
                                <Text className="text-lg font-semibold text-gray-900">Air Conditioner</Text>
                                <Text className="text-sm text-gray-400 mt-1">Consumes 20 kWh</Text>

                            </View>
                            <View className="items-center mt- flex justify-between gap-12">
                                <View className={`w-3 h-3 rounded-full ${active2 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={!isEnabled2 ? '#f4f3f4' : '#f5dd4b'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => toggleSwitch(2, isEnabled2, setIsEnabled2)}
                                    value={isEnabled2}
                                    style={{ transform: [{ scale: 2 }] }}
                                />
                            </View>
                        </View>
                        <View className=" w-30 h-40 bg-white rounded-lg border border-gray-200 p-4 shadow-sm  flex-row justify-between mt-4 mb-10 items-center">
                            <View className="items-center mb-4">
                                {
                                    active3 ?
                                        <MaterialCommunityIcons name="lightbulb-on" size={80} color="#60A5FA" /> :

                                        <MaterialCommunityIcons name="lightbulb-off" size={80} color="#60A5FA" />
                                }
                            </View>
                            <View className='mr-4'>
                                <Text className="text-lg font-semibold text-gray-900">Lamp</Text>
                                <Text className="text-sm text-gray-400 mt-1">Consumes 20 kWh</Text>

                            </View>
                            <View className="items-center mt- flex justify-between gap-12">
                                <View className={`w-3 h-3 rounded-full ${active3 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={!isEnabled3 ? '#f4f3f4' : '#f5dd4b'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => toggleSwitch(3, isEnabled3, setIsEnabled3)}
                                    value={isEnabled3}
                                    style={{ transform: [{ scale: 2 }] }}
                                />
                            </View>
                        </View>
                    </View>
                </View>



            </ScrollView>
        </SafeAreaView>
    )
}


export default HomeScreen