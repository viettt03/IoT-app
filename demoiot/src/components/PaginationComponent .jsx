import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import Icon2 from 'react-native-vector-icons/AntDesign';


const PaginationComponent = ({ page, totalPages, handlePageChange, limit, setLimit }) => {
    const [tempPage, setTempPage] = useState(page.toString());
    const [limitRecord, setLimitRecord] = useState(limit.toString());

    const [isFocus, setIsFocus] = useState(false);
    useEffect(() => {
        setTempPage(page.toString());
    }, [page]);


    // useEffect(() => {
    //     setLimit(Number(limitRecord))
    // }, [limitRecord]);

    const handlePreviousPage = () => {
        const newPage = Number(tempPage) - 1;
        if (newPage > 0) {
            handlePageChange(newPage);
        }
    };

    const handleNextPage = () => {
        const newPage = Number(tempPage) + 1;
        if (newPage <= totalPages) {
            handlePageChange(newPage);
        }
    };

    const step = 10;
    const roundedNumber = Math.ceil(50 / step) * step;
    const result = [];
    for (let i = step; i <= roundedNumber; i += step) {
        result.push({ label: i.toString(), value: i });
    }

    return (
        <View className="flex-row justify-between mx-4 mt-1 w-[85%]">
            {page > 1 ? (
                <TouchableOpacity
                    className="h-10 justify-center"
                    onPress={handlePreviousPage}
                >
                    <Icon name="chevron-left" size={40} color="#2563eb" />
                </TouchableOpacity>
            ) : (
                <View className="w-5" />
            )}

            <View className="flex-row mx-auto justify-center items-center space-x-2 w-[70%]">
                <TextInput
                    className="border border-blue-600 rounded-md px-2 py-1 text-center font-bold text-blue-600 w-12 text-lg"
                    value={tempPage}
                    keyboardType="numeric"
                    returnKeyType="search"
                    onChangeText={(text) => {
                        setTempPage(text);
                    }}
                    onSubmitEditing={() => {
                        const newPage = Number(tempPage);
                        if (!isNaN(newPage) && newPage > 0 && newPage <= totalPages) {
                            handlePageChange(newPage);
                        } else {
                            setTempPage(page.toString());
                        }
                    }}
                />
                <Text className="font-bold text-xl text-black">/ {totalPages}</Text>
            </View>
            {/* <TextInput
                className="border border-black-600 rounded-md px-2 py-1 text-center font-bold text-black-600 w-12 text-lg"
                value={limitRecord}
                keyboardType="numeric"
                returnKeyType="search"
                onChangeText={(text) => {
                    setLimitRecord(text);
                }}
                onSubmitEditing={() => {
                    const newLimit = Number(tempPage);
                    if (!isNaN(newLimit) && newLimit > 0) {
                        handleChangeLimit(newLimit);
                    } else {
                        setLimitRecord(limit.toString());
                    }
                }}
            /> */}

            <Dropdown
                className={`w-[18%] h-12 border ${isFocus ? 'border-blue-500' : 'border-gray-300'} rounded-lg px-2`}
                data={result}
                labelField="label"
                valueField="value"
                value={limit}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    setIsFocus(false);
                    setLimit(item.value);
                    handlePageChange(1);
                }}

            />
            {page < totalPages ? (
                <TouchableOpacity
                    className="h-10 justify-center"
                    onPress={handleNextPage}
                >
                    <Icon name="chevron-right" size={40} color="#2563eb" />
                </TouchableOpacity>
            ) : (
                <View className="w-5" />
            )}
        </View>
    );
};

export default React.memo(PaginationComponent);;
