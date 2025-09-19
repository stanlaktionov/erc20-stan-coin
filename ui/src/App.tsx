import './App.css'
import { config } from './wagmi.config';
import { WagmiProvider } from 'wagmi';
import { Main } from './content/Main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Main/>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
