import { FC, MouseEventHandler, PropsWithChildren } from "react";
import styles from './styles.module.css'
import { classBuilder } from "@utils";

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
    children,
    disabled,
    onClick
}) => {

    const className = classBuilder(
        styles,
        [{ disabled }],
        styles.button
    )

    return ( 
        <button className={className} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    )
}