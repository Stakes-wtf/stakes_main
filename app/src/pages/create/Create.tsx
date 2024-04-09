import { Button } from "@components";
import { useTransaction } from "@hooks";
import { createCreatePoolInstruction } from "@services";
import { PublicKey } from "@solana/web3.js";
import { FC, useState } from "react";
import styles from './styles.module.css';

export const CreatePage: FC = () => {
    
    const [inputValue, setInputValue] = useState<string>('')

    const execute = useTransaction(
        (w) => createCreatePoolInstruction(w, new PublicKey(inputValue)),
        'Created Pool Successfully',
        () => {
            setInputValue('')
        },
        () => {
            try {
                new PublicKey(inputValue)
                return true
            } catch {
                return false
            }
        },
        {
            computeUnitsPrice: 5_000_000
        }
    )

    return (
        <div className={styles.wrapper}>
            <input
            className={styles.input}
            type={"text"}
            placeholder="Token mint address..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
            <Button disabled={!inputValue} onClick={execute}>
                Create
            </Button>
        </div>
    )
}