// types/wallet.ts
interface Token {
  symbol: keyof typeof TokenIcons;
  balance: number;
  value: number;
}

interface Wallet {
  id: number;
  name: string;
  address: string;
  network: Network;
  balance: number;
  tokens: Token[];
}

interface NewWallet {
  name: string;
  address: string;
  network: Network;
}

type Network = 'Ethereum' | 'BNB Chain' | 'Polygon' | 'Arbitrum' | 'Optimism' | 'Avalanche';

// components/CryptoWalletDashboard.tsx
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

const TokenIcons = {
  ETH: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 12L12 16L20 12L12 2Z" fill="#8A92B2"/>
      <path d="M4 12L12 22L20 12L12 16L4 12Z" fill="#62698F"/>
      <path d="M12 2L4 12L12 16V2Z" fill="#454A75"/>
      <path d="M12 2L20 12L12 16V2Z" fill="#8A92B2"/>
    </svg>
  ),
  BNB: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L7 7L9 9L12 6L15 9L17 7L12 2Z" fill="#F3BA2F"/>
      <path d="M17 12L19 10L17 8L15 10L17 12Z" fill="#F3BA2F"/>
      <path d="M7 12L9 10L7 8L5 10L7 12Z" fill="#F3BA2F"/>
      <path d="M12 22L17 17L15 15L12 18L9 15L7 17L12 22Z" fill="#F3BA2F"/>
      <path d="M12 14L14 12L12 10L10 12L12 14Z" fill="#F3BA2F"/>
    </svg>
  ),
  USDT: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#26A17B"/>
      <path d="M13 7.5V6H17V4H7V6H11V7.5C8 7.8 6 8.6 6 9.5C6 10.4 8 11.2 11 11.5V17H13V11.5C16 11.2 18 10.4 18 9.5C18 8.6 16 7.8 13 7.5ZM13 10.8V8.2C15.2 8.4 16.5 8.9 16.5 9.5C16.5 10.1 15.2 10.6 13 10.8ZM11 8.2V10.8C8.8 10.6 7.5 10.1 7.5 9.5C7.5 8.9 8.8 8.4 11 8.2Z" fill="white"/>
    </svg>
  ),
  BUSD: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#F0B90B"/>
      <path d="M12 5L14.5 7.5L9.5 12.5L7 10L12 5Z" fill="white"/>
      <path d="M14.5 12.5L12 15L9.5 12.5L12 10L14.5 12.5Z" fill="white"/>
      <path d="M14.5 7.5L17 10L12 15L9.5 12.5L14.5 7.5Z" fill="white"/>
    </svg>
  )
};

interface TokenRowProps {
  token: Token;
}

const TokenRow: React.FC<TokenRowProps> = ({ token }) => {
  const Icon = TokenIcons[token.symbol];
  return (
    <div className="flex justify-between items-center py-2 px-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon />}
        <span className="text-zinc-300">{token.symbol}</span>
      </div>
      <div className="text-right">
        <p className="text-zinc-200">{token.balance.toFixed(4)}</p>
        <p className="text-sm text-zinc-400">${token.value.toFixed(2)}</p>
      </div>
    </div>
  );
};

const NETWORKS: Network[] = [
  'Ethereum',
  'BNB Chain',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Avalanche'
];

const INITIAL_WALLETS: Wallet[] = [
  { 
    id: 1, 
    name: 'Main ETH Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    network: 'Ethereum',
    balance: 1.45,
    tokens: [
      { symbol: 'ETH', balance: 1.45, value: 3245.00 },
      { symbol: 'USDT', balance: 500, value: 500.00 }
    ]
  },
  { 
    id: 2, 
    name: 'BSC Trading',
    address: '0x934d35Cc6634C0532925a3b844Bc454e4438f123',
    network: 'BNB Chain',
    balance: 2.3,
    tokens: [
      { symbol: 'BNB', balance: 2.3, value: 598.00 },
      { symbol: 'BUSD', balance: 1000, value: 1000.00 }
    ]
  }
];

export default function App(): JSX.Element {
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newWallet, setNewWallet] = useState<NewWallet>({
    name: '',
    address: '',
    network: 'Ethereum'
  });

  const addWallet = (e: React.FormEvent): void => {
    e.preventDefault();
    setWallets([...wallets, {
      id: wallets.length + 1,
      ...newWallet,
      balance: 0,
      tokens: []
    }]);
    setNewWallet({ name: '', address: '', network: 'Ethereum' });
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewWallet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const deleteWallet = (id: number): void => {
    setWallets(prevWallets => prevWallets.filter(wallet => wallet.id !== id));
  };

  const totalValue = wallets.reduce((sum, wallet) => 
    sum + wallet.tokens.reduce((tokenSum, token) => tokenSum + token.value, 0)
  , 0);

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">Manage Wallets</h1>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-yellow-500 text-zinc-900 px-4 py-2 rounded hover:bg-yellow-400 transition-colors"
          >
            Connect Wallet
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-500/20">
            <h3 className="text-zinc-400 text-sm">Portfolio Value</h3>
            <p className="text-2xl font-bold text-yellow-400">
              ${totalValue.toFixed(2)}
            </p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-500/20">
            <h3 className="text-zinc-400 text-sm">Active Wallets</h3>
            <p className="text-2xl font-bold text-yellow-400">{wallets.length}</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg border border-yellow-500/20">
            <h3 className="text-zinc-400 text-sm">Networks</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {new Set(wallets.map(w => w.network)).size}
            </p>
          </div>
        </div>

        {/* Add Wallet Dialog */}
        <Dialog 
          open={isOpen} 
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-zinc-800 p-6 rounded-lg w-full max-w-md border border-yellow-500/20">
              <DialogTitle className="text-xl font-bold text-yellow-400 mb-4">
                Connect New Wallet
              </DialogTitle>

              <form onSubmit={addWallet}>
                <div className="mb-4">
                  <label className="block text-zinc-300 text-sm font-bold mb-2">
                    Wallet Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newWallet.name}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-zinc-700 border border-yellow-500/20 text-zinc-200 focus:border-yellow-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-zinc-300 text-sm font-bold mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={newWallet.address}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-zinc-700 border border-yellow-500/20 text-zinc-200 focus:border-yellow-500 focus:outline-none font-mono text-sm"
                    placeholder="0x..."
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-zinc-300 text-sm font-bold mb-2">
                    Network
                  </label>
                  <select
                    name="network"
                    value={newWallet.network}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-zinc-700 border border-yellow-500/20 text-zinc-200 focus:border-yellow-500 focus:outline-none"
                  >
                    {NETWORKS.map(network => (
                      <option key={network} value={network}>{network}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-zinc-900 px-4 py-2 rounded hover:bg-yellow-400 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {wallets.map(wallet => (
            <div key={wallet.id} className="bg-zinc-800 p-4 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-zinc-200">{wallet.name}</h3>
                  <p className="text-sm text-zinc-400">
                    Network: <span className="text-yellow-400">{wallet.network}</span>
                  </p>
                </div>
                <button
                  onClick={() => deleteWallet(wallet.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-zinc-400 font-mono break-all">
                  {wallet.address}
                </p>
              </div>

              <div className="divide-y divide-zinc-700">
                {wallet.tokens.map((token, index) => (
                  <TokenRow key={index} token={token} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}