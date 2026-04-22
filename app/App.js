import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigation from './src/navigators/RootNavigator';
import { PostProvider } from './src/contexts/PostContext';
import { UserProvider } from './src/contexts/UserContext';
import { CommentProvider } from './src/contexts/CommentContext';
import SocketProvider from './src/contexts/SocketContext';
import MessageProvider from './src/contexts/MessageContext';
import { useEffect } from 'react';
import UpdatesDemo from './src/utils/UpdatesDemo';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4bc3f260c24c6405705c10a8fd4e6d74@o4511157229191169.ingest.us.sentry.io/4511157238038528',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
  // useEffect(() => {
  //   UpdatesDemo();
  // }, []);

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
});;