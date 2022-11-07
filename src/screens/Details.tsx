import { useRoute } from "@react-navigation/native"
import { HStack, useToast, VStack } from "native-base"
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header"
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
    id: string;
}

export const Details = () => {
    const route = useRoute();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [poolsDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
    const [selectedOption, setSelectedOption] = useState<'Seus palpites' | 'Ranking do grupo'>('Seus palpites');
    const { id } = route.params as RouteParams;

    const fetchPoolDetails = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);

            setPoolDetails(response.data.pool)
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

    const handleCodeShare = async () => {
        await Share.share({
            message: poolsDetails.code
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isLoading) return <Loading />;

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title={poolsDetails.title} showBackButton showShareButton onShare={handleCodeShare} />
            {poolsDetails._count?.participants > 0 ?

                <VStack px={5} flex={1}>
                    <PoolHeader data={poolsDetails} />
                    <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                        <Option
                            title="Seus palpites"
                            isSelected={selectedOption === 'Seus palpites'}
                            onPress={() => setSelectedOption('Seus palpites')}
                        />
                        <Option
                            title="Ranking do grupo"
                            isSelected={selectedOption === 'Ranking do grupo'}
                            onPress={() => setSelectedOption('Ranking do grupo')}
                        />
                    </HStack>
                </VStack>

                : <EmptyMyPoolList code={poolsDetails.code} />
            }

            <Guesses poolId={poolsDetails.id} code={poolsDetails.code} />
        </VStack>
    )
}