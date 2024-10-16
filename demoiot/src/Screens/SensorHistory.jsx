
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Image, TextInput, SafeAreaView, ScrollView, Alert, Keyboard } from 'react-native';
import _ from "lodash"
import { Context } from '../Context/Context';
import Icon from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash/debounce';
import PaginationComponent from '../components/PaginationComponent ';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

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

export default function SensorHistory() {

    const [columns, setColumns] = useState(["Id", "Temp", "Hum", "Light", "Wind", "Rain", "Time"])
    const [direction, setDirection] = useState('desc')
    const [selectedColumn, setSelectedColumn] = useState('id')
    const [selectedField, setSelectedField] = useState(null);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(Number.MAX_SAFE_INTEGER);
    const [date, setDate] = useState(null);
    const [inputDate, setInputDate] = useState('');
    const [search, setSearch] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [limit, setLimit] = useState(10)

    const { sensorHistory, pageSensor, totalPagesSensor, fetchSensorHistory, setPageSensor } = useContext(Context);

    useEffect(() => {
        let orderBy = selectedColumn;
        if (orderBy === 'id') orderBy = 'order'
        const params = {
            sortBy: orderBy === 'hum' ? 'humidity' : orderBy,
            order: direction,
            page: pageSensor,
            selectField: selectedField,
            date: date,
            minValue: minValue,
            maxValue: maxValue,
            limit: limit
        };
        fetchSensorHistory(params);
    }, [direction, pageSensor, search, selectedColumn, limit, date])


    const onRefresh = () => {
        setIsRefreshing(true);

        let orderBy = selectedColumn;
        if (orderBy === 'id') orderBy = 'order';
        const params = {
            sortBy: orderBy,
            order: direction,
            page: 1,
            selectField: selectedField,
            minValue: minValue,
            maxValue: maxValue,
            limit: limit
        };
        fetchSensorHistory(params).finally(() => setIsRefreshing(false));
        setPageSensor(1)
    };

    const handleFieldChange = (value) => {
        setSelectedField(value);
        setMinValue(0);
        setMaxValue(Number.MAX_SAFE_INTEGER);
    };

    const handleSearch = () => {
        if (selectedField === 'time') {
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
        }
        else {


            if (!minValue || !maxValue) {
                Toast.show({
                    type: 'customToast',
                    text1: 'Enter the min and max value',
                    visibilityTime: 1000,
                });
                return;
            }

            if (maxValue < minValue) {
                Toast.show({
                    type: 'customToast',
                    text1: 'Max value >= min value!',
                    visibilityTime: 1000,
                });
                return;
            }

            setSearch(pre => pre + 1);
            setPageSensor(1);
            setSelectedColumn('id')
            setDirection('desc');

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

    const resetFilters = () => {
        setSelectedField(null);
        setSelectedColumn('id')
        setMinValue(0);
        setMaxValue(Number.MAX_SAFE_INTEGER);
        setInputDate('')
        setDate(null);
        setSearch(0)
        setDirection('desc');
        setPageSensor(1);
    };


    const handleSort = useCallback((column) => {
        if (column === 'Time') return;
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
                    className={column == "Time" ? "w-[20%]" : "w-[13%]"}
                    onPress={() => handleSort(column)}
                >
                    <Text style={styles.columnHeaderTxt}>{column}
                        {(selectedColumn === column.toLowerCase()) && selectedColumn !== 'time' && (
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
                        <Text className="text-xl font-semibold mb-3 text-gray-700">Search By:</Text>
                        <TouchableOpacity
                            onPress={resetFilters}
                            className="rounded-lg flex justify-center items-center mb-3 ">
                            <Icon2 name='close' size={24} />
                        </TouchableOpacity>
                    </View>

                    <View className="border border-gray-300 rounded-lg overflow-hidden" >
                        <Picker
                            selectedValue={selectedField}
                            onValueChange={handleFieldChange}
                            className="h-10 bg-white justify-center items-center my-auto"
                            style={{ fontWeight: 'bold' }}
                        >
                            <Picker.Item label="Select field" value={null} style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }} />
                            <Picker.Item label="Temperature" value="temp" />
                            <Picker.Item label="Humidity" value="humidity" />
                            <Picker.Item label="Light" value="light" />
                            <Picker.Item label="Wind" value="wind" />
                            <Picker.Item label="Rain" value="rain" />
                            <Picker.Item label="Time" value="time" />
                        </Picker>
                    </View>
                </View>

                {selectedField && selectedField !== 'time' && (
                    <View className="mb-0">
                        <Text className="text-lg font-semibold mb-3 text-gray-700">Range input:</Text>
                        <View className="flex-row justify-between space-x-2">
                            <TextInput
                                className="border border-gray-300 rounded-lg h-10 px-4 flex-1 text-gray-700"
                                placeholder="Min value"
                                keyboardType="numeric"
                                value={minValue}
                                onChangeText={setMinValue}
                            />
                            <TextInput
                                className="border border-gray-300 rounded-lg h-10 px-4 flex-1 text-gray-700"
                                placeholder="Max value"
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
                        <Text className="text-lg font-semibold mb-3 text-gray-700">Search by time</Text>
                        <View className='flex-row justify-between gap-6'>
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
                    refreshing={isRefreshing} // For pull-to-refresh
                    onRefresh={onRefresh}
                    renderItem={({ item, index }) => {
                        return (
                            <View className={`flex-row h-16 items-center ${index % 2 === 1 ? 'bg-blue-50' : 'bg-white'}`}>

                                <Text className="w-[13%] text-center font-bold text-base" selectable>{item.order}</Text>
                                <TouchableOpacity
                                    className="w-[13%] text-center text-sm"
                                    onLongPress={() => copyToClipboard(String(item.temp))}>
                                    <Text className='text-center'>{item.temp}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-[13%] text-center text-sm"
                                    onLongPress={() => copyToClipboard(String(item.humidity))}>
                                    <Text className='text-center'>{item.humidity}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-[14%] text-center text-sm"
                                    onLongPress={() => copyToClipboard(String(item.light))}>
                                    <Text className='text-center'>{item.light}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-[13%] text-center text-sm"
                                    onLongPress={() => copyToClipboard(String(item.wind || 0))}>
                                    <Text className='text-center'>{item.wind || 0}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-[13%] text-center text-sm"
                                    onLongPress={() => copyToClipboard(String(item.rain || 0))}>
                                    <Text className='text-center'>{item.rain || 0}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-[20%] text-center text-sm"
                                    onLongPress={() => copyToClipboard(formatDate(item.timestamp))}>
                                    <Text className='text-center'>{formatDate(item.timestamp)}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    ListFooterComponent={() => (
                        <View className="flex-row justify-between my-1 items-center mx-auto">
                            <PaginationComponent
                                page={pageSensor}
                                totalPages={totalPagesSensor}
                                setPage={setPageSensor}
                                limit={limit}
                                setLimit={setLimit}
                            />
                        </View>
                    )}
                />


            </View>

            <Toast config={toastConfig} />
        </SafeAreaView>
    );

}
const toastConfig = {
    customToast: ({ text1 }) => (
        <View className="bg-slate-600 p-2 rounded-3xl w-3/5 items-center">
            <Text className="text-white text-base font-medium">{text1}</Text>
        </View>
    ),
};

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

