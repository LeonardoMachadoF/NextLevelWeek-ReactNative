import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme, useTheme } from 'native-base';
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { New } from '../screens/New';
import { Platform } from 'react-native';
import { Pools } from '../screens/Pools';
import { Find } from '../screens/Find';
import { Details } from '../screens/Details';

const { Navigator, Screen } = createBottomTabNavigator();

export const AppRoutes = () => {
    const { colors, sizes } = useTheme();
    return (
        <Navigator screenOptions={{
            headerShown: false,
            tabBarLabelPosition: 'beside-icon',
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0
            }
        }}>
            <Screen
                name='new'
                component={New}
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={sizes[6]} />,
                    tabBarLabel: 'Novo bolão'
                }}
            />
            <Screen
                name='pools'
                component={Pools}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={sizes[6]} />,
                    tabBarLabel: 'Meus bolões'
                }}
            />
            <Screen
                name='find'
                component={Find}
                options={{
                    tabBarButton: () => null
                }}
            />
            <Screen
                name='details'
                component={Details}
                options={{
                    tabBarButton: () => null
                }}
            />
        </Navigator>
    )
}