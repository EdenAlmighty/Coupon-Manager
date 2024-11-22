import React, { useState } from "react"
import CustomModal from "../components/modals/CustomModal"
import LoginForm from "../components/forms/LoginForm"
import { useNavigate } from "react-router-dom"
import { useUser } from "../hooks/useUser"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export default function Home({ login }) {
    const [isModalOpen, setIsModalOpen] = useState(true)
    const { loggedInUser } = useUser()
    const navigate = useNavigate()

    const handleOpen = () => setIsModalOpen(true)

    const handleClose = () => {
        // Only allow closing the modal if logged in
        if (loggedInUser) {
            setIsModalOpen(false)
        }
    }

    async function handleLogin(userCred) {
        try {
            await login(userCred)
            handleClose()
            navigate("/coupons")
            showSuccessMsg(`Welcome back, ${userCred.username}!`)
        } catch (err) {
            showErrorMsg('Login failed. Please try again.')
            console.error("Login error:", err)
        }
    }

    return (
        <div className="home-content">
            <section className="welcome-section"></section>
            <CustomModal open={isModalOpen} onClose={handleClose}>
                <LoginForm onLogin={handleLogin} />
            </CustomModal>
        </div>
    )
}
