import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Heading, VStack, SectionList, Text, useToast } from 'native-base';

import { api } from '@services/api';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';
import { AppError } from '@utils/AppError';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';

export function History(){
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

    const toast = useToast();

    async function fetchHistory(){
        try {
            setIsLoading(true);
            const response = await api.get('/history', {});
            setExercises(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Nao foi possivel carregar o historico';

            toast.show({
                title, placement: 'top', bgColor: 'red.500'
            });
        }finally{
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, []));

    return(
        <VStack flex={1}>
            <ScreenHeader title="Historico de exercicios"/>
            <SectionList 
                sections={exercises}
                keyExtractor={item => item.id}
                px={8}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center'}}
                renderItem={({ item }) => (
                    <HistoryCard data={item}/>
                )}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                        {section.title}
                    </Heading>
                )}
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Nao ha exercicios registrados ainda.{'\n'}
                        Vamos fazer exercicios hoje?
                    </Text>
                )}
            />
            
        </VStack>
    );
}