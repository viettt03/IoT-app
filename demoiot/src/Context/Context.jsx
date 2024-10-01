import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const Context = createContext();

export const Provider = ({ children }) => {
    const [sensorHistory, setSensorHistory] = useState([]);
    const [pageSensor, setPageSensor] = useState(1);
    const [totalPagesSensor, setTotalPagesSensor] = useState(1);
    const [controlHistory, setControlHistory] = useState([]);
    const [pageControl, setPageControl] = useState(1);
    const [totalPagesControl, setTotalPagesControl] = useState(1);
    const [currentData, setCurrentData] = useState({ temp: 0, humidity: 0, light: 0 });
    const [temps, setTemps] = useState([{ value: 0, dataPointText: '0' }])
    const [hums, setHums] = useState([{ value: 0, dataPointText: '0' }])
    const [lights, setLights] = useState([{ value: 0, dataPointText: '0' }])


    const fetchSensorHistory = async ({
        sortBy = 'timestamp',
        order = 'desc',
        minValue = 0,
        maxValue = Number.MAX_SAFE_INTEGER,
        selectField = 'temp',
        startTime = new Date(0),
        endTime = new Date(),
        page = 1,
    }) => {
        const url = 'http://10.0.2.2:8080/api/getDataSensor';
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
                    startTime,
                    endTime
                }
            });
            setSensorHistory(response.data.data);

            setTotalPagesSensor(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };


    const fetchControlHistory = async ({
        startTime = new Date(0),
        endTime = new Date(),
        page = 1,
        deviceId = null,
        action = null


    }) => {

        const url = 'http://10.0.2.2:8080/api/getDataControl';
        try {
            const response = await axios.get(url, {
                params: {
                    page,
                    limit: 10,
                    startTime,
                    endTime,
                    deviceId,
                    action
                }
            });
            setControlHistory(response.data.data);
            setTotalPagesControl(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch sensor history:', error);
        }
    };


    useEffect(() => {
        const ws = new WebSocket('ws://10.0.2.2:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            const res = JSON.parse(event.data);
            if (res.type === 'sensorData') {
                const data = res.data
                setCurrentData({
                    temp: Number(data[0]),
                    humidity: Number(data[1]),
                    light: Number(data[2])
                });

                setTemps(prevTemps => {
                    const updatedTemps = [...prevTemps, { value: Number(data[0]), dataPointText: data[0] }];
                    if (updatedTemps.length > 10) updatedTemps.shift();
                    return updatedTemps;
                });

                setHums(prevHums => {
                    const updatedHums = [...prevHums, { value: Number(data[1]), dataPointText: data[1] }];
                    if (updatedHums.length > 10) updatedHums.shift();
                    return updatedHums;
                });

                setLights(prevLights => {
                    const updatedLights = [...prevLights, { value: Number(data[2]), dataPointText: data[2] }];
                    if (updatedLights.length > 10) updatedLights.shift();
                    return updatedLights;
                });
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <Context.Provider value={{
            currentData,
            temps, hums, lights,
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


        }}>
            {children}
        </Context.Provider>
    );
};
