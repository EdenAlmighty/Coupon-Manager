import React from 'react'

export function CustomInput({ label, type = 'text', name, value, onChange, options = [], error, ...rest }) {
    return (
        <div className="custom-input">
            <label htmlFor={name}>
                {label}
                {type === 'select' ? (
                    <select
                        name={name}
                        id={name}
                        value={value}
                        onChange={(ev) => onChange(name, ev.target.value)}
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
                        required={type !== 'select'}
                    />
                )}
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}
