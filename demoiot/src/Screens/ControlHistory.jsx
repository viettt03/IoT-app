import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, TouchableOpacity, TextInput, Keyboard } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Context } from '../Context/Context';
import Icon from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import PaginationComponent from '../components/PaginationComponent ';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';


function formatDate(string) {
    const date = new Date(string)
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const ControlHistory = () => {

    const { fetchControlHistory, setPageControl, totalPagesControl, pageControl, controlHistory } = useContext(Context);
    const [selectedDevice, setSelectedDevice] = useState('Select device');
    const [deviceId, setDeviceId] = useState(null);
    const [action, setAction] = useState(null);
    const [isFocusDevice, setIsFocusDevice] = useState(false);
    const [isFocusAction, setIsFocusAction] = useState(false);
    const [limit, setLimit] = useState(10)

    const [date, setDate] = useState(null);
    const [inputDate, setInputDate] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchControlHistory({
            action: action === 2 ? null : action,
            deviceId: deviceId === 0 ? null : deviceId,
            page: pageControl,
            date: date,
            limit: limit
        });
    }, [pageControl, deviceId, action, limit, date])


    const onRefresh = () => {
        setIsRefreshing(true);
        const params = {
            action: action === 2 ? null : action,
            deviceId: deviceId === 0 ? null : deviceId,
            page: 1,
            date: date,
            limit: limit
        };
        fetchControlHistory(params).finally(() => setIsRefreshing(false));
        setPageControl(1)
    };

    const deviceOptions = [
        { label: 'All', value: 0 },
        { label: 'Ceiling Fan', value: 1 },
        { label: 'Air Conditioner', value: 2 },
        { label: 'Lamp', value: 3 },
    ];

    const actionOptions = [
        { label: 'All', value: 2 },
        { label: 'ON', value: 1 },
        { label: 'OFF', value: 0 },
    ];

    const resetFilters = () => {
        setAction(2);
        setDeviceId(0);
        setPageControl(1);
        setSelectedDevice('Select device');
        setIsFocusAction(false)
        setIsFocusDevice(false)
        setDate(null)
        setInputDate('')
    };

    const handleSearch = () => {
        if (!inputDate || !inputDate.includes('/') || inputDate.split('/').length !== 3) {
            Toast.show({
                type: 'customToast',
                text1: 'Invalid date format',
                visibilityTime: 1000,
            });
            return;
        }

        const [day, month, yearAndTime] = inputDate.split('/');
        const [year, time] = yearAndTime.split(' ');

        if (!year) {
            Toast.show({
                type: 'customToast',
                text1: 'Invalid date format',
                visibilityTime: 1000,
            });
            return;
        }

        let formattedDateString = `${year}-${month}-${day}`; // Basic date format

        // Add time if available
        if (time) {
            const timeParts = time.split(':');
            const hours = timeParts[0] || '00';
            const minutes = timeParts[1] || '00';
            const seconds = timeParts[2] || '00';

            formattedDateString += `T${hours}:${minutes}:${seconds}.000`;
        } else {
            formattedDateString += 'T00:00:00.000';
        }

        const parsedDate = new Date(formattedDateString);

        if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
            setSearch(1);
            setPageSensor(1);
        } else {
            Toast.show({
                type: 'customToast',
                text1: 'Invalid date format',
                visibilityTime: 1000,
            });
        }
        Keyboard.dismiss();
    };

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Toast.show({
            type: 'customToast',
            text1: 'Copy text to Clipboard',
            position: 'bottom',
            visibilityTime: 1000,
        });
    };


    return (
        <SafeAreaView className="flex-1 bg-gray-100">

            <View className="mx-4 mt-4 mb-1">
                <View className="flex-row justify-between">
                    {/* Dropdown Device */}
                    <Dropdown
                        className={`w-[45%] h-12 border ${isFocusDevice ? 'border-blue-500' : 'border-gray-300'} rounded-lg px-2`}
                        data={deviceOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select device"
                        value={deviceId}
                        onFocus={() => setIsFocusDevice(true)}
                        onBlur={() => setIsFocusDevice(false)}
                        onChange={(item) => {
                            setDeviceId(item.value);
                            setSelectedDevice(item.label);
                            setIsFocusDevice(true);
                            setPageControl(1);
                        }}
                        renderLeftIcon={() => (
                            <Icon name="Safety" size={20} color={isFocusDevice ? 'blue' : 'black'} />
                        )}
                    />

                    {/* Dropdown Action */}
                    <Dropdown
                        className={`w-[45%] h-12 border ${isFocusAction ? 'border-blue-500' : 'border-gray-300'} rounded-lg px-2`}
                        data={actionOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select action"
                        value={action}
                        onFocus={() => setIsFocusAction(true)}
                        onBlur={() => setIsFocusAction(false)}
                        onChange={(item) => {
                            setAction(item.value);
                            setIsFocusAction(false);
                            setPageControl(1);

                        }}
                        renderLeftIcon={() => (
                            <Icon name="Safety" size={20} color={isFocusAction ? 'blue' : 'black'} />
                        )}
                    />
                    <View className='justify-center'>
                        <TouchableOpacity
                            onPress={resetFilters}
                            className="rounded-lg flex justify-center items-center mb-3 ">
                            <Icon2 name='close' size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-2 flex">
                    <View className=" flex">
                        <Text className="text-lg font-semibold mb-1 text-gray-700">Search by time:</Text>
                        <View className='flex-row justify-between gap-8'>
                            <TextInput
                                className="border border-gray-300 rounded-lg h-10 px-4 flex-1 text-gray-700"
                                placeholder="Enter the time"
                                keyboardType="default"
                                value={inputDate}
                                onChangeText={setInputDate}
                            />
                            {inputDate.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setInputDate('');
                                        setDate(null);
                                    }}
                                    className="absolute right-20 top-2"
                                >
                                    <Icon name="close" size={20} color="gray" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleSearch}
                                className="rounded-lg flex justify-center items-center mr-3">
                                <Icon2 name='search' size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </View>

            <FlatList
                data={controlHistory}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshing={isRefreshing} // For pull-to-refresh
                onRefresh={onRefresh}
                renderItem={({ item, index }) => {
                    return (
                        <View
                            style={{ backgroundColor: index % 2 === 1 ? "#F0FBFC" : "white" }}
                            className="py-1 flex-row mx-auto w-[95%] border border-[#c8c2c2] rounded-3xl mt-2 justify-between"
                        >
                            <View className="w-20 h-16 items-center justify-center">
                                <Text className="font-[600] text-xl text-black text-center">
                                    id. {item.order2}
                                </Text>
                            </View>
                            <View className="flex-col">
                                <View className="items-center justify-center">
                                    <Text className="font-[600] text-lg text-blue-800 text-center" selectable>
                                        {item.name}
                                    </Text>
                                </View>
                                <View className="items-center justify-center">
                                    <Text
                                        className="font-[600] text-lg text-center"
                                        style={{ color: item.action === 0 ? 'gray' : 'green' }}
                                        selectable
                                    >
                                        {item.action === 0 ? 'OFF' : 'ON'}
                                    </Text>
                                </View>
                            </View>
                            <View className="w-28 h-16 items-center justify-center">
                                <TouchableOpacity
                                    onLongPress={() => copyToClipboard(formatDate(item.timestamp))}
                                >
                                    <Text className="font-[600] text-lg text-black text-center w-28">
                                        {formatDate(item.timestamp)}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            />

            <View className="flex-row justify-between mx-auto mt-1 ">
                <PaginationComponent
                    page={pageControl}
                    totalPages={totalPagesControl}
                    setPage={setPageControl}
                    limit={limit}
                    setLimit={setLimit}
                />
            </View>

            <Toast config={toastConfig} />

        </SafeAreaView>

    )
}
const toastConfig = {
    customToast: ({ text1 }) => (
        <View className="bg-slate-600 p-2 rounded-3xl w-3/5 items-center">
            <Text className="text-white text-base font-medium">{text1}</Text>
        </View>
    ),
};

export default ControlHistory;
