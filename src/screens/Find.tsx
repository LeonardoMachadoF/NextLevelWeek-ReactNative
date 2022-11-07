import { Heading, Text, useToast, VStack } from "native-base"
import { Header } from "../components/Header"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { useState } from "react"
import { api } from "../services/api"
import { useNavigation } from "@react-navigation/native"

export const Find = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('')
    const toast = useToast();
    const { navigate } = useNavigation()

    const handleJoinPool = async () => {
        try {
            setIsLoading(true)

            if (!code.trim()) {
                return toast.show({
                    title: 'Informe um código',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            await api.post('/pools/join', { code: code.toUpperCase() });
            toast.show({
                title: 'Sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            })

            setIsLoading(false);
            navigate('pools');
        } catch (err) {
            console.log(err);
            setIsLoading(false);

            if (err.response?.data?.message === 'Pool not found.') {
                return toast.show({
                    title: 'Bolão não encontrado!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
            if (err.response?.data?.message === 'You have already joined this pool.') {
                return toast.show({
                    title: 'Você já esta nesse bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

        }
    }
    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title='Buscar por codigo' showBackButton />
            <VStack mt={8} mx={5} alignItems='center'>

                <Heading fontFamily='heading' color='white' fontSize='xl' mb={8} textAlign='center'>
                    Encontre um bolão através de {'\n'} seu código único.
                </Heading>

                <Input mb={2} placeholder='Qual o titúlo do bolão?' value={code} onChangeText={setCode} autoCapitalize='characters' />
                <Button title="BUSCAR O BOLÃO" isLoading={isLoading} onPress={handleJoinPool} />
            </VStack>
        </VStack>
    )
}