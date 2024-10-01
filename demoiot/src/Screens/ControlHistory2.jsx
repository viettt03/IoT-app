import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Context } from '../Context/Context';
import Icon from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import renderDateTimePicker from '../components/renderDateTimePicker';
import PaginationComponent from '../components/PaginationComponent ';

const toDate = (date) => {
    const string = new Date(date);
    return string.toLocaleString();
}

const combineDateAndTime = (date, time) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    return combined;
};


const ControlHistory = () => {

    const { fetchControlHistory, setPageControl, totalPagesControl, pageControl, controlHistory } = useContext(Context);
    const [isVisibleTime, setIsVisibleTime] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState('Select device');
    const [deviceId, setDeviceId] = useState(null);
    const [action, setAction] = useState(null);
    const [startDate, setStartDate] = useState(new Date(2024, 8, 20));
    const [startHour, setStartHour] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [endHour, setEndHour] = useState(new Date());
    const [isFocusDevice, setIsFocusDevice] = useState(false);
    const [isFocusAction, setIsFocusAction] = useState(false);
    const [search, setSearch] = useState(false)
    const [pickerState, setPickerState] = useState({
        showStartDatePicker: false,
        showEndDatePicker: false,
        showStartTimePicker: false,
        showEndTimePicker: false
    });


    useEffect(() => {
        fetchControlHistory({
            action: action,
            deviceId: deviceId,
            page: pageControl,
            startTime: combineDateAndTime(startDate, startHour),
            endTime: combineDateAndTime(endDate, endHour)
        });
    }, [pageControl, deviceId, action, search])

    const handlePageChange = (pageNumber) => {
        setPageControl(pageNumber)
    };

    const getVisiblePages = (currentPage) => {
        if (totalPagesControl <= 3) {
            return Array.from({ length: totalPagesControl }, (_, i) => i + 1);
        }
        if (currentPage === 1) {
            return [1, 2, 3];
        } else if (currentPage === totalPagesControl) {
            return [totalPagesControl - 2, totalPagesControl - 1, totalPagesControl];
        } else {
            return [currentPage - 1, currentPage, currentPage + 1];
        }
    };
    const displayPages = getVisiblePages(pageControl);

    const deviceOptions = [
        { label: 'Ceiling Fan', value: 1 },
        { label: 'Air Conditioner', value: 2 },
        { label: 'Lamp', value: 3 },
    ];

    const actionOptions = [
        { label: 'ON', value: 1 },
        { label: 'OFF', value: 0 },
    ];

    const renderLabel = () => {
        if (action || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

    const resetFilters = useCallback(() => {
        setAction(null);
        setDeviceId(null);
        setPageControl(1);
        setSelectedDevice('Select device');
        setIsFocusAction(false)
        setIsFocusDevice(false)
        setIsVisibleTime(false)
        setSearch(false)
    }, []);

    const handleSearch = () => {
        setSearch(true)
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
                    <TouchableOpacity
                        onPress={() => setIsVisibleTime(!isVisibleTime)}
                        className="bg-blue-500 py-2 px-4 rounded-lg mb-4"
                    >
                        <Text className="text-white text-center text-lg">Chọn thời gian</Text>
                    </TouchableOpacity>

                    {isVisibleTime && (
                        <View className="flex">
                            <View className='flex-row justify-between'>
                                <View className='flex'>
                                    {renderDateTimePicker(
                                        startDate,
                                        setStartDate,
                                        pickerState.showStartDatePicker,
                                        (val) => setPickerState({ ...pickerState, showStartDatePicker: val }),
                                        startHour,
                                        setStartHour,
                                        pickerState.showStartTimePicker,
                                        (val) => setPickerState({ ...pickerState, showStartTimePicker: val })
                                    )}
                                    {renderDateTimePicker(
                                        endDate,
                                        setEndDate,
                                        pickerState.showEndDatePicker,
                                        (val) => setPickerState({ ...pickerState, showEndDatePicker: val }),
                                        endHour,
                                        setEndHour,
                                        pickerState.showEndTimePicker,
                                        (val) => setPickerState({ ...pickerState, showEndTimePicker: val })
                                    )}
                                </View>
                                <TouchableOpacity
                                    onPress={handleSearch}
                                    className="rounded-lg flex justify-center items-center mr-3"
                                >
                                    <Icon2 name='search' size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

            </View>




            <FlatList
                data={controlHistory}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}  // Thêm khoảng trống dưới để hỗ trợ cuộn
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
                                    <Text className="font-[600] text-lg text-blue-800 text-center">
                                        {item.name}
                                    </Text>
                                </View>
                                <View className="items-center justify-center">
                                    <Text
                                        className="font-[600] text-lg text-center"
                                        style={{ color: item.action === 0 ? 'gray' : 'green' }}
                                    >
                                        {item.action === 0 ? 'OFF' : 'ON'}
                                    </Text>
                                </View>
                            </View>
                            <View className="w-28 h-16 items-center justify-center">
                                <Text className="font-[600] text-lg text-black text-center w-28">
                                    {toDate(item.timestamp)}
                                </Text>
                            </View>
                        </View>
                    );
                }}
            />

            {/* <View className="flex-row justify-between mx-4 mt-1 w-[85%]">
                {pageControl > 1 ?
                    <TouchableOpacity
                        className="h-10 justify-center"
                        onPress={() => handlePageChange(pageControl - 1)}>
                        <Icon name='caretleft' size={24} color='#2563eb' />

                    </TouchableOpacity> : <View className='w-5'></View>
                }


                <View className="flex-row mx-auto justify-center items-center w-[70%]">
                    {pageControl > 3 ? (
                        <TouchableOpacity
                            className="h-10 justify-center ml-4"
                            onPress={() => handlePageChange(1)}>
                            <Text className='font-bold text-xl text-center text-blue-600'>1  ...</Text>
                        </TouchableOpacity>

                    ) : <View className='w-5'></View>}
                    {displayPages.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className="px-2 h-10 justify-center"
                            onPress={() => handlePageChange(Number(item))}>
                            <Text
                                className={`font-bold text-xl text-center ${item === pageControl ? 'text-black' : 'text-blue-600'
                                    }`}>
                                {Number(item)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {pageControl < totalPagesControl - 2 ? (
                        <TouchableOpacity
                            className="h-10 justify-center ml-4"
                            onPress={() => handlePageChange(1)}>
                            <Text className='font-bold text-xl text-center text-blue-600 '>... {totalPagesControl}</Text>
                        </TouchableOpacity>

                    ) : <View className='w-5'></View>}
                </View>

                {pageControl < totalPagesControl ? (
                    <TouchableOpacity
                        className="h-10 justify-center"
                        onPress={() => handlePageChange(pageControl + 1)}>
                        <Icon name='caretright' size={24} color='#2563eb' />
                    </TouchableOpacity>
                ) : <View className='w-5'></View>}
            </View> */}

            <View className="flex-row justify-between mx-4 mt-1 ">
                <PaginationComponent
                    page={pageControl}
                    totalPages={totalPagesControl}
                    handlePageChange={handlePageChange}
                />
            </View>



        </SafeAreaView>

    )
}

export default ControlHistory;
