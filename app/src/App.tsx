import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@styles';
import '@solana/wallet-adapter-react-ui/styles.css'
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { endpointUrl } from '@constants';
import { NotificationProvider } from '@providers';

function App() {

  return (
    <BrowserRouter>
      <ConnectionProvider endpoint={endpointUrl}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <NotificationProvider>
              <AppRouter/>
            </NotificationProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  )
}

export default App
