import { Box, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { ArrowLeft } from 'mdi-material-ui';
import { useNavigate } from 'react-router-dom';

import { useTime } from '../hooks/useTime';

type SubNavBarProps = {
  children?: React.ReactNode;
  rightElement?: React.ReactNode;
};

function SubNavBar({ children, rightElement }: SubNavBarProps) {
  const navigate = useNavigate();
  const currentTime = useTime();

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: '-1px',
        zIndex: 1001,
        padding: '0.6rem 0',
        marginTop: '-0.6rem',
        backgroundColor: theme.palette.common.secondaryBackground.default,
        color: theme.palette.common.secondaryBackground.text,
        h4: {
          margin: 0,
          fontWeight: 500,
        },
      })}
    >
      <IconButton
        aria-label="back"
        sx={(theme) => ({
          color:
            theme.palette.mode === 'light'
              ? 'primary.main'
              : 'primary.contrast',
        })}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
      </IconButton>
      {children}
      <span
        style={{
          marginLeft: 'auto',
          padding: '0 1em',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span style={{ fontWeight: 500 }}>
          {format(currentTime, 'HH:mm:ss')}
        </span>
        <span>{rightElement}</span>
      </span>
    </Box>
  );
}

export default SubNavBar;
