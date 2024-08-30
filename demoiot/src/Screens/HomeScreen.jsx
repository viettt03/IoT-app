import { View, Text, Image, SafeAreaView, ScrollView, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import { LineChart } from "react-native-gifted-charts"
import { Context } from '../Context/Context';
import axios from 'axios';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const HomeScreen = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnabled2, setIsEnabled2] = useState(false);
    const [isEnabled3, setIsEnabled3] = useState(false);
    const toggleSwitch = (device, setEnabled, value) => {
        setEnabled(previousState => !previousState);
        sendData(device, !value)
    }

    const sendData = async (device, control) => {
        await axios.post('http://10.0.2.2:8080/api/postDataTb2', { device, control: control ? 1 : 0 })
            .then(response => {
                console.log('Data sent successfully');
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    };

    const { dataHome } = useContext(Context);
    const currentData = dataHome[0];
    const reversedData = [...dataHome].reverse();
    const temps = reversedData.map(item => ({ value: item.temp, dataPointText: String(item.temp) }));
    const hums = reversedData.map(item => ({ value: item.humidity, dataPointText: String(item.humidity) }));
    const lights = reversedData.map(item => ({ value: item.light, dataPointText: String(item.light) }));


    const getColor = (value) => {
        if (value < 25) {
            return '#2faeee'; // Đỏ nếu giá trị nhỏ hơn 50
        } else if (value >= 25 && value < 40) {
            return 'orange'; // Vàng nếu giá trị từ 50 đến dưới 75
        } else {
            return 'red'; // Xanh nếu giá trị từ 75 trở lên
        }
    };



    const renderLegend = (text, color) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View
                    style={{
                        height: 3,
                        width: 25,
                        marginRight: 10,
                        borderRadius: 4,
                        backgroundColor: color || 'white',
                        marginTop: 10
                    }}
                />
                <Text style={{ color: 'black', fontSize: 16 }}>: {text || ''}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <Text className='mb-5 font-[600] text-3xl p-3 text-black text-center'>Sensor</Text>
                <View className='flex-row  justify-center '>
                    <View className='mx-2'>
                        <Text className='text-center font-medium text-base mb-2'>Temperature</Text>
                        <AnimatedCircularProgress
                            size={125}
                            width={18}
                            fill={currentData && currentData.temp ? currentData.temp : 0}
                            tintColor={getColor(currentData?.temp)}
                            backgroundColor="#95b3d4"
                            rotation={240} // Xoay nửa hình tròn
                            arcSweepAngle={240} // Vẽ nửa hình tròn
                            lineCap="round" // Làm đầu nét vẽ tròn
                        >
                            {() => (
                                <Text className='font-[600] text-3xl p-3 text-center'>{currentData?.temp} C</Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>

                    <View className='mx-2'>
                        <Text className='text-center font-medium text-base mb-2'>Humidity</Text>
                        <AnimatedCircularProgress
                            size={125}
                            width={18}
                            fill={currentData && currentData.humidity ? currentData.humidity : 0}
                            tintColor={getColor(currentData?.humidity)}
                            backgroundColor="#95b3d4"
                            rotation={240} // Xoay nửa hình tròn
                            arcSweepAngle={240} // Vẽ nửa hình tròn
                            lineCap="round" // Làm đầu nét vẽ tròn
                        >
                            {() => (
                                <Text className='font-[600] text-3xl p-3 text-center'>{currentData?.humidity} %</Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>

                    <View className='mx-2'>
                        <Text className='text-center font-medium text-base mb-2'>Light</Text>
                        <AnimatedCircularProgress
                            size={125}
                            width={18}
                            fill={currentData && currentData.light ? currentData.light : 0}
                            tintColor={getColor(currentData?.light)}
                            backgroundColor="#95b3d4"
                            rotation={240} // Xoay nửa hình tròn
                            arcSweepAngle={240} // Vẽ nửa hình tròn
                            lineCap="round" // Làm đầu nét vẽ tròn
                        >
                            {() => (
                                <Text className='font-[600] text-3xl p-3 text-center'>{currentData?.light}</Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>


                </View>
                <View className='w-[95%] m-auto flex-row justify-between border-b border-b-[#00000032] p-4' />

                <View className='mt-10 text-center justify-center content-center flex mx-auto'>
                    <Text className='mb-5 font-[600] text-3xl p-3 text-black text-center'> Chart </Text>
                    <LineChart
                        curved
                        data={temps}
                        data2={hums}
                        data3={lights}
                        height={250}
                        showVerticalLines
                        spacing={40}
                        initialSpacing={6}
                        maxValue={110}
                        color1="skyblue"
                        color2="orange"
                        color3='green'
                        textColor1="skyblue"
                        textColor2="orange"
                        textColor3="green"
                        dataPointsHeight={6}
                        dataPointsWidth={6}
                        dataPointsColor1="skyblue"
                        dataPointsColor2="red"
                        dataPointsColor3="green"
                        textShiftY={-2}
                        textShiftX={-5}
                        textFontSize={13}
                    />

                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginTop: 20,
                        }}>
                        {renderLegend('Temp', 'skyblue')}
                        {renderLegend('Humidity', 'orange')}
                        {renderLegend('Light', 'green')}
                    </View>
                </View>

                <View className='w-[95%] m-auto flex-row justify-between border-b border-b-[#00000032] p-4' />

                <View className='mx-auto flex w-[60%]'>
                    <Text className='mb-5 font-[600] text-3xl p-3 text-black text-center'>Controll</Text>
                    <View className='flex-row justify-between'>
                        <Image source={{ uri: 'data:image/png;base64,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' }}
                            style={{ width: 100, height: 100, }}
                        />
                        <View className='content-center my-auto'>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(1, setIsEnabled, isEnabled)}
                                value={isEnabled}
                                style={{ transform: [{ scale: 3 }] }}
                            />
                        </View>

                    </View>
                    <View className='flex-row justify-between mt-5'>
                        <Image
                            style={{ width: 100, height: 100, }}
                            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAACUCAMAAADBJsndAAAAY1BMVEX///8AAACRkZGampr5+fnExMR+fn55eXqnp6eMjIz19fWysrK1tbVxcXHHx8eIiIjPz8/W1tbv7+/k5OTc3NxdXV1MTEwWFhYrKysKCgpoaGhCQkJTU1MiIiIwMDBiYmI5OTktWYLMAAAFGklEQVR4nO1b25KqSgwVAbmIgoAgIMr/f+XuxDp1knamahoIs2dP1qNlVy+SzkrSl91OoVAoFAqFQqFQuCKo6nMojeJSlYtYlsfD4G2BWx/X82nG901IvjDtZ7IMtmQJaKs5NOuXx9trJI/+gXONoTvNssGhflEF8ijr4w1mu7kvUnT6dVkYuiBN0KKuw44wKg8kGH2GGKd0G1PC4nymMoQ+Q+Luefy27Zz+QoAB4TQich2xCjIza+9incoEe7cgQcxEZYJ+cpm26DzvPkt1F6F8GoMWDgPO5v8RiaL0nEkhJH4OcjPv2ZEnFSXJDHpfj2fVCvIkWX2xPW+CPG/r2XNXH6KDDKIDCdfFPDeC8lwXv4ZnlchhzTj6Ibr0Y3S+EeTZrGfPXZkdpZCtWYdsBOW5LpbzDFIpsFmW8jxHJylEhNdSnsFDUJceZJ6lOt8J8uxW1PmTHNHu9P80i3mmgpvepK39Pbq0DZTnulCe60J5rgvluS6U57r4p3kmYnQ+RzKDZ5Pst0bSzOD5XVCe38ezMP+fEn9r7CdHnrUZcPuGc8PB88aLy4DefFgmxuczgBvdjlV9M6LbXOjheNLtdlD9cB6yHHD8ProsT4ODt7nnL3AKcHUdhVvy8YauD0eY0Tl4CxzWF9tcEgkuOYpn7D40Q4t2z9yPxZGcXic/syKi2CwF/YcZ1gSU/bgly7vLzRCOcy65Q0vRnbIlt7qCqoiFbghQ+GG98d2zvwdBcbZU9XK2xKsOrR+qsLJ/kL7FFcRj6zOix0ebM6+FU3divIqmuzJe9bMbXOqiGahMZDWURXk1NSCdNI1MWLDYhfaM5WC4ZjhThL6K0EzxpG69dJ43UOLVZBGHL2Hlb3oyPxxFaaZwMZRdJgUSJ+p3uOt4pcT35oeB+j02nzbOV8svIABWLb3uDKZhPgRWLAHiXdKI/IDdVy8qRFjuUXNCQe2RI6DXheErPXOEOoEuDLg96d1EzQl9k9eTHyoowe9kuabQsUzU6/BpzMlo8Bk30B0AFTcL9sIY60FjprZbRvwSygp7L+Fgh6XGrgMDcbZhBsRZVF1sHYO7uq2wysPiO1BaqFKUFpTXA5UtMPBIaaFKia5OExNGUFqq2GAtZmGwFtvqQzfTJY13tBvZhgYnZcZAAaCSjc8KKPM3Wcrg8Nm5X3MDdk10pwTjpiXMS4ibjtg8eFPY3BY3AYS2ikPgsEmx9acqji9a6DZH0NsJSgC+nSYziwWmm4lqFTTm1OSvRSy8OVB3H+gMk1CoMhgt3HZntHx5CYUulD33qUbrEQH4mSUgzFFU6oODeL2Ee1URVRUIE/YoI7GTFkQ8K/TCVjpzYr3U0SkiO5p9O9Iyz/o03Bhwem/iDN+WFCyPers8ouasQcoeZGGUIAit476cGyr7+RQmQVq0YbZheTK3UwN+q2y0f1gvsSdYlw/rJcoKmw7ht01fq5d6u14abB2TftsU27RCu4OAxNrY9RI7kkADCzfFQIu1vJjvqVfxdSo1Oa7gA/kBV7BwGYIPrqgxULGZFCa2Tr09d9yiXsIyZCJ+vYAMjbRLmyzVQYNSmwdvkiuAoz0HNrm0MK5tWcf+km5NYAHVCB+j7e166WgnfLA5S/hgc5bw0eayHSea625v07B6CRYxr5cONq29vOOhXmfmg+XGH10m9imlb/PM5OulXd1bG+lV1HAflvnASaT+wLcid/G0/7UbyAqFQqFQKBQKhUKhUCgUCsWPxx8mJms7UnfyyQAAAABJRU5ErkJggg==' }} />
                        <View className='content-center my-auto'>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isEnabled2 ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(2, setIsEnabled2, isEnabled2)}
                                value={isEnabled2}
                                style={{ transform: [{ scale: 3 }] }}
                            />
                        </View>
                    </View>
                    <View className='flex-row justify-between my-5'>
                        <Image
                            style={{ width: 100, height: 100, }}
                            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8AAACYmJhbW1v7+/uPj4+Hh4cpKSns7OxhYWEPDw8ICAjX19fKysoTExPw8PCzs7MyMjJRUVHf39/l5eVmZmZHR0fR0dGenp6oqKh5eXknJyfAwMBubm46Ojqvr6+kpKR/f38dHR1LS0svLy83Nzdzc3O7u7sgICCLi4uYwoN9AAAKEUlEQVR4nO2daWOqOhCGi4JVq8W622rVVmv7///gPadqZrJBAhkGzuX56ELyQpaZySQ8PLS0tPzPSNOYuwqkTKbP0Uuvz10NOrrRlTF3RahYRHdm3FWhYSwERl3uutCwA4XRnLsyJLwhhf9mTxz+8wqfW4WNp1XYfFqFzadV2Hxahc2nVdh8WoXNp1XYfBqkMC4W1C2tMC5YsCdp8h5F032Bf0blFI5ev6PhgP7hz56uVfz0v529Xmez2ew3m3Xy6h8wXd/uTc/7n370xVN4r3b9oSMK7tAWhGKeLyltURIgkDjWmuK+9FLdU8QCowNlSXNcUnUNVRIYfVEWJSuMztVIlAVGO8qy0ohBoiIwWpOWtqteoiqQeFVnphZH3hc1gUfiArdqgcSThiaQfulxokmkfIoMAg0SCRuqJnBKVhRGk+gy3Iwuh930/fHjz89Pp2k32Y8dWjfLE/yLLjGrtunssHtW//HLMsmWySbQpy/ODoMPozqhsmdVySjQJNFYzc5LprobH13jDJeov6umD95RJQ70h5huzG3TxG6kF6HOS1VnqMgSdVOx33OW98un7ryPpR9Un4KDJb6qX6ae+swaV+jbapvoFZCo2VFrvf4uTNX+CDYih8CHh4vlCa4eiwn8Q0/pzneJXFliE1Pp8aut+qfB7uuYJL2v3WI5tPzmW2mqW1aBV4nKVDg6mSr+/jOZS6mzaX+8Xph+qcbSNhFXE70yiZ7ldFhtlv7D19b299nacD8e5d7YY05k3EsTWTzQ6rvYZhuts0QXKbfUJHytCzN/V6o6TBz88Xg7VSXSximKM1NtmLWrWzVaZnfGmjBSapn4uI3js9J3yapZnJVcxalvQr5iJZCGDAuhPMECa1NzuTtqliAzcgzuXGxHhewv1asvypHiwvG+1bc0UIWsYVmksXBS/DqpNN/UaCn8K1i94k98qdrsWdjgWhm8dS+wtfodpHrlmYcUKEukjuA7gvvOKsD18KxRi66YBK8Qsm++a7BbEc+Egcb3FIVYazDxd6E2wYxJbAGW79glQVHNgItQB7jqMthFC/JMc7fRtHgJeNkC7KEmQX1xyEyKXkJe1583qoogK6KEFVgeFPgOPXPBLMvZE2NYWwrusaLx1BqrowetnYTfnQ1xO8Zw4o7uEUqmBNsRBcjvpfBzwJYgTri0A/MySTuC0M8HxeVdgOGOxgWA64dwWQoAjZTIU4UAI1Nk/0JdAXCtmaZEGM6pDvIAX5glYhOL0B9ZCiaYbiyWG8xXZF4qNFOWgA10Q7pgivDNWDriUSikMzkgJ4AjXiOGAcKoJnREgmDGrLPoGpjeXe5UuIaL8IXfAbPmvpgVT0216h79IwHmRAk0qoEXvgkmSCMWhay1T1Q87Z5P64XuzhqMc4SBlFg0FDFe29MdvQa8jLSt+63aap9QIDq7GEy7xlr95c1jNIoz8kLviaQb7RMKYDDVP9HwMAvm9quIYRsec2BREj2tlKO9ah5mgbZvBHH/TUf7hIJEKyUjr9Mj0JD1DO1lU6Dfxx971XxW/tUMHoNCUdIwqCQFvS9o6d+AT0xOy1TPUPgcVJKCrtCUG3jFz3ZV96jpCqtppbpCeyv19FKtt0r/QTg9OrpC20iz9Lb/423HhAhYVDNb6C1lbKzWhMAy31Si8FhJKWZgMKKMSAsL5kRYiAWwSynXoYVdypDrDVYB4dIQRLsYMhYq9g8Zli7A/yCMg0FDKXKYSlmEo0YYB6ums9sQCYmEhimYFVUeM6KXTnd/RTDlgyOaCAvtdCF3UQRLYnsqAtJk4UQIJvKsAgsn8o2qk4Dty7NEClYxVUeERWCeXAUYyolmRAgXceWbiAoMaUY6GK25NiZA5J/GNIVGyvW2CGimJGYNZFwxuE5X0CoJxU2GVfwDwdXdgJ0kBFMi2ivGYbJdQfmD4SeMT8rbV6AWwX1wlPfIlBH1C2QrhDZO0fIXby47Oj4h7JyIVjB5U9lR+D9oJAWtfp1DXrcA3zT3Gr11h3vrEz5EJlzyGVro5Twy4gpK2gg2JKBdHDV4vRfa+xFq4xPe9lSHMyPwDQ/iiqfoaJf3EBcsDc7/CDDaxPh4Bfada79IW9XL2x94Cylbkr6CdChXyJ3O/OPoHWnBuNzghxOCfJKcqME3/qPMtCitYdejE97ABwWdirtzUioJtzEjk+KXG56Kti6ptRMu2hVCShQraNxIWTw/YetXjA1+VtIJPIMil5OOuJE8lQvT5rWOfJ/HJZ+AlEwnBS760SNLpKajDgYXXEVvl1/KaZVj3MuIReLvqDCUCsYWqvdKA54Ip9JQ9TuDkK3+WOmYxpQDrqXf9XAbX0oCb3HnEnNQIcS4fjR/HPlG+tHJBbIpI7pntU8RKTlIXyCbxOuYb3yIj9S+0SkgVfZFaWaWnxU6OdHHk0Iek+yd4G0R1UlUMjMlOzSG5uYRqkZToWzKyHmuVfVFLfVUKhdV1r2Zgj26sHx+pZq+qB8kLisBP8PdN7BtFt2rZVUhMfcw/wJZKLD5R72YlnBO31C1/ULaEru+GysXiINoDoUukdgtHqsF6jkEsVicdh5qwDHRJ1FNYiGr3h11X5XJchEd8dH1qqDCEB/QJJK6/uq7goym2VF87XrZ7Lx/VSJpAE7ZEGVOc4Gu6tplcnanXORSSZeE5Q1RljyezDZnRMzrluCA/BRJd67js+Ks3gNMF67hYTEd2kYRSSJtunAvXyBqyq7RMhGpsz4eLJF2RozFsrY91Sxr7DcjbFl78AP6IvUBEv2bF5Cxpu2/B1r8IWMt7Z6AVUGQcTI4vbxm9bD+k2+PEQqzJoL0sHx5dznknZ6+aHSu91sorNXhyHZgwPVWeCCsVkBKKKxbJN8CjLeuW4+FQo6dMUUQKe6O6xdVnHQTlqnfM4ENavU5wDsH5CU7vAJiDMnO1N5tMCQP5CkP9NsaHIvsiPo2Flc4E0n9WOWLMcH7UiA/tHfjOMGfwuZObHyvVQ5NmQyvaO8NyqcOOXo+pOd8TRINMdgwGces6LzXKjvIlfTHsTcOu4ynPZdkdFkneexXfFtiWlr+F6yOi0E2u32Tu2FsPwIQ09yRNOMUR5mmuPYazq8FrlO6sxff+dqa3U6zziZUqEW6rD8eCuv1rkN3bC9u1mF9lUwJjs4Kmzol2k81Vjhw17QwM7e3rDfNu8fEh+nbYzbn10Y6v4g4B+76teTTz6Gpw+iNtHd+Hmbz1uAgjXN0v46vGXejny+u4dPFV762G2yvHSuHs0nTyID3X7LOrldoqG/h3A2b2xHdffymBmo2+dKuOCeE1w7XpeDm2t5xxgtFgFNzEhQMzDu9HJJt61601ICRlabkseVhH2Tqcv5MWd6sChs9iiK0DW93OI98DMvFLJB4n12lzA1LpU9NDeVbmCVLnAh2XjQ5OmMjnc9uk8TsX5klWlpaWm78B0mdbsybknTIAAAAAElFTkSuQmCC' }}
                        />
                        <View className='content-center my-auto'>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isEnabled3 ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(3, setIsEnabled3, isEnabled3)}
                                value={isEnabled3}
                                style={{ transform: [{ scale: 3 }] }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen