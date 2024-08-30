import { Button, Dimensions, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const { width } = Dimensions.get('window');

const ProfileScreen = (props) => {
    const [active, setActive] = useState(0);

    const handleLinkPress = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(`Không thể mở URL: ${url}`);
                }
            });
    };


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView className='p-[15px]'>
                <View className='flex-row justify-between'>
                    <View style={{ marginTop: 5 }}>
                        <Text className='text-[#000] text-[27px]' >Trần Trọng Việt</Text>
                        <Text className='text-[#000] text-[15px]' >B21DCCN791</Text>

                    </View>

                    <Image source={{ uri: 'https://photo.znews.vn/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg' }} height={70} width={70} borderRadius={100} />
                </View>
                <Text className='w-[80%] py-3 text-[#000] font-sans leading-6 text-[17px]' style={{ marginTop: -10 }}>
                    Định nghĩa các thuộc tính được truyền vào các component React:
                    Trong React, các component có thể nhận các thuộc tính (props)

                </Text>


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
                        className="py-2 px-4 rounded mb-2"
                        onPress={() => handleLinkPress('https://example.com/link1')}
                    >
                        <Text className="text-blue-400 text-lg border-b-2 border-b-blue-400">GitHub</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-2 px-4 rounded mb-2"
                        onPress={() => handleLinkPress('https://example.com/link2')}
                    >
                        <Text className="text-blue-400 text-lg border-b-2 border-b-blue-400">API docs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-2 px-4 rounded mb-4"
                        onPress={() => handleLinkPress('https://example.com/link3')}
                    >
                        <Text className="text-blue-400 text-lg border-b-2 border-b-blue-400">Report</Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>

        </ScrollView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})