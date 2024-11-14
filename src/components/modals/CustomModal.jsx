import React, { useEffect, useState } from 'react'

export default function CustomModal({ open, onClose, children }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (open) {
            const timeoutId = setTimeout(() => setIsVisible(true), 100)
            return () => clearTimeout(timeoutId)
        } else {
            const timeoutId = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timeoutId)
        }
    }, [open])

    if (!isVisible && !open) return null

    return (
        <>
            <div className={`modal-overlay ${open ? 'modal-visible' : ''}`} onClick={onClose}></div>
            <div className={`modal-container ${open ? 'modal-active' : ''}`}>
                <div className="modal-content">
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                    {children}
                </div>
            </div>
        </>
    )
}
