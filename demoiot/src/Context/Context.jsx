import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
export const Context = createContext();

export const Provider = ({ children }) => {
    const [sensorHistory, setSensorHistory] = useState([]);
    const [pageSensor, setPageSensor] = useState(1);
    const [totalPagesSensor, setTotalPagesSensor] = useState(1);
    const [controlHistory, setControlHistory] = useState([]);
    const [pageControl, setPageControl] = useState(1);
    const [totalPagesControl, setTotalPagesControl] = useState(1);
    const [warningToday, setWarningToday] = useState(0);


    const fetchSensorHistory = async ({
        sortBy = 'timestamp',
        order = 'desc',
        minValue = 0,
        maxValue = Number.MAX_SAFE_INTEGER,
        selectField = 'temp',
        date = null,
        page = 1,
        limit = 10
    }) => {
        const url = 'http://192.168.193.89:8080/api/getDataSensor';
        try {

            const response = await axios.get(url, {
                params: {
                    sortBy,
                    order,
                    page,
                    limit: 10,
                    minValue,
                    maxValue,
                    selectField,
                    date,
                    limit
                }
            });
            setSensorHistory(response.data.data);
            setTotalPagesSensor(response.data.totalPages);
            if (!response.data.data) setPageSensor(0);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };


    const fetchControlHistory = async ({
        date = null,
        page = 1,
        deviceId = null,
        action = null,
        limit = 10

    }) => {

        const url = 'http://192.168.193.89:8080/api/getDataControl';
        try {
            const response = await axios.get(url, {
                params: {
                    page,
                    limit: 10,
                    date,
                    deviceId,
                    action,
                    limit
                }
            });
            setControlHistory(response.data.data);
            setTotalPagesControl(response.data.totalPages);
            if (!controlHistory) setControlHistory(0);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };

    const fetchWarningToday = async () => {

        const url = 'http://192.168.193.89:8080/api/getWarningToday';
        try {
            const response = await axios.get(url);
            setWarningToday(response.data.countWaring);

        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };

    const value = useMemo(() => ({
        sensorHistory,
        fetchSensorHistory,
        pageSensor,
        setPageSensor,
        totalPagesSensor,
        setSensorHistory,
        fetchControlHistory,
        setPageControl,
        totalPagesControl,
        pageControl,
        controlHistory,
        setControlHistory,
        setTotalPagesControl,
        warningToday,
        fetchWarningToday
    }), [
        sensorHistory, totalPagesSensor, controlHistory, totalPagesControl, pageSensor, pageControl, warningToday
    ]);


    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};
