import * as React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import { Button, Input } from 'SharedComponents'

const Login = ({ isAuthenticated, setIsAuthenticated }) => {
    if (isAuthenticated) {
        return <Redirect to="/" />
    }

    const [email, setEmail] = React.useState<any>('') //TODO: Fix this.
    const [password, setPassword] = React.useState<any>('') //TODO: Fix this.

    const handleSubmit = () => {
        axios
            .post(`${__API__}/login`, {
                password,
                email
            })
            .then(response => {
                if (response.data.success) {
                    sessionStorage.setItem('jwtToken', response.data.token)
                    setIsAuthenticated(true)
                    setEmail('')
                    setPassword('')
                } else {
                    console.log('something went wrong with login')
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div>
            Email:
            <Input type="email" onChange={setEmail} value={email} />
            Password:
            <Input type="password" onChange={setPassword} value={password} />
            <Button onClick={handleSubmit}>Login</Button>
        </div>
    )
}

export default Login
