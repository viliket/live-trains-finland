import { Box, keyframes } from '@mui/material';

import { ReactComponent as HeroBackground } from '../hero.svg';

const trainAnimKeyFrames = keyframes`
  0% {
    transform: translate(-900px, 80px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(900px, -80px);
  }
`;

const person2AnimKeyframes = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  10% {
    transform: translate(0px, 0px);
  }
  30% {
    transform: translate(0px, 16px);
    opacity: 1;
  }
  31% {
    opacity: 0;
  }
  75% {
    transform: translate(0px, 16px);
    opacity: 0;
  }
  76% {
    opacity: 1;
  }
  100% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
`;

const person1AnimKeyframes = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  10% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(0px, -16px);
    opacity: 1;
  }
  26% {
    opacity: 0;
  }
  74% {
    transform: translate(0px, -16px);
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
`;

const getAnimKeyframesForTrainDoors = (doorLocation: 'right' | 'left') => {
  const offset = doorLocation === 'right' ? 5 : -5;
  return keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  40% {
    transform: translate(0px, 0px);
  }
  45% {
    transform: translate(${offset}px, 0px);
  }
  50% {
    transform: translate(${offset}px, 0px);
  }
  55% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(0px, 0px);
  }
`;
};

const animDuration = 30;

const Hero = () => {
  return (
    <Box
      sx={{
        svg: {
          width: '100%',
          height: 'auto',
          maxHeight: '140px',
        },
        '#Train1': {
          animation: `${trainAnimKeyFrames} ${
            animDuration / 2
          }s infinite ease-in-out`,
          animationDelay: `-${animDuration / 4}s`,
          animationDirection: 'reverse',
        },
        '#Train2': {
          animation: `${trainAnimKeyFrames} ${
            animDuration / 2
          }s infinite ease-in-out`,
          animationDelay: '0s',
        },
        '#Person2': {
          animation: `${person2AnimKeyframes} ${animDuration}s infinite ease-in-out`,
          animationDelay: `-${animDuration / 4}s`,
        },
        '#Person': {
          animation: `${person1AnimKeyframes} ${animDuration}s infinite ease-in-out`,
          animationDelay: '0s',
        },
        '#Train2 g[id*="Doors"]': {
          'g:nth-of-type(1)': {
            animation: `${getAnimKeyframesForTrainDoors('left')} ${
              animDuration / 2
            }s infinite ease-in-out`,
          },
          'g:nth-of-type(2)': {
            animation: `${getAnimKeyframesForTrainDoors('right')} ${
              animDuration / 2
            }s infinite ease-in-out`,
          },
        },
        '#Track1 rect': {
          transform: 'rotate(-5deg) translate(0, 22px)',
          width: '180vw',
          x: 'calc(50% - 90vw)',
        },
        '#Track2 rect': {
          transform: 'rotate(-5deg) translate(0, -1px)',
          width: '180vw',
          x: 'calc(50% - 90vw)',
        },
      }}
    >
      <HeroBackground />
    </Box>
  );
};

export default Hero;
