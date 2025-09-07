import './App.css'
import { useState } from 'react';
import { ethers, JsonRpcSigner } from 'ethers';
import {TransferToForm} from "./components/transferToForms/TransferToForm";

const {BrowserProvider, isAddress, parseUnits} = ethers;
const tokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount)"
];

const tokenContractAddress = '0xB9c9a4965991b46068cd56c1fefD6767C8471363';
const provider = new BrowserProvider(window.ethereum!);


function App() {
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const handleClick = async () => {
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    if (userWalletAddress) {
      window.ethereum.selectedAddress = null;
      setUserWalletAddress(null);
      setSigner(null);
    } else {
      setUserWalletAddress(address);
      setSigner(signer);
    }
  };

  const handleGetBalanceClick = async () => {
    const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
    const balance = await tokenContract.balanceOf(userWalletAddress);
    setBalance(balance.toString());
  };
  

  const handleTransfer = async () => {
    const valid = isAddress(transferAddress);
    if (valid && BigInt(balance ?? 0) > BigInt(amount)) {
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
      await tokenContract.transfer(transferAddress, parseUnits(amount));
      await handleGetBalanceClick();
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
          {userWalletAddress ? `Disconnect Wallet` : "Connect Wallet"}
      </button>
      <p>Connected to {userWalletAddress}</p>
      {userWalletAddress && (
        <button onClick={handleGetBalanceClick}>Get Balance of STAN</button>
      
      )}
      {balance && <p>Balance of STAN: {balance}</p>}
      {userWalletAddress && (balance ?? 0) > 0 && (
        <TransferToForm 
          transferAmount={amount} 
          transferAddress={transferAddress}
          onAmountChange={setAmount}
          onTransferAddressChange={setTransferAddress}
          onSubmit={handleTransfer}
          />
      )}
    </div>
  )
}

export default App
