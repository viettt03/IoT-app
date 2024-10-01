import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

const renderDateTimePicker = (date, setDate, showPicker, setShowPicker, time, setTime, showTimePicker, setShowTimePicker) => (
    <View className="flex-row justify-between" >
        {/* <Text className="text-lg font-semibold mb-3 text-gray-700">{label}</Text> */}
        <View>
            <TouchableOpacity onPress={() => setShowPicker(true)} className="mb-3">
                <TextInput className="border w-32 mr-6 border-gray-300 rounded-lg h-10 px-4 text-gray-700" value={date.toLocaleDateString()} editable={false} />
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}
        </View>
        <View>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="mb-3">
                <TextInput className="border w-32 border-gray-300 rounded-lg h-10 px-4 text-gray-700" value={`${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`} editable={false} />

            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={time} // Đặt giá trị mặc định là thời gian hiện tại
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) setTime(selectedTime); // Cập nhật giờ đã chọn
                    }}
                />
            )}
        </View>
    </View>
);

export default renderDateTimePicker

const styles = StyleSheet.create({})