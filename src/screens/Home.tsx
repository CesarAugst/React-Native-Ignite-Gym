import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HStack, VStack, FlatList, Heading, Text, useToast } from 'native-base';

import { api } from '@services/api';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';

import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { ExerciseCard } from '@components/ExerciseCard';
import { ExerciseDTO } from '@dtos/ExerciseDTO';

export function Home(){
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]); 
    const [groups, setGroups] = useState<string[]>([]);
    const [groupSelected, setGroupSelected] = useState('costas');

    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails(){
        navigation.navigate('exercise');
    }

    async function fetchGroups(){
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Nao foi possivel carregar os grupos musculares';

            toast.show({
                title, placement: 'top', bgColor: 'red.500'
            });
        }
    }

    async function fetchExercisesByGroup(){
        try {
            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercises(response.data);
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Nao foi possivel carregar os exercicios';

            toast.show({
                title, placement: 'top', bgColor: 'red.500'
            });
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]))

    return(
        <VStack flex={1}>
            <HomeHeader />
            
            <FlatList
                data={groups}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{px: 8}}
                my={10}
                maxH={10}
                minH={10}
                renderItem={({ item }) => (
                    <Group 
                        name={item}
                        isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                        onPress={() => setGroupSelected(item)}
                    />
                )}
            />

            <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color="gray.200" fontSize="md" fontFamily="heading">
                        Exercicios
                    </Heading>
                    <Text color="gray.200" fontSize="sm">
                        {exercises.length}
                    </Text>
                </HStack>
                
                <FlatList 
                    data={exercises}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{paddingBottom: 20}}
                    renderItem={({item}) => (
                        <ExerciseCard 
                            onPress={handleOpenExerciseDetails}
                            data={item}
                        />
                    )}
                />
            </VStack>
        </VStack>
    );
}