import { Navigation } from '@elements'
import { StakingPage, VestingPage, CreatePage } from '@pages'
import { FC, PropsWithChildren, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

type PageWrapperProps = {}

const PageWrapper: FC<PropsWithChildren<PageWrapperProps>> = ({children}) => {
    return (
        <>
        <Navigation/>
        <section className={'content'}>
            {children}
        </section>
        </>
    )
}

const AppRouter: FC = () => {
    
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            left: 0,
            top: 0
        })
    }, [pathname])

    return (
    <>
      <section className='page'>
        <Routes>
            <Route path='*' element={<PageWrapper><StakingPage/></PageWrapper>}/>
            <Route path='vesting' element={<PageWrapper><VestingPage/></PageWrapper>}/>
            <Route path='create' element={<PageWrapper><CreatePage/></PageWrapper>}/>
        </Routes>
      </section>
    </>
    )
}

export default AppRouter