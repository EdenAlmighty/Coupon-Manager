import React, { useState, useEffect, useRef } from 'react'
import CustomInput from '../CustomInput'
import { userService } from '../../services/user.service'

export default function UserForm({ user = null, onSave }) {
    const [formUser, setFormUser] = useState(user || userService.getDefaultUser())
    const [errors, setErrors] = useState({})
    const usernameRef = useRef(null)

    useEffect(() => {
        usernameRef.current?.focus()
    }, [])

    useEffect(() => {
        setFormUser(user || userService.getDefaultUser())
    }, [user])

    function validateForm(formData) {
        const validationErrors = {}
        if (!formData.username) validationErrors.username = "Username is required."
        if (!formData.fullname) validationErrors.fullname = "Full name is required."
        if (!formData.password) validationErrors.password = "Password is required."
        return validationErrors
    }

    function handleChange({ target }) {
        const { name, value, type, checked } = target
        setFormUser(prevUser => ({
            ...prevUser,
            [name]: type === 'checkbox' ? checked : value
        }))
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        const validationErrors = validateForm(formUser)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        onSave(formUser)
        setFormUser(userService.getDefaultUser())
        setErrors({})
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>{user && user._id ? 'Edit User' : 'Create New User'}</h2>
            <CustomInput
                label="Username"
                type="text"
                name="username"
                placeholder="johndoe"
                value={formUser.username}
                onChange={handleChange}
                error={errors.username}
                ref={usernameRef}
            />
            <CustomInput
                label="Full Name"
                type="text"
                name="fullname"
                placeholder="John Doe"
                value={formUser.fullname}
                onChange={handleChange}
                error={errors.fullname}
            />
            <CustomInput
                label="Password"
                type="password"
                name="password"
                placeholder="********"
                value={formUser.password}
                onChange={handleChange}
                error={errors.password}
            />
            <CustomInput
                label="Admin User?"
                type="checkbox"
                name="isAdmin"
                checked={formUser.isAdmin}
                onChange={handleChange}
            />
            <button className="primary" type="submit">
                {user && user._id ? 'Update User' : 'Create User'}
            </button>
        </form>
    )
}
