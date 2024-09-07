import { darken, lighten, styled, Switch } from '@mui/material';

const FloorSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M15 6H22V9H18V13H14V17H10V21H3V18H7V14H11V10H15V6M10.17 6.66L4.66 12.17L2.83 10.34L8.34 4.83L6.5 3H12V8.5L10.17 6.66Z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
      },
    },
    '&.Mui-disabled': {
      '& + .MuiSwitch-track': {
        opacity: 0.1,
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: lighten(theme.palette.primary.main, 0.62),
        ...theme.applyStyles('dark', {
          backgroundColor: darken(theme.palette.primary.main, 0.55),
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M15 6H22V9H18V13H14V17H10V21H3V18H7V14H11V10H15V6M4.83 8.34L10.34 2.83L12.17 4.66L6.66 10.17L8.5 12H3V6.5L4.83 8.34Z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

export default FloorSwitch;
