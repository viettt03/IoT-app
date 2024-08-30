
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Image } from 'react-native';
import _ from "lodash"
import { Context } from '../Context/Context';
import axios from 'axios';


const toDate = (date) => {
    const string = new Date(date);
    return string.toLocaleString();
}

export default function Table() {

    const [columns, setColumns] = useState([
        "Id",
        "Temp",
        "Humidity",
        "Light",
        "Time"
    ])
    const { sensorHistory, page, totalPages, fetchSensorHistory, setPage, setSensorHistory
        , sortTable, direction, selectedColumn, sortData
    } = useContext(Context);



    const tableHeader = () => (
        <View style={styles.tableHeader}>
            {
                columns.map((column, index) => {
                    {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.columnHeader}
                                onPress={() => sortTable(column)}
                            >
                                <Text style={styles.columnHeaderTxt}>{column}
                                    {selectedColumn === column.toLowerCase() &&
                                        <Image
                                            style={{ width: 15, height: 15 }}
                                            source={{
                                                uri: direction === 'desc' ?
                                                    'data:image/png;base64,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' :
                                                    'data:image/png;base64,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'
                                            }}
                                        />
                                    }

                                </Text>
                            </TouchableOpacity>
                        )
                    }
                })
            }
        </View>
    )

    const handlePageChange = (pageNumber) => {
        if (selectedColumn) sortData(selectedColumn.toLowerCase(), direction, pageNumber);
        else fetchSensorHistory(pageNumber);
        setPage(pageNumber)
    };

    const getVisiblePages = (currentPage) => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) {
            return [1, 2, 3];
        } else if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [currentPage - 1, currentPage, currentPage + 1];
        }
    };
    const displayPages = getVisiblePages(page);





    return (
        <View style={styles.container}>
            <FlatList
                data={sensorHistory}
                style={{ width: "98%" }}
                keyExtractor={(item, index) => index + ""}
                ListHeaderComponent={tableHeader}
                stickyHeaderIndices={[0]}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ ...styles.tableRow, backgroundColor: index % 2 == 1 ? "#d0f3f7" : "white" }}>
                            <Text style={{ ...styles.columnRowTxt, fontWeight: "bold" }}
                                className='text-base'
                            >{item.order}</Text>
                            <Text style={styles.columnRowTxt} className='text-base'>{item.temp}</Text>
                            <Text style={styles.columnRowTxt} className='text-base'>{item.humidity}</Text>
                            <Text style={styles.columnRowTxt} className='text-base'>{item.light}</Text>
                            <Text style={styles.columnRowTxt}>{toDate(item.timestamp)}</Text>
                        </View>
                    )
                }}
            />
            <View className='flex-row content-end mx-4'>
                {
                    page > 1 ?
                        <View
                            className=' h-10 items-center justify-center my-2'
                            onTouchEnd={() => handlePageChange(page - 1)}
                        >
                            <Text className='font-[900] text-2xl text-center text-blue-600'>Pre</Text>
                        </View> : null
                }
                <View className='mx-auto flex-row justify-center my-2 items-center text-center content-center w-[72vw]'>
                    {displayPages.length > 0 && displayPages.map((item, index) => (
                        <View
                            className='px-2 h-10 items-center justify-center'
                            key={index}
                            onTouchEnd={() => handlePageChange(Number(item))}
                        // disabled={currentPage === index + 1}
                        >
                            <Text className={item === page ?
                                'font-[900] text-2xl text-center text-black' :
                                'font-[900] text-2xl text-center text-blue-600'}>
                                {Number(item)}
                            </Text>

                        </View>
                    ))}
                </View>
                {
                    page < totalPages ?
                        <View
                            className='h-10 items-center my-2 justify-center '
                            onTouchEnd={() => handlePageChange(page + 1)}
                        >
                            <Text className='font-[900] text-2xl text-center text-blue-600'>Next</Text>
                        </View> : null
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
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

