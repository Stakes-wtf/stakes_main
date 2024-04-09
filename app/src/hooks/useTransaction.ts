import { web3 } from "@coral-xyz/anchor"
import { useNotification } from "@providers"
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"

// import { ModalContext, NotificationContext } from "@contexts"
import { InstructionBuilderResponse } from "@types"
import { NotificationItemStatus } from "../components/notification/Notification"

type TransactionParams = {
    maxComputeUnits?: number,
    computeUnitsPrice?: number
}

export const useTransaction = (
    instructionBuilder: (wallet: AnchorWallet) => Promise<InstructionBuilderResponse>,
    successMessage: string | ((...successMessageArgs: any[]) => string),
    callback?: ((...callbackArgs: any[]) => Promise<void>) | ((...callbackArgs: any[]) => void),
    accessControl?: (...accessArgs: any[]) => boolean,
    txParams?: TransactionParams
) => {

    const wallet = useAnchorWallet()
    const { connection } = useConnection()
    const { notify, removeNotification } = useNotification()

    let waitId: number = 0

    const sendTransaction = async () => {
        try {

            if (!wallet || !connection) return

            if (accessControl && !accessControl()) return

            const { instructions, signers } = await instructionBuilder(wallet)

            const tx = new web3.Transaction()
            if (txParams) {
                if (txParams.maxComputeUnits) {
                    tx.add(web3.ComputeBudgetProgram.setComputeUnitLimit({
                        units: txParams.maxComputeUnits
                    }))
                }
                if (txParams.computeUnitsPrice) {
                    tx.add(web3.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: txParams.computeUnitsPrice
                    }))
                }
            }
            tx.add(...instructions)

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

            tx.recentBlockhash = blockhash
            tx.feePayer = wallet.publicKey
            if (signers.length) {
                tx.sign(...signers)
            }

            const signed = await wallet.signTransaction(tx)

            waitId = notify({
                status: NotificationItemStatus.Reminder,
                header: 'Processing transaction',
                message: 'Sending and confirming transaction. Please stand by...'
            })

            const signature = await connection.sendRawTransaction(signed.serialize())
            console.log('Tx signature: ', signature)
            await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature
            }, 'confirmed')

            removeNotification(waitId)

            notify({
                status: NotificationItemStatus.Success,
                header: 'Congratulations!',
                message: typeof successMessage === "string" ? successMessage : successMessage(),
                link: `https://solscan.io/tx/${signature}?cluster=devnet`,
                linkLabel: 'View on Solscan'
            })

            if (callback) {
                await callback()
            }

            // if (sendNotification) {
            //     sendNotification({
            //         status: NotificationItemStatus.Success,
            //         header: 'Congratulations!',
            //         message: (typeof successMessage === "string") ? successMessage : successMessage(responses),
            //     })
            // }

        } catch (e: any) {

            removeNotification(waitId)

            console.log(e)

            let message: string = 'Oh no, the unknown error occurred!'

            if (e && e.message) switch (e.message) {
                case "User rejected the request.":
                    message = 'Hey dude, you forgot to approve transaction.'
                    break;
            }

            notify({
                status: NotificationItemStatus.Error,
                header: 'Transaction failed',
                message
            })
        }
    }

    return sendTransaction
}