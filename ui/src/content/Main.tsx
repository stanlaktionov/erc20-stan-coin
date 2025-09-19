import { useState } from "react";
import type { FC } from "react";
import { ethers} from 'ethers';
import { TransferToForm } from "../components/transferToForms/TransferToForm";
import { useConnect, useAccount, useDisconnect, useReadContract, useWriteContract } from 'wagmi';
import StanCoin from "./StanCoin.json";
const tokenContractAddress = '0xB9c9a4965991b46068cd56c1fefD6767C8471363';
const {isAddress, parseUnits} = ethers;

export const Main: FC = () => {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const { data: balance } = useReadContract({
        abi: StanCoin.abi,
        address: tokenContractAddress,
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: isConnected && !!address,
        },
    });
    const { writeContract } = useWriteContract()

    const [transferAddress, setTransferAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");

    const handleTransfer = async () => {
        const validAddress = isAddress(transferAddress);

        if (validAddress && balance !== undefined && BigInt(balance as number) >= parseUnits(amount, 18)) {
            writeContract({
                abi: StanCoin.abi,
                address: tokenContractAddress,
                functionName: 'transfer',
                args: [transferAddress, parseUnits(amount, 18)],
            });
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
            {balance !== undefined && <p>{Number(balance as number)} STAN</p>}
            {(isConnected && address) && (balance as number) > 0 && (
                <TransferToForm
                    transferAmount={amount}
                    transferAddress={transferAddress}
                    onAmountChange={setAmount}
                    onTransferAddressChange={setTransferAddress}
                    onSubmit={handleTransfer}
                />
            )}
        </div>
    );
};