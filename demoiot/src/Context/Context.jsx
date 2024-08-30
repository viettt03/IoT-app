import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const Context = createContext();

export const Provider = ({ children }) => {
    const [sensorHistory, setSensorHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataHome, setDataHome] = useState([]);
    const [controlHistory, setControlHistory] = useState([]);
    const [pageControl, setPageControl] = useState(1);
    const [totalPagesControl, setTotalPagesControl] = useState(1);

    const [direction, setDirection] = useState(null)
    const [selectedColumn, setSelectedColumn] = useState(null)




    useEffect(() => {
        fetchCurrentData();
        fetchSensorHistory(page);
        fetchControlHistory(pageControl);
    }, []);

    const fetchCurrentData = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:8080/api/getDataHome');
            setDataHome(response.data.data);
        } catch (error) {
            console.error('Failed to fetch current sensor data:', error);
        }
    };

    const fetchSensorHistory = async (page) => {
        const url = 'http://10.0.2.2:8080/api/getDataTb1';
        try {
            const response = await axios.get(url, {
                params: {
                    page,
                    limit: 10
                }
            });
            setSensorHistory(response.data.data);

            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };
    const fetchControlHistory = async (page) => {
        const url = 'http://10.0.2.2:8080/api/getDataTb2';
        try {
            const response = await axios.get(url, {
                params: {
                    page,
                    limit: 10
                }
            });
            setControlHistory(response.data.data);
            setTotalPagesControl(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };


    const sortData = async (sortBy, order, page) => {
        if (sortBy === 'id') sortBy = 'order';
        const url = 'http://10.0.2.2:8080/api/sortDataTb1';
        try {
            console.log(sortBy, order, page);

            const response = await axios.get(url, {
                params: {
                    sortBy: sortBy,
                    order: order,
                    page: page
                }
            });
            setSensorHistory(response.data.data);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };
    const sortTable = async (column) => {
        const newDirection = direction === "desc" ? "asc" : "desc";
        await sortData(column.toLowerCase(), newDirection, page);
        setSelectedColumn(column.toLowerCase())
        setDirection(newDirection)
    }

    return (
        <Context.Provider value={{
            sensorHistory, fetchSensorHistory, page, setPage, totalPages, dataHome, setSensorHistory,
            sortTable, direction, selectedColumn, sortData,
            fetchControlHistory, setPageControl, totalPagesControl, pageControl, controlHistory, setControlHistory,
            setTotalPagesControl

        }}>
            {children}
        </Context.Provider>
    );
};
