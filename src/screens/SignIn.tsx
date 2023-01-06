import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { Controller, useForm } from 'react-hook-form'; 

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormData = {
    email: string;
    password: string;
}

export function SignIn() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const { control, handleSubmit, formState: {errors}} = useForm<FormData>();

    function handleNewAccount(){
        navigation.navigate('signUp');
    }

    function handleSignIn({email, password}:FormData){
        console.log(email, password);
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    resizeMode='contain'
                    position="absolute"
                />
                <Center my={24}>
                    <LogoSvg/>

                    <Text color="gray.100" fontSize="sm">
                        treine sua mente e seu corpo
                    </Text>
                </Center>
                <Center>
                    <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                        Acesse sua conta
                    </Heading>
                    <Controller 
                        control={control}
                        name="email"
                        rules={{ required: 'Informe o email'}}
                        render={({ field: { onChange}}) =>(
                            <Input 
                            placeholder='E-mail'
                            keyboardType='email-address'
                            onChangeText={onChange}
                            errorMessage={errors.email?.message}
                            autoCapitalize='none'
                        />
                        )}
                    />
                    <Controller 
                        control={control}
                        name="password"
                        rules={{ required: 'Informe a senha'}}
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        title='Acessar'
                        onPress={handleSubmit(handleSignIn)}
                    />
                </Center>

                <Center mt={24}>
                    <Text
                        color="gray.100"
                        fontSize="sm"
                        mb={3}
                        fontFamily="body"
                    >
                        Ainda nao tem acessso?
                    </Text>
                </Center>
                <Button
                    title='Criar conta'
                    variant="outline"
                    onPress={handleNewAccount}
                />
            </VStack>
        </ScrollView>
    );
}