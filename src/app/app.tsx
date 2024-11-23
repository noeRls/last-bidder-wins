import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClusterProvider } from '../components/cluster/cluster-data-access'
import { SolanaProvider } from '../components/solana/solana-provider'
import { AppRoutes } from './app-routes'
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useRefreshSlot } from '@/redux/slot-hooks';

const client = new QueryClient()

function AppHooks() {
  useRefreshSlot();
  return null;
}

export function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ClusterProvider>
          <SolanaProvider>
            <AppHooks />
            <AppRoutes />
          </SolanaProvider>
        </ClusterProvider>
      </QueryClientProvider>
    </Provider>
  )
}
