import { useState } from "react";
import type { FC } from "react";
import { ethers, JsonRpcSigner } from 'ethers';
import { TransferToForm } from "../components/transferToForms/TransferToForm";
import { useConnect, useAccount, useDisconnect, useBalance, useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const tokenContractAddress = '0xB9c9a4965991b46068cd56c1fefD6767C8471363';
const tokenAbi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount)"
];
const { BrowserProvider, isAddress, parseUnits } = ethers;
//@ts-ignore
const provider = new BrowserProvider(window.ethereum!);

export const Main: FC = () => {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const { data, ...rest } = useBalance({ address: tokenContractAddress, chainId: sepolia.id });
    console.log(data, rest);
    const [signer] = useState<JsonRpcSigner | null>(null);
    const [balance] = useState<number | null>(null);
    const [transferAddress, setTransferAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const handleTransfer = async () => {
        const valid = isAddress(transferAddress);
        if (valid && BigInt(balance ?? 0) > BigInt(amount)) {
            const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
            await tokenContract.transfer(transferAddress, parseUnits(amount));
        }
    };
    return (
        <div>
            {
                connectors.map((connector) => {
                    const handleClick = () => {
                        if (!isConnected) {
                            connect({ connector });
                        } else {
                            disconnect();
                        }
                    };
                    return (
                        <button onClick={handleClick}>
                            {isConnected ? `Disconnect Wallet` : "Connect Wallet"}
                        </button>
                    );
                })
            }

            {isConnected && (<p>Connected to {address}</p>)}
            {data && <p>{Number(data.value)} {data.symbol}</p>}
            {(isConnected && address) && (balance ?? 0) > 0 && (
                <TransferToForm
                    transferAmount={amount}
                    transferAddress={address}
                    onAmountChange={setAmount}
                    onTransferAddressChange={setTransferAddress}
                    onSubmit={handleTransfer}
                />
            )}
        </div>
    );
};