import React from 'react'

export function CustomInput({ label, type = 'text', name, value, onChange, options = [], ...rest }) {
    return (
        <div className="custom-input">
            <label>
                {label}
                {type === 'select' ? (
                    <select name={name} value={value} onChange={onChange} {...rest}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input type={type} name={name} value={value} onChange={onChange} {...rest} />
                )}
            </label>
        </div>
    )
}
