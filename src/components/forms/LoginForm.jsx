import React, { useState, useEffect, useRef } from "react"
import CustomInput from "../CustomInput"

export default function LoginForm({ onLogin }) {
    const [userCred, setUserCred] = useState({ username: '', password: '' })
    const [errors, setErrors] = useState({})
    const usernameRef = useRef(null)

    useEffect(() => {
        // Focus on username input onMount
        usernameRef.current?.focus()
    }, [])

    function handleChange({ target }) {
        const { name, value } = target
        setUserCred(prevUserCred => ({
            ...prevUserCred,
            [name]: value,
        }))
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        const validationErrors = {}
        if (!userCred.username) validationErrors.username = "Username is required."
        if (!userCred.password) validationErrors.password = "Password is required."
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        onLogin(userCred)
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <p>Login to continue:</p>
            <CustomInput
                label="Username:"
                type="text"
                name="username"
                value={userCred.username}
                placeholder="Username or 'admin'"
                onChange={handleChange}
                error={errors.username}
                ref={usernameRef}
            />
            <CustomInput
                label="Password:"
                type="password"
                name="password"
                value={userCred.password}
                placeholder="Password or '123'"
                onChange={handleChange}
                error={errors.password}
            />
            <button type="submit">Login</button>
        </form>
    )
}
