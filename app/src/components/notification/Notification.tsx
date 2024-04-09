import { FC, useEffect, useState } from 'react'
import classes from './styles.module.css'

interface NotificationProps extends NotificationItemWithId {
    remove: (id: number) => void
}

export interface NotificationItemWithId extends NotificationItem {
    id: number
}

export type NotificationItem = {
    status: NotificationItemStatus
    header: string,
    message: string | JSX.Element,
    link?: string,
    linkLabel?: string
}

export enum NotificationItemStatus {
    Success = "success",
    Error = "error",
    Reminder = "reminder",
    Warning = "warning"
}

export const Notification: FC<NotificationProps> = ({id, status, header, message, remove, link, linkLabel}) => {

    const [disappear, setDisappear] = useState<boolean>(false)
    const [expirationTime, setExpirationTime] = useState<number>(100)
    const [intervalID, setIntervalID] = useState<number>(0)

    const startTimer = () => {
        let interval = window.setInterval(() => {
            setExpirationTime(prev => {
                if (prev > 0) return prev - 20

                clearInterval(interval)
                return prev
            })
        }, 1000)

        setIntervalID(interval)
    }

    const pauseTimer = () => {
        clearInterval(intervalID)
    }

    const closeNotification = () => {
        pauseTimer()
        setDisappear(true)
        setTimeout(() => remove(id), 500)
    }

    useEffect(() => {
        if (expirationTime === 0) closeNotification()
    }, [expirationTime])

    useEffect(() => startTimer(), [])

    return (
        <div onMouseEnter={pauseTimer} onMouseLeave={startTimer} className={classes.notification + ' ' + classes[status] + ' ' + (disappear ? classes.disappear : '')}>
            {
                status === 'reminder' ?
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.54 0.5C4.27102 0.5 0 4.77102 0 10.04C0 15.309 4.27102 19.58 9.54 19.58C14.809 19.58 19.08 15.309 19.08 10.04C19.08 4.77102 14.809 0.5 9.54 0.5ZM9.54 4.23304C10.2273 4.23304 10.7843 4.7901 10.7843 5.47739C10.7843 6.16469 10.2273 6.72174 9.54 6.72174C8.85271 6.72174 8.29565 6.16469 8.29565 5.47739C8.29565 4.7901 8.85271 4.23304 9.54 4.23304ZM11.1991 15.4322H10.3696H8.71043H7.88087V14.6026H8.71043V9.21043H7.88087V8.38087H8.71043H10.3696V9.21043V14.6026H11.1991V15.4322Z"/>
                </svg> :
                status === 'success' ?
                <svg viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0004 0.899902C4.69879 0.899902 0.400391 5.1983 0.400391 10.4999C0.400391 15.8015 4.69879 20.0999 10.0004 20.0999C15.302 20.0999 19.6004 15.8015 19.6004 10.4999C19.6004 5.1983 15.302 0.899902 10.0004 0.899902ZM15.366 8.6655L9.31799 14.7135C9.16759 14.8639 8.96439 14.9479 8.75239 14.9479C8.54039 14.9479 8.33639 14.8639 8.18679 14.7135L5.42439 11.9511C5.11159 11.6383 5.11159 11.1327 5.42439 10.8199C5.73719 10.5071 6.24279 10.5071 6.55559 10.8199L8.75239 13.0167L14.2348 7.5343C14.5476 7.2215 15.0532 7.2215 15.366 7.5343C15.6788 7.8471 15.6788 8.3527 15.366 8.6655Z"/>
                </svg> :
                status === 'error' ?
                <svg viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0004 0.899902C4.69879 0.899902 0.400391 5.1983 0.400391 10.4999C0.400391 15.8015 4.69879 20.0999 10.0004 20.0999C15.302 20.0999 19.6004 15.8015 19.6004 10.4999C19.6004 5.1983 15.302 0.899902 10.0004 0.899902ZM10.97 4.8999L10.81 12.0999H9.19079L9.03079 4.8999H10.97ZM10.0028 16.2511C9.34039 16.2511 8.94439 15.8983 8.94439 15.3055C8.94439 14.7015 9.33959 14.3487 10.0028 14.3487C10.6604 14.3487 11.0556 14.7015 11.0556 15.3055C11.0556 15.8983 10.6604 16.2511 10.0028 16.2511Z"/>
                </svg> :
                status === 'warning' ?
                <svg viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.9996 0.899902C10.3344 0.899902 9.76446 1.30528 9.52305 1.88271L0.840234 16.8577V16.8593C0.683531 17.1117 0.600211 17.4028 0.599609 17.6999C0.599609 18.1243 0.76818 18.5312 1.06824 18.8313C1.3683 19.1313 1.77526 19.2999 2.19961 19.2999C2.23715 19.2997 2.27468 19.2981 2.31211 19.2952L2.31523 19.2999H10.9996H19.684L19.6871 19.2937C19.7245 19.2971 19.762 19.2991 19.7996 19.2999C20.224 19.2999 20.6309 19.1313 20.931 18.8313C21.231 18.5312 21.3996 18.1243 21.3996 17.6999C21.3993 17.4023 21.316 17.1106 21.159 16.8577L21.1465 16.8358L21.1449 16.8343L12.4762 1.88271C12.2348 1.30528 11.6649 0.899902 10.9996 0.899902ZM10.0293 7.5874H11.9699L11.809 12.7655H10.1902L10.0293 7.5874ZM11.0027 14.3483C11.6603 14.3483 12.0543 14.7022 12.0543 15.3062C12.0543 15.899 11.6603 16.2515 11.0027 16.2515C10.3403 16.2515 9.94336 15.899 9.94336 15.3062C9.94336 14.7022 10.3395 14.3483 11.0027 14.3483Z"/>
                </svg>
                : null
            }
            <h3>{header}</h3>
            <p>{message}</p>
            {
                link
                ?
                <a href={link} target='_blank'>
                    {linkLabel || 'Link'}
                </a>
                :
                null
            }
            <svg className={classes.close} onClick={() => setExpirationTime(0)} viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L13 13.5M1 13.5L13 1.5"/>
            </svg>
        </div>
    )
}