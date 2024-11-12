import * as React from 'react';
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

export default function LoginModal({ open, onClose }) {
  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={style}>
        <Typography id="login-modal-title" variant="h7" component="h1" sx={{ mb: 2 }}>
          Login
        </Typography>
        <form
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
            placeholder="Enter your username" />
          <CustomInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password" />
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
