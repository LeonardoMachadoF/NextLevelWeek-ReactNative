import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
    poolId: string;
    code: string;
}

export function Guesses({ poolId, code }: Props) {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [firstTeamPoints, setFristTeamPoints] = useState('');
    const [secondTeamPoints, setSecondTeamPoints] = useState('');
    const [games, setGames] = useState<GameProps[]>([]);

    const fetchGames = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${poolId}/games`);
            setGames(response.data.games);
        } catch (err) {
            console.log(err);
            toast.show({
                title: 'Ops, ocorreu algum erro.',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    const handleGuessConfirm = async (gameId: string) => {
        try {
            if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
                return toast.show({
                    title: 'Informe o placar do palpite.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
            console.log(firstTeamPoints, secondTeamPoints)
            await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
                firstTeamPoints: Number(firstTeamPoints),
                secondTeamPoints: Number(secondTeamPoints)
            });

            toast.show({
                title: 'Palpite realizado com sucesso!.',
                placement: 'top',
                bgColor: 'green.500'
            })

            fetchGames()
        } catch (err) {
            console.log(err);
            toast.show({
                title: 'Ops,não foi possivel enviar o palpite.',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGames();
    }, [poolId])

    if (isLoading) {
        return <Loading />
    }
    return (

        <FlatList
            data={games}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Game
                    data={item}
                    setFirstTeamPoints={setFristTeamPoints}
                    setSecondTeamPoints={setSecondTeamPoints}
                    onGuessConfirm={() => handleGuessConfirm(item.id)}
                />
            )}
            ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
        />

    );
}
