import React from 'react'

export function CustomInput({ label, type = 'text', name, value, onChange, options = [], error, ...rest }) {
    return (
        <div className="custom-input">
            <label htmlFor={name} className={name}>
                {label}
                {type === 'select' ? (
                    <select
                        className={error ? 'error' : ''}
                        name={name}
                        id={name}
                        value={value}
                        onChange={(ev) => onChange(ev)}
                        {...rest}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className={error ? 'error' : ''}
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        {...rest}
                        required={type !== 'select' && type !== 'checkbox'}
                    />
                )}
                {error && <p className="error-message">{error}</p>}
            </label>
        </div>
    )
}
