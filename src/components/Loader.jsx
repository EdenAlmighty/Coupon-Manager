import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export function Loader() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
        </Box>
    )
}