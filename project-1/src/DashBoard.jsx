import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid() {
  return (
    <Grid container spacing={2}>
    <Grid item xs={6}>
      <Item>xs=6</Item>
    </Grid>
    <Grid item xs={6}>
      <Item>xs=6</Item>
    </Grid>
  </Grid>
  );
}