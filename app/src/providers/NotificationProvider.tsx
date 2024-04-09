import { FC, PropsWithChildren, createContext, useContext, useReducer } from "react";

import { NotificationItem, NotificationItemWithId, Notification } from "@components";

type ContextLayout = {
    notify: (item: NotificationItem) => number,
    removeNotification: (id: number) => void
}

const NotificationContext = createContext<ContextLayout>({
    notify: () => 0,
    removeNotification: (id: number) => undefined
})

export const useNotification = () => useContext(NotificationContext)

type RemoveNotification = {
    action: NotificationAction.Remove,
    id: number
}

type AddNotification = {
    action: NotificationAction.Add,
    item: NotificationItem,
    id: number
}

enum NotificationAction {
    Add = 'add',
    Remove = 'remove'
}

export const NotificationProvider: FC<PropsWithChildren> = ({children}) => {

    const [notifications, manageNotifications] = useReducer((
        notifications: NotificationItemWithId[], manageNotifications: AddNotification | RemoveNotification
    ) => {
        if (manageNotifications.action === 'add') return [...notifications, {...manageNotifications.item, id: manageNotifications.id }]
        else return notifications.filter(n => n.id !== manageNotifications.id)
    }, [])

    const removeNotification = (id: number) => manageNotifications({
        action: NotificationAction.Remove,
        id
    })

    const sendNotification = (item: NotificationItem) => {
        const id = Date.now()
        manageNotifications({
            action: NotificationAction.Add,
            item,
            id
        })
        return id
    }
    

    return (
        <NotificationContext.Provider value={{
            notify: sendNotification,
            removeNotification
        }}>
            <div className='notifications'>
                {notifications.map(n => <Notification {...n} key={n.id} remove={removeNotification}/>)}
            </div>
            {children}
        </NotificationContext.Provider>
    )
}