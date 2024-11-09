import React from 'react'

export function CustomInput({ label, type = 'text', name, value, onChange, options = [], error, ...rest }) {
    return (
        <div className="custom-input">
            <label>
                {label}
                {type === 'select' ? (
                    <select
                        name={name}
                        value={value}
                        onChange={onChange}
                        {...rest}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        {...rest}
                        required
                    />
                )}
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}
