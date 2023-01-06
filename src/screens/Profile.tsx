import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { convertAbsoluteToRem } from 'native-base/lib/typescript/theme/tools';

const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/cesaraugst.png');

    const toast = useToast();

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4,4],
                allowsEditing: true
            });
    
            if(photoSelected.canceled){
                return;
            }
            if(photoSelected.assets[0].uri){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

                if(photoInfo.size && (photoInfo.size / 1024 /1024) > 5){
                    return toast.show({
                        title: "Essa imagem e muito grande. Escolha uma de ate 5MB",
                        placement: 'top',
                        bgColor: 'red.500'
                    });
                }

                setUserPhoto(photoSelected.assets[0].uri);   
            }
        } catch (error) {
            console.log(error);
        }finally{
            setPhotoIsLoading(false);
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader
                title='Perfil'
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 56 }} >
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={PHOTO_SIZE}
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />
                            :
                            <UserPhoto
                                source={{ uri: userPhoto}}
                                alt="Foto do usuario"
                                size={PHOTO_SIZE}
                            />
                    }
                    <TouchableOpacity>
                        <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8} onPress={handleUserPhotoSelect}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input
                        placeholder='Nome'
                        bg="gray.600"
                    />
                    <Input
                        placeholder='E-mail'
                        bg="gray.600"
                        isDisabled
                    />

                    <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
                        Alterar senha
                    </Heading>
                    <Input
                        bg="gray.600"
                        placeholder='Senha Antiga'
                        secureTextEntry
                    />
                    <Input
                        bg="gray.600"
                        placeholder='Nova Antiga'
                        secureTextEntry
                    />
                    <Input
                        bg="gray.600"
                        placeholder='Confirme a Senha Antiga'
                        secureTextEntry
                    />
                    <Button
                        title='Atulizar'
                        mt={4}
                    />
                </Center>
            </ScrollView>
        </VStack>
    );
}