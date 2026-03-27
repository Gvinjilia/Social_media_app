import { useAuth } from "../contexts/AuthContext";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import Signup from "../screens/Signup";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Posts from "../screens/Posts";
import Users from "../screens/Users";
import User from "../screens/User";
import Friends from "../screens/Friends";
import Chat from "../screens/Chat";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const UserPagesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Users' component={Users} options={{ headerShown: false }} />
      <Stack.Screen name='User' component={User} />
    </Stack.Navigator>
  )
};

const FriendsChatNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Friends' component={Friends} options={{ headerShown: false }} />
      <Stack.Screen name='Chat' component={Chat} options={({ route }) => ({ title: `Chat with ${route.params?.name}` })} />
    </Stack.Navigator>
  )
};

const RootNavigation = () => {
  const { user } = useAuth();

  return (
    user ? (
      <Tabs.Navigator>
        <Tabs.Screen name='Posts' component={Posts} />
        <Tabs.Screen name='Users' component={UserPagesNavigator} />
        <Tabs.Screen name='Friends' component={FriendsChatNavigator} />
        <Tabs.Screen name='Profile' component={Profile} />
      </Tabs.Navigator>
    ) : (
      <Stack.Navigator>
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Login' component={Login} />
      </Stack.Navigator>
    )
  );
};

export default RootNavigation;