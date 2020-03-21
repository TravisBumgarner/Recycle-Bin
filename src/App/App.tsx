import React from 'react'
import styled from 'styled-components'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import {
    Title,
    Home,
    Error,
    ScrollToTop,
} from './components'
import { GlobalStyle } from 'theme'


const AppWrapper = styled.div`
    max-width: 1200px;
    margin: 2em auto;
`

const App = () => {
    return (
        <AppWrapper>
            <GlobalStyle />
            <BrowserRouter>
                <ScrollToTop />
                <Title />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route component={Error} />
                </Switch>
            </BrowserRouter>
        </AppWrapper>
    )
}

export default App