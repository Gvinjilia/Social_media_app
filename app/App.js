import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigation from './src/navigators/RootNavigator';
import { PostProvider } from './src/contexts/PostContext';
import { UserProvider } from './src/contexts/UserContext';
import { CommentProvider } from './src/contexts/CommentContext';
import SocketProvider from './src/contexts/SocketContext';
import MessageProvider from './src/contexts/MessageContext';

export default function App(){
  return (
    <NavigationContainer>
      <SocketProvider>
        <AuthProvider>
          <MessageProvider>
            <PostProvider>
              <UserProvider>
                <CommentProvider>
                  <RootNavigation />
                </CommentProvider>
              </UserProvider>
            </PostProvider>
          </MessageProvider>
        </AuthProvider>
      </SocketProvider>
    </NavigationContainer>
  )
};