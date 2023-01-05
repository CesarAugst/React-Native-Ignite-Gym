import { VStack } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';

export function History(){
    return(
        <VStack flex={1}>
            <ScreenHeader title="Historico de exercicios"/>
        </VStack>
    );
}