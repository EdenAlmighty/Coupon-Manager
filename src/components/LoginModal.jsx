import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CustomInput } from './CustomInput';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#31363F',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '4px',
};

export default function LoginModal({ open, onClose, onLogin }) {
  const [userCred, setUserCred] = useState({ username: '', password: '' })

  function handleChange({ target: { name, value } }) {
    setUserCred(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    onLogin(userCred)
  }

  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={style}>
        <Typography id="login-modal-title" variant="h4" component="h1" sx={{ mb: 2 }}>
          Login
        </Typography>
        <form
          onSubmit={handleSubmit}
          className='login-form'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }} >
          <CustomInput
            label="Username"
            type="text"
            name="username"
            value={userCred.username}
            placeholder="Enter your username"
            onChange={(ev) => handleChange(ev)}
          />
          <CustomInput
            label="Password"
            type="password"
            name="password"
            value={userCred.password}
            placeholder="Enter your password"
            onChange={(ev) => handleChange(ev)}
          />
          <div>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  )
}
