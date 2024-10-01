
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Image, TextInput, SafeAreaView, ScrollView, Alert } from 'react-native';
import _ from "lodash"
import { Context } from '../Context/Context';
import Icon from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash/debounce';
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

export default function SensorHistory() {

    const [columns, setColumns] = useState(["Id", "Temp", "Humidity", "Light", "Time"])
    const [direction, setDirection] = useState('desc')
    const [selectedColumn, setSelectedColumn] = useState('id')
    const [selectedField, setSelectedField] = useState(null);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(Number.MAX_SAFE_INTEGER);
    const [startDate, setStartDate] = useState(new Date(2024, 8, 20));
    const [endDate, setEndDate] = useState(new Date());
    const [startHour, setStartHour] = useState(new Date());
    const [endHour, setEndHour] = useState(new Date());
    const [search, setSearch] = useState(1)
    const [pickerState, setPickerState] = useState({
        showStartDatePicker: false,
        showEndDatePicker: false,
        showStartTimePicker: false,
        showEndTimePicker: false
    });


    const { sensorHistory, pageSensor, totalPagesSensor, fetchSensorHistory, setPageSensor, currentData } = useContext(Context);


    useEffect(() => {
        let orderBy = selectedColumn;
        if (orderBy === 'id') orderBy = 'order'
        const params = {
            sortBy: orderBy,
            order: direction,
            page: pageSensor,
            selectField: selectedField,
            startTime: combineDateAndTime(startDate, startHour),
            endTime: combineDateAndTime(endDate, endHour),
            minValue: minValue,
            maxValue: maxValue
        };
        fetchSensorHistory(params);
    }, [direction, pageSensor, search, selectedColumn, currentData])


    const handlePageChange = (pageNumber) => {
        setPageSensor(pageNumber);
    };

    const handleFieldChange = (value) => {
        setSelectedField(value);
        setMinValue('');
        setMaxValue('');
    };

    const handleSearch = useCallback(() => {
        if (selectedField === 'time') {
            const finalStartDate = combineDateAndTime(startDate, startHour);
            const finalEndDate = combineDateAndTime(endDate, endHour);
            if (validateDates(finalStartDate, finalEndDate)) {
                setSearch(1);
                setPageSensor(1);
                setSelectedColumn('id')
                setDirection('desc');

            } else return;
        } else {
            if (validateValue(minValue, maxValue)) {
                setSearch(2);
                setPageSensor(1);
                setSelectedColumn('id')
                setDirection('desc');
            } else return;
        }
    }, [selectedField, startDate, endDate, startHour, endHour, minValue, maxValue]);


    const resetFilters = useCallback(() => {
        setSelectedField(null);
        setSelectedColumn('id')
        setMinValue(0);
        setMaxValue(Number.MAX_SAFE_INTEGER);
        setStartDate(new Date(2024, 8, 20));
        setEndDate(new Date());
        setStartHour(new Date());
        setEndHour(new Date());
        setDirection('desc');
        setPageSensor(1);
    }, [pageSensor]);

    const validateDates = useCallback((start, end) => {
        if (end < start) {
            Alert.alert("End date must be greater than start date!");
            return false;
        }
        return true;
    }, []);

    const validateValue = useCallback((min, max) => {
        if (max < min) {
            Alert.alert("The max value must be greater than the min value!");
            return false;
        }
        return true;
    }, []);



    const handleSort = useCallback((column) => {
        const newDirection = direction === 'desc' ? 'asc' : 'desc';
        setDirection(newDirection);
        setSelectedColumn(column.toLowerCase());
    }, [direction, selectedColumn]);

    const tableHeader = useMemo(() => (
        <View style={styles.tableHeader}>
            {columns.map((column, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.columnHeader}
                    onPress={() => handleSort(column)}
                >
                    <Text style={styles.columnHeaderTxt}>{column}
                        {selectedColumn === column.toLowerCase() && selectedColumn !== 'time' && (
                            <View>
                                {direction === 'desc' ? <Icon name='caretdown' size={10} /> : <Icon name='caretup' size={10} />}
                            </View>
                        )}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    ), [columns, selectedColumn, direction]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4">
                <View className="mb-1">
                    <View className="flex-row justify-between">
                        <Text className="text-xl font-semibold mb-3 text-gray-700">Tìm kiếm theo:</Text>
                        <TouchableOpacity
                            onPress={resetFilters}
                            className="rounded-lg flex justify-center items-center mb-3 ">
                            <Icon2 name='close' size={24} />
                        </TouchableOpacity>
                    </View>

                    <View className="border border-gray-300 rounded-lg overflow-hidden">
                        <Picker
                            selectedValue={selectedField}
                            onValueChange={handleFieldChange}
                            className="h-10 bg-white justify-center items-center">
                            <Picker.Item label="Chọn trường" value={null} style={{ fontWeight: '1000', fontSize: 20, color: 'black' }} />
                            <Picker.Item label="Nhiệt độ" value="temp" />
                            <Picker.Item label="Độ ẩm" value="humidity" />
                            <Picker.Item label="Ánh sáng" value="light" />
                            <Picker.Item label="Thời gian" value="time" />
                        </Picker>
                    </View>
                </View>

                {selectedField && selectedField !== 'time' && (
                    <View className="mb-4">
                        <Text className="text-lg font-semibold mb-3 text-gray-700">Nhập khoảng giá trị:</Text>
                        <View className="flex-row justify-between space-x-2">
                            <TextInput
                                className="border border-gray-300 rounded-lg h-10 px-4 flex-1 text-gray-700"
                                placeholder="Giá trị dưới"
                                keyboardType="numeric"
                                value={minValue}
                                onChangeText={setMinValue}
                            />
                            <TextInput
                                className="border border-gray-300 rounded-lg h-10 px-4 flex-1 text-gray-700"
                                placeholder="Giá trị trên"
                                keyboardType="numeric"
                                value={maxValue}
                                onChangeText={setMaxValue}
                            />
                            <TouchableOpacity
                                onPress={handleSearch}
                                className=" h-10 rounded-lg w-12 flex justify-center items-center">
                                <Icon2 name='search' size={30} />
                            </TouchableOpacity>

                        </View>
                    </View>
                )}

                {selectedField === 'time' && (
                    <View className=" flex">
                        <Text className="text-lg font-semibold mb-3 text-gray-700">Chọn khoảng thời gian:</Text>
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
                                    (val) => setPickerState({ ...pickerState, showStartTimePicker: val }))}
                                {renderDateTimePicker(
                                    endDate,
                                    setEndDate,
                                    pickerState.showEndDatePicker,
                                    (val) => setPickerState({ ...pickerState, showEndDatePicker: val }),
                                    endHour,
                                    setEndHour,
                                    pickerState.showEndTimePicker,
                                    (val) => setPickerState({ ...pickerState, showEndTimePicker: val }))}
                            </View>
                            <TouchableOpacity
                                onPress={handleSearch}
                                className="rounded-lg flex justify-center items-center mr-3">
                                <Icon2 name='search' size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </View>
            {/* Table with FlatList */}
            <View className="flex-1 items-center">
                <FlatList
                    data={sensorHistory}
                    style={{ width: '98%' }}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={tableHeader}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    stickyHeaderIndices={[0]}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                className={`flex-row h-16 items-center ${index % 2 === 1 ? 'bg-blue-50' : 'bg-white'
                                    }`}>
                                <Text className="w-[20%] text-center font-bold text-base">{item.order}</Text>
                                <Text className="w-[20%] text-center text-base">{item.temp}</Text>
                                <Text className="w-[20%] text-center text-base">{item.humidity}</Text>
                                <Text className="w-[20%] text-center text-base">{item.light}</Text>
                                <Text className="w-[20%] text-center text-sm">{toDate(item.timestamp)}</Text>
                            </View>
                        );
                    }}
                />

                {/* Pagination Controls */}

            </View>
            <View className="flex-row justify-between my-1 items-center mx-auto">
                <PaginationComponent
                    page={pageSensor}
                    totalPages={totalPagesSensor}
                    handlePageChange={handlePageChange}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderBlockColor: 'black'
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#37C2D0",
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        height: 65
    },
    tableRow: {
        flexDirection: "row",
        height: 60,
        alignItems: "center",
    },
    columnHeader: {
        width: "22%",
        justifyContent: "center",
        alignItems: "center"
    },
    columnHeaderTxt: {
        color: "white",
        fontWeight: "bold",
    },
    columnRowTxt: {
        width: "20%",
        textAlign: "center",
    }
});

