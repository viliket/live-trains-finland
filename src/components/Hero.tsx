import { Box, keyframes } from '@mui/material';
import { range } from 'lodash';

import HeroBackground from '../assets/hero.svg';

const trainAnimKeyFrames = keyframes`
  0% {
    transform: translate(-900px, 80px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  60% {
    transform: translate(0px, 0px);
  }
  100% {
    transform: translate(900px, -80px);
  }
`;

const person1AnimKeyframes = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  18% {
    transform: translate(0px, 0px);
  }
  28% {
    transform: translate(0px, -17px);
    opacity: 1;
  }
  28.3% {
    opacity: 1;
  }
  28.6% {
    opacity: 0;
  }
  74.5% {
    transform: translate(0px, -17px);
    opacity: 0;
  }
  74.6% {
    opacity: 1;
  }
  100% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
`;

const person2AnimKeyframes = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  18% {
    transform: translate(0px, 0px);
  }
  28% {
    transform: translate(0px, 18px);
    opacity: 1;
  }
  28.1% {
    opacity: 0;
  }
  74.5% {
    transform: translate(0px, 16px);
    opacity: 0;
  }
  74.6% {
    opacity: 1;
  }
  100% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
`;

const person3AnimKeyframes = keyframes`
  0% {
    transform: translate(-10px, 0px);
  }
  26% {
    transform: translate(-10px, 0px);
  }
  36% {
    transform: translate(58px, -10px);
  }
  38% {
    transform: translate(58px, -10px);
  }
  38.9% {
    transform: translate(58px, -10px) scaleX(-1);
  }
  70% {
    transform: translate(-10px, 0px) scaleX(-1);
  }
  100% {
    transform: translate(-10px, 0px);
  }
`;

const person3HeadAnimKeyframes = keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  36% {
    transform: translate(0px, 0px);
  }
  38% {
    transform: translate(2px, 1px);
  }
  100% {
    transform: translate(2px, 1px);
  }
`;

const getPerson3LimbAnimKeyframes = (
  limb: 'leg_right' | 'leg_left' | 'arm_right'
) => {
  let rotation: number;
  if (limb === 'leg_right') {
    rotation = 46;
  } else if (limb === 'leg_left') {
    rotation = -36;
  } else {
    rotation = -16;
  }

  return keyframes`
  0% {
    transform: rotate(0deg);
  }
  ${range(26, 36).map((frame) => {
    return `${frame}% {
      transform: rotate(${frame % 2 === 0 ? 0 : rotation}deg);
    }`;
  })}
  ${range(38, 70, 2).map((frame, i) => {
    return `${frame}% {
      transform: rotate(${i % 2 === 0 ? 0 : rotation}deg);
    }`;
  })}
  100% {
    transform: rotate(${rotation}deg);
  }
`;
};

const getPerson1And2LegAnimKeyframes = (person: 'person1' | 'person2') => {
  return keyframes`
0% {
  transform: skewY(0deg) translateY(0px);
}
17% {
  transform: skewY(0deg) translateY(0px);
}
${range(18.5, 25, 1.5).map((frame, i) => {
  const skewY = i % 2 === 0 ? 15 : -15;
  return `${frame}% {
    transform: skewY(${skewY}deg);
  }`;
})}
26% {
  transform: skewY(0deg) translateY(0px);
}
74% {
  transform: skewY(0deg) translateY(0px);
}
${range(75, 96, 1.5).map((frame, i) => {
  const skewY = i % 2 === 0 ? 15 : -15;
  return `${frame}% {
    transform: skewY(${skewY}deg);
  }`;
})}
100% {
  transform: skewY(0deg);
}
`;
};

const getAnimKeyframesForTrainDoors = (doorLocation: 'right' | 'left') => {
  const offset = doorLocation === 'right' ? 5 : -5;
  return keyframes`
  0% {
    transform: translate(0px, 0px);
  }
  45% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(${offset}px, 0px);
  }
  60% {
    transform: translate(${offset}px, 0px);
  }
  65% {
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
        '#Person3': {
          animation: `${person3AnimKeyframes} ${animDuration}s infinite ease-in-out`,
          animationDelay: `0s`,
          // Note: We cannot use transform-box: fill-box here because Firefox has
          // a bug with nested fill-boxes that causes odd behavior with animations.
          // See https://bugzilla.mozilla.org/show_bug.cgi?id=1612347
          transformOrigin: '109px', // #Person3 X coordinate in the original SVG viewBox.
        },
        '#Person3 #Leg_right': {
          animation: `${getPerson3LimbAnimKeyframes(
            'leg_right'
          )} ${animDuration}s infinite ease-in-out`,
          animationDelay: `0s`,
          transform: 'rotate(46deg)',
          transformOrigin: '2px 0px',
          transformBox: 'fill-box',
        },
        '#Person3 #Leg_left': {
          animation: `${getPerson3LimbAnimKeyframes(
            'leg_left'
          )} ${animDuration}s infinite ease-in-out`,
          animationDelay: `0s`,
          transform: 'rotate(-36deg)',
          transformOrigin: '2px 0px',
          transformBox: 'fill-box',
        },
        '#Person3 #Arm_right': {
          animation: `${getPerson3LimbAnimKeyframes(
            'arm_right'
          )} ${animDuration}s infinite ease-in-out`,
          animationDelay: `0s`,
          transform: 'rotate(-36deg)',
          transformOrigin: '0px 0px',
          transformBox: 'fill-box',
        },
        '#Person3 #Head': {
          animation: `${person3HeadAnimKeyframes} ${animDuration}s infinite ease-in-out`,
          animationDelay: `0s`,
          transformOrigin: '0px 0px',
          transformBox: 'fill-box',
        },
        '#Person2': {
          animation: `${person2AnimKeyframes} ${animDuration}s infinite ease-in-out`,
          animationDelay: `-${animDuration / 4}s`,
        },
        '#Person2 #Legs': {
          animation: `${getPerson1And2LegAnimKeyframes(
            'person2'
          )} ${animDuration}s infinite ease-in-out`,
          animationDelay: `-${animDuration / 4}s`,
          transformOrigin: 'center',
          transformBox: 'fill-box',
        },
        '#Person': {
          animation: `${person1AnimKeyframes} ${animDuration}s infinite ease-in-out`,
          animationDelay: '0s',
        },
        '#Person #Legs': {
          animation: `${getPerson1And2LegAnimKeyframes(
            'person1'
          )} ${animDuration}s infinite ease-in-out`,
          animationDelay: '0s',
          transformOrigin: 'center',
          transformBox: 'fill-box',
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
