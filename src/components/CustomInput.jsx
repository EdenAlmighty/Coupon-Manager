import React, { forwardRef } from 'react'

const CustomInputComponent = ({ label, type = 'text', name, value, onChange, options = [], error, ...rest }, ref) => (
    <div className="custom-input">
        <label htmlFor={name} className={name}>
            {label}
            {type === 'select' ? (
                <select
                    className={error ? 'error' : ''}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    {...rest}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    ref={ref}
                    className={error ? 'error' : ''}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    {...rest}
                />
            )}
            {error && <p className="error-message">{error}</p>}
        </label>
    </div>
)

const CustomInput = forwardRef(CustomInputComponent)
export default CustomInput
