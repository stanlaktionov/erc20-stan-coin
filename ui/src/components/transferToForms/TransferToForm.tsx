import type { FC } from "react"

interface Props {
    transferAddress: string;
    transferAmount: string;
    onTransferAddressChange: (value: string) => void;
    onAmountChange: (value: string) => void;
    onSubmit: () => void;
}

export const TransferToForm: FC<Props> = (props: Props) => {
    const {transferAddress, transferAmount, onTransferAddressChange, onAmountChange, onSubmit} = props;
    const handleAddressChange = (e: any) => {
        onTransferAddressChange(e.target.value);
    };
    const handleAmountChange = (e: any) => {
        onAmountChange(e.target.value);
    };
    return (
        <div>
            <label htmlFor="address">
                Transfer to address:
                <input id='address' value={transferAddress} type='text' onChange={handleAddressChange}/>  
            </label>
            <label htmlFor="amount">
                Amount:
                <input id='amount' value={transferAmount} type='text' onChange={handleAmountChange}/>  
            </label>
            <button onClick={onSubmit}>Transfer</button>
        </div>
    )
};