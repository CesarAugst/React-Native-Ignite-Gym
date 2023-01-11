import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { useAuth } from '@hooks/useAuth';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

const PHOTO_SIZE = 33;

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string;
}

const profileSchema = yup.object({
    name: yup
        .string()
        .required('Informe o nome'),
    password: yup
        .string()
        .min(6, 'A senha deve ter no minimo 6 digitos')
        .nullable()
        .transform((value) => !!value ? value : null),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('password'), null], 'A confirmacao de senha nao confere')
        .when('password', {
            is: (Field: any) => Field,
            then: yup
                .string()
                .nullable()
                .required('Informe a confirmacao da senha')
                .transform((value) => !!value ? value : null)
        }),
})

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/cesaraugst.png');

    const toast = useToast();
    const { user } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues:{
            name: user.name,
            email: user.email,

        },
        resolver: yupResolver(profileSchema)
    });

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

    async function handleProfileUpdate(data: FormDataProps){
        console.log(data)

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

                    <Controller name="name"
                        control={control}
                        render={({ field: {value, onChange} }) => (
                            <Input placeholder='Nome'
                            bg="gray.600"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.name?.message}
                        />
                        )}
                    />
                    <Controller name="email"
                        control={control}
                        render={({ field: {value, onChange} }) => (
                            <Input placeholder='E-mail'
                                bg="gray.600"
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    
                    <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
                        Alterar senha
                    </Heading>

                    <Controller name="old_password"
                        control={control}
                        render={({ field: {onChange} }) => (
                            <Input placeholder='Senha Antiga'
                                bg="gray.600"
                                secureTextEntry
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <Controller name="password"
                        control={control}
                        render={({ field: {onChange} }) => (
                            <Input placeholder='Nova Senha'
                                bg="gray.600"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller name="confirm_password"
                        control={control}
                        render={({ field: {onChange} }) => (
                            <Input placeholder='Confirme a nova senha'
                                bg="gray.600" 
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.confirm_password?.message}
                            />
                        )}
                    />
                    <Button title='Atulizar'
                        mt={4}
                        onPress={handleSubmit(handleProfileUpdate)}
                    />
                </Center>
            </ScrollView>
        </VStack>
    );
}