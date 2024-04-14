import { MutableRefObject, useEffect } from "react"

export const useOutsideClick = (callback: () => void, allowedRefs: MutableRefObject<any>[]) => {

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (allowedRefs?.some(r => r.current?.contains(e.target))) return
            callback()
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

}