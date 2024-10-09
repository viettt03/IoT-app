import { Alert, Button, Dimensions, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

const { width } = Dimensions.get('window');

const ProfileScreen = (props) => {
    const [active, setActive] = useState(0);
    const [imagePreview, setImagePreview] = useState(false);
    const handleLinkPress = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url); // Kiểm tra xem có mở được URL không
            if (supported) {
                await Linking.openURL(url); // Mở URL nếu khả dụng
            } else {
                Alert.alert(`Không thể mở URL: ${url}`);
            }
        } catch (error) {
            Alert.alert('Có lỗi xảy ra:', error.message);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView className=''>
                {
                    imagePreview ? (
                        <TouchableOpacity className='h-screen bg-white w-full items-center justify-center'
                            onPress={() => setImagePreview(!imagePreview)}
                        >
                            <Image source={{ uri: 'https://res.cloudinary.com/dlggsv9ks/image/upload/v1728316241/avatars/avt_rk1boy.jpg' }} width={350} height={450} />
                        </TouchableOpacity>
                    ) : (
                        <View className='p-5'>
                            <View className='flex-row justify-between'>
                                <View style={{ marginTop: 5 }}>
                                    <Text className='text-[#000] text-[27px]' >Trần Trọng Việt</Text>
                                    <Text className='text-[#000] text-[15px]' >B21DCCN791</Text>

                                </View>
                                <TouchableOpacity onPress={() => setImagePreview(!imagePreview)}>
                                    <Image source={{ uri: 'https://res.cloudinary.com/dlggsv9ks/image/upload/v1728316241/avatars/avt_rk1boy.jpg' }} height={70} width={70} borderRadius={100} />
                                </TouchableOpacity>
                            </View>
                            <Text className='w-[80%] pt-3 text-[#000] font-sans text-xl leading-6' style={{ marginTop: -10 }}>
                                Contact:
                            </Text>
                            <Text className='text-[#000] text-[15px]' >Email: viettt03@gmail.com</Text>
                            <Text className='text-[#000] text-[15px]' >SDT: 0377993756</Text>

                            <View className='py-3 px-6 flex-row w-full items-center g-10'>
                                <TouchableOpacity >
                                    <Text className='w-[100] pt-1 text-center h-[30px] text-[#000] mr-5' style={{ borderColor: '#666', borderWidth: 1, borderRadius: 5 }}>Edit profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text className='w-[100] pt-1 text-center h-[30px] text-[#000]' style={{ borderColor: '#666', borderWidth: 1, borderRadius: 5 }}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                            <View className='border-b border-b-[#00000032] p-4'>
                                <View className='w-[95%] m-auto flex-row justify-between'>
                                    <TouchableOpacity onPress={() => setActive(0)}>
                                        <Text className='text-[18px] pl-3 text-[#000]' style={{ opacity: active === 0 ? 1.2 : 0.5 }}>Threads</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setActive(1)} >
                                        <Text className='text-[18px] pl-3 text-[#000]' style={{ opacity: active === 1 ? 1.2 : 0.5 }}>Replies</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    active === 0 ? (
                                        <View className='w-[45%] absolute h-[1px] bg-black left-[4px] bottom-0' />
                                    ) : (
                                        <View className='w-[45%] absolute h-[1px] bg-black right-[-4px] bottom-0' />

                                    )
                                }
                            </View>

                            <View className="flex-1 justify-center items-center bg-gray-100 p-4">
                                <Text className="text-xl font-semibold mb-4">Link and Download</Text>

                                <TouchableOpacity
                                    style={{ padding: 10, borderRadius: 5, backgroundColor: '#eee', width: '80%', alignItems: 'center', marginTop: 5 }}
                                    onPress={() => Linking.openURL('https://github.com/viettt03/IoT-app.git')}
                                >
                                    <Text style={{ color: 'blue', fontSize: 18 }}>GitHub</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ padding: 10, borderRadius: 5, backgroundColor: '#eee', width: '80%', alignItems: 'center', marginTop: 10 }}
                                    onPress={() => Linking.openURL('https://drive.google.com/file/d/186XMKkkWNIXOuy16SY0mkOqNOM6pwJ7c/view')}
                                >
                                    <Text style={{ color: 'blue', fontSize: 18 }}>API docs</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ padding: 10, borderRadius: 5, backgroundColor: '#eee', width: '80%', alignItems: 'center', marginTop: 10 }}
                                    onPress={() => Linking.openURL('https://drive.google.com/file/d/1vtIYObI7JXQiq87MWhG7073f06dmvcpC/view?usp=sharing')}
                                >
                                    <Text style={{ color: 'blue', fontSize: 18 }}>Report</Text>
                                </TouchableOpacity>


                            </View>
                        </View>
                    )}
            </SafeAreaView>

        </ScrollView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})