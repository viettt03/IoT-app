import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { Context } from '../Context/Context';
import axios from 'axios';

const toDate = (date) => {
    const string = new Date(date);
    return string.toLocaleString();
}

const Table2 = () => {

    const { fetchControlHistory, setPageControl, totalPagesControl, pageControl, controlHistory, setControlHistory, setTotalPagesControl } = useContext(Context);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState('Chọn thiết bị');

    const devices = [
        { id: '0', name: 'All' },
        { id: '1', name: 'Điều hòa' },
        { id: '2', name: 'Đèn' },
        { id: '3', name: 'Quạt' }
    ];

    const filterDevice = async (device, page) => {
        const url = 'http://10.0.2.2:8080/api/filterDevice';
        try {
            const response = await axios.get(url, {
                params: {
                    device: device,
                    page: page
                }
            });
            setControlHistory(response.data.data);
            setTotalPagesControl(response.data.totalPages)
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };

    const handleSelectDevice = (device) => {
        filterDevice(device.id, pageControl)
        setSelectedDevice(device.name, pageControl);
        setIsModalVisible(false);
    };


    const handlePageChange = (pageNumber) => {
        fetchControlHistory(pageNumber);
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

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="justify-center items-center my-2">
                <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded h-10"
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text className="text-white text-lg h-20">{selectedDevice}</Text>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="w-72 bg-white rounded-lg p-4">
                            <FlatList
                                data={devices}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="p-3 border-b border-gray-200"
                                        onPress={() => handleSelectDevice(item)}
                                    >
                                        <Text className="text-lg">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id}
                            />
                            <TouchableOpacity
                                className="mt-4 px-4 py-2 bg-blue-500 rounded"
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text className="text-white text-center text-lg">Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
                                        {item.device === 2 ? 'Air conditioner' : item.device === 1 ? 'Fan' : 'Lamp'}
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

            <View className="flex-row mx-4 mt-2 justify-end">
                {pageControl > 1 && (
                    <View
                        className="h-10 items-center justify-center my-2"
                        onTouchEnd={() => handlePageChange(pageControl - 1)}
                    >
                        <Text className="font-[900] text-2xl text-center text-blue-600">Pre</Text>
                    </View>
                )}
                <View className="mx-auto flex-row justify-center my-2 items-center text-center content-center w-[72vw]">
                    {displayPages.length > 0 && displayPages.map((item, index) => (
                        <View
                            className="px-2 h-10 items-center justify-center"
                            key={index}
                            onTouchEnd={() => handlePageChange(Number(item))}
                            disabled={pageControl === index}
                        >
                            <Text className={item === pageControl ?
                                'font-[900] text-2xl text-center text-black' :
                                'font-[900] text-2xl text-center text-blue-600'}>
                                {Number(item)}
                            </Text>
                        </View>
                    ))}
                </View>
                {pageControl < totalPagesControl && (
                    <View
                        className="h-10 items-center my-2 justify-center"
                        onTouchEnd={() => handlePageChange(pageControl + 1)}
                    >
                        <Text className="font-[900] text-2xl text-center text-blue-600">Next</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>

    )
}

export default Table2;
