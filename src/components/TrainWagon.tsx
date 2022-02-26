import { useSpring, animated, config } from '@react-spring/web';

type TrainWagonProps = {
  doorsOpen: boolean;
};

export function TrainWagon({ doorsOpen }: TrainWagonProps) {
  const { doorsXOffset } = useSpring({
    doorsXOffset: doorsOpen ? 8 : 0,
    config: {
      ...config.slow,
    },
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 150.334 47.5"
    >
      <circle fill="#58595B" cx="114.834" cy="43" r="4.5" />
      <circle fill="#58595B" cx="131.5" cy="43" r="4.5" />
      <circle fill="#58595B" cx="35.382" cy="43" r="4.5" />
      <circle fill="#58595B" cx="17.584" cy="43" r="4.5" />
      <path
        fill="#D1D3D4"
        d="M146.334,16.167l-6-8.667l-13.667-6H22.5L11.324,7.542l-6,8.333L0,32.083L4.333,41H21.5l1.667,5.5h6.167
      l2.108-5.5h7.639l1.676,5.628l68.91-0.442l2-5.186h6.667l1.667,5.186h5.5l2-5.186h17.156l5.678-8.938L146.334,16.167z
          M19.167,28.625H8.5L12.917,17.5l6.75-0.917L19.167,28.625z M41.833,28.917H28.167V16.792h13.667V28.917z M62,41.417H45.834V15.792
      H62V41.417z M82,29.563H68.334V18.438H82V29.563z M104.083,41.393H87.917V15.768h16.167V41.393z M124.334,28.625h-13.667V17.5
      h13.667V28.625z M131.796,28.625l-0.5-11.042l6.75,0.917l4.417,10.125H131.796z"
      />
      <animated.path
        fill="#00A651"
        transform={doorsXOffset.to((x) => `translate(${x},0)`)}
        d="M53.834,15.792v25.625H62V15.792H53.834z M59.75,31.917h-3.792V18.042h3.792V31.917z"
      />
      <animated.path
        fill="#00A651"
        transform={doorsXOffset.to((x) => `translate(${-x},0)`)}
        d="M45.834,15.792v25.625H54V15.792H45.834z M51.75,31.917h-3.792V18.042h3.792V31.917z"
      />
      <animated.path
        fill="#00A651"
        transform={doorsXOffset.to((x) => `translate(${x},0)`)}
        d="M95.917,15.768v25.625h8.167V15.768H95.917z M101.833,31.893h-3.792V18.018h3.792V31.893z"
      />
      <animated.path
        fill="#00A651"
        transform={doorsXOffset.to((x) => `translate(${-x},0)`)}
        d="M87.917,15.768v25.625h8.167V15.768H87.917z M93.833,31.893h-3.792V18.018h3.792V31.893z"
      />
    </svg>
  );
}

export default TrainWagon;
