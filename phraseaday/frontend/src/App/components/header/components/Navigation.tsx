import React from 'react'
import styled from 'styled-components'

import { Button, colors, StyledNavLink } from 'sharedComponents'
import { context } from '../..'
import { TPhraseADayUser } from '../../../../types'

const StyledNav = styled.ul`
    position: absolute;
    width: 300px;
    border-radius: 1rem;
    right: 0;
    display: ${({ showNav }: { showNav: boolean }) => (showNav ? 'block' : 'none')};
    list-style: none;
    flex-direction: row;
    padding: 0.5rem;
    background-color: ${colors.PRIMARY.lightest};
    border: 2px solid rgb(87, 226, 229);
    margin: 0.5rem;
    z-index:998;

    li {
        padding: 10px;
    }
`

const ALWAYS_VISIBLE_LINKS = [
    { text: 'Home', to: '/' },
]

const loggedInLinks = (user: TPhraseADayUser) => ([
    { text: 'Student Dashboard', to: '/student/dashboard' },
    { text: 'Reviewer Dashboard', to: '/reviewer/dashboard' },
    { text: `${user.username} Profile`, to: `/profile/${user.id}` },
    { text: 'Reviewers', to: '/reviewers' },
    { text: 'Log Out', to: '/logout' },
])

const LOGGED_OUT_VISIBLE_LINKS = [
    { text: 'Log In', to: '/login' },
    { text: 'Sign Up', to: '/signup' },
]

const Navigation = () => {
    const { state } = React.useContext(context)
    const [showNav, setShowNav] = React.useState<boolean>(false)

    const links = [
        ...ALWAYS_VISIBLE_LINKS,
        ...(state.currentUser ? loggedInLinks(state.currentUser.phraseADay) : LOGGED_OUT_VISIBLE_LINKS),
    ]

    const handleClose = () => setShowNav(false)

    React.useEffect(() => {
        if (showNav) {
            window.addEventListener('click', handleClose)
        }
        return () => window.removeEventListener('click', handleClose)
    }, [showNav])

    return (
        <div style={{ position: 'relative' }}>
            <Button variation="primary" onClick={() => setShowNav(!showNav)}>Menu</Button>
            <StyledNav showNav={showNav}>
                {links.map(({ text, to }) => (
                    <li key={to} onClick={() => setShowNav(false)}> {/* eslint-disable-line */}
                        <StyledNavLink addWeightForActiveLink to={to} text={text} />
                    </li>
                ))}
            </StyledNav>
        </div>
    )
}
export default Navigation
