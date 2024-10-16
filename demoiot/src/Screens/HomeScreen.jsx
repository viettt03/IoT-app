import { View, Text, Image, SafeAreaView, ScrollView, Switch, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LineChart } from "react-native-gifted-charts"
import { Context } from '../Context/Context';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SensorComponent from '../components/SensorComponent';


const HomeScreen = () => {
    const date = new Date();
    const [isEnabled1, setIsEnabled1] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const [isEnabled3, setIsEnabled3] = useState(false);
    const [active1, setActive1] = useState(false);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [currentData, setCurrentData] = useState({ temp: 0, humidity: 0, light: 0 });
    const [temps, setTemps] = useState([{ value: 0, dataPointText: '0' }])
    const [hums, setHums] = useState([{ value: 0, dataPointText: '0' }])
    const [lights, setLights] = useState([{ value: 0, dataPointText: '0' }])
    const [winds, setWinds] = useState([{ value: 0, dataPointText: '0' }])
    const [rains, setRains] = useState([{ value: 0, dataPointText: '0' }])
    const [warning, setWarning] = useState(false);



    const { warningToday, fetchWarningToday } = useContext(Context);

    const toggleSwitch = (deviceId, enabled, setEnabled) => {
        setEnabled(pre => !pre)
        sendData(deviceId, enabled)
    }

    const sendData = async (deviceId, enabled) => {
        await axios.post('http://192.168.193.89:8080/api/postDataControl', { deviceId, control: enabled === false ? 1 : 0 })
            .then(response => {
                console.log('Data sent successfully');
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    };

    useEffect(() => {
        fetchWarningToday();
    }, [warningToday, currentData])

    useEffect(() => {

        const ws = new WebSocket('ws://192.168.193.89:8080');

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
            else {
                const data = res.data
                setCurrentData({
                    temp: Number(data[0]),
                    humidity: Number(data[1]),
                    light: Number(data[2]),
                    wind: Number(data[3]),
                    rain: Number(data[4])
                });

                setTemps(prevTemps => {
                    const updatedTemps = [...prevTemps, { value: Number(data[0]), dataPointText: data[0] }];
                    if (updatedTemps.length > 10) updatedTemps.shift();
                    return updatedTemps;
                });

                setHums(prevHums => {
                    const updatedHums = [...prevHums, { value: Number(data[1]), dataPointText: data[1] }];
                    if (updatedHums.length > 10) updatedHums.shift();
                    return updatedHums;
                });

                setLights(prevLights => {
                    const updatedLights = [...prevLights, { value: Number(data[2]), dataPointText: data[2] }];
                    if (updatedLights.length > 10) updatedLights.shift();
                    return updatedLights;
                });
                setRains(prevRains => {
                    const updatedRains = [...prevRains, { value: Number(data[4]), dataPointText: data[4] }];
                    if (updatedRains.length > 10) updatedRains.shift();
                    return updatedRains;
                });
                setWinds(prevWinds => {
                    const updatedWinds = [...prevWinds, { value: Number(data[3]), dataPointText: data[3] }];
                    if (updatedWinds.length > 10) updatedWinds.shift();
                    return updatedWinds;
                });
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

    useEffect(() => {
        if (currentData.wind > 50 && currentData.rain > 50) {
            setWarning(true);
            const timer = setTimeout(() => {
                setWarning(false);
            }, 1500);
            return () => clearTimeout(timer);
        }

        // if (currentData.wind > 50 && currentData.rain > 50) {
        //     const interval = setInterval(() => {
        //         setWarning(prevWarning => !prevWarning); 
        //     }, 1500); 

        //     return () => clearInterval(interval); 
        // } else {
        //     setWarning(false); 
        // }

    }, [currentData]);


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
                        source={{ uri: 'https://res.cloudinary.com/dlggsv9ks/image/upload/v1728316241/avatars/avt_rk1boy.jpg' }} // Replace with actual image URL
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="ml-4">
                        <Text className="text-xl font-semibold">Hi, TTV!</Text>
                        <Text className="text-gray-500">Welcome home</Text>
                    </View>
                </View>

                <View className='w-[95%] my-auto flex-row justify-between border-b border-b-[#00000032] p-4 mb-4' />

                <View className='mt-5 -ml-3 flex-row'>
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
                    <View className=''>
                        <Text className="text-center font-semibold text-lg mb-4 ml-1">Humidity</Text>
                        <SensorComponent
                            score={currentData.humidity || 0}
                            maxScore={100}
                            gradientColors={['#c0e5fe', '#0084f3']}
                            unit={'%'}
                        />
                    </View>
                    <View className={''}>
                        <Text className="text-center font-semibold text-lg mb-4 ml-5">Light</Text>
                        <SensorComponent
                            score={currentData.light || 0}
                            maxScore={3000}
                            gradientColors={['#d7c5de', '#c65af3']}
                        />
                    </View>
                </View>

                <View className={`mt-5 mx-auto flex-row items-center justify-center rounded-2xl ${warning ? "bg-green-300" : ""} w-[70%]`}>
                    <View className=''>
                        <Text className="text-center font-semibold text-lg mb-4 ml-5">Wind</Text>
                        <SensorComponent
                            score={currentData.wind || 0}
                            maxScore={100}
                            gradientColors={['#3eb1ff', '#ffff07', '#ff8801', '#fe0500']}
                            unit={''}
                        />
                    </View>
                    {/* <View className='border-r border-r-[#00000032]' /> */}
                    <View className=''>
                        <Text className="text-center font-semibold text-lg mb-4 ml-1">Rain</Text>
                        <SensorComponent
                            score={currentData.rain || 0}
                            maxScore={100}
                            gradientColors={['#c0e5fe', '#0084f3']}
                            unit={'%'}
                        />
                    </View>
                </View>

                <View>
                    <Text className='text-center font-semibold text-2xl mb-4 ml-1'>Number of warnings today: {warningToday}</Text>
                </View>

                <View className='w-[95%] flex-row justify-between border-b border-b-[#00000032] p-4 mb-9 -mt-4' />


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
                        maxValue={2200}
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

                <View className='pr-4  text-center justify-center content-center flex mx-auto'>
                    <LineChart

                        data={winds}
                        data2={rains}
                        height={300}
                        showVerticalLines
                        spacing={40}
                        initialSpacing={6}
                        maxValue={110}
                        color1="brown"
                        color2="#c0e5fe"
                        textColor1="brown"
                        textColor2="brown"
                        dataPointsHeight={3}
                        dataPointsWidth={3}
                        dataPointsColor1="brown"
                        dataPointsColor2="#c0e5fe"
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
                        {renderLegend('Wind', 'brown')}
                        {renderLegend('Rain', '#c0e5fe')}
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


                            </View>
                            <View className='mr-4'>
                                <Text className="text-lg font-semibold text-gray-900">Ceiling Fan</Text>
                                <Text className="text-sm text-gray-400 mt-1">Consumes 10 kWh</Text>
                            </View>

                            <View className="items-center -mt-3 flex justify-between">
                                <View className={`w-3 h-3 rounded-full ${active1 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                {((isEnabled1 && !active1) || (!isEnabled1 && active1)) ?
                                    <ActivityIndicator size="large" color="#00ff00" className="h-12" /> :
                                    <View className="h-12" />
                                }
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


                            </View>
                            <View className='mr-4'>
                                <Text className="text-lg font-semibold text-gray-900">Air Conditioner</Text>
                                <Text className="text-sm text-gray-400 mt-1">Consumes 20 kWh</Text>
                            </View>
                            <View className="items-center -mt-3 flex justify-between">
                                <View className={`w-3 h-3 rounded-full ${active2 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                {((isEnabled2 && !active2) || (!isEnabled2 && active2)) ?
                                    <ActivityIndicator size="large" color="#00ff00" className="h-12" /> :
                                    <View className="h-12" />
                                }
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
                                        <MaterialCommunityIcons name="lightbulb-on" size={80} color="yellow" /> :

                                        <MaterialCommunityIcons name="lightbulb-off" size={80} color="#60A5FA" />
                                }
                            </View>
                            <View className='mr-4'>
                                <Text className="text-lg font-semibold text-gray-900">Lamp</Text>
                                <Text className="text-sm text-gray-400 mt-1">Consumes 20 kWh</Text>

                            </View>
                            <View className="items-center -mt-3 flex justify-between">
                                <View className={`w-3 h-3 rounded-full ${active3 ? 'bg-green-500' : 'bg-gray-500'}`} />
                                {((isEnabled3 && !active3) || (!isEnabled3 && active3)) ?
                                    <ActivityIndicator size="large" color="#00ff00" className="h-12" /> :
                                    <View className="h-12" />
                                }
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