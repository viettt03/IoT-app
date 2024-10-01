import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PaginationComponent = ({ page, totalPages, handlePageChange }) => {
    const [tempPage, setTempPage] = useState(page.toString());

    useEffect(() => {
        setTempPage(page.toString());
    }, [page]);

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
