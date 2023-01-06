import { useState } from 'react';
import { SectionList, Text } from 'native-base';
import { Heading, VStack } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';

export function History(){
    const [exercises, setExercises] = useState([{
        title: '26.08.22',
        data: ["Puxada Frontal", "Remada Unilateral"]
    },{
        title: '27.08.22',
        data: ["Puxada Frontal"]
    }]);
    return(
        <VStack flex={1}>
            <ScreenHeader title="Historico de exercicios"/>
            <SectionList 
                sections={exercises}
                keyExtractor={item => item}
                px={8}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center'}}
                renderItem={({ item }) => (
                    <HistoryCard/>
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