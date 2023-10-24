import { Skeleton, styled } from '@mui/material';
import { ReactSVG } from 'react-svg';

type WagonMap = {
  /** Name of the upstairs wagon map SVG */
  upstairs?: string;
  /** Name of the downstairs wagon map SVG */
  downstairs: string;
  height?: number;
  type?: 'VR' | 'custom';
};

export const wagonMaps: Record<string, WagonMap | undefined> = {
  Ed: { upstairs: 'ED_up', downstairs: 'ED_down' },
  Edb: { upstairs: 'EDB_up', downstairs: 'EDB_down' },
  Edg: { upstairs: 'EDG_up', downstairs: 'EDG_down' },
  CEd: { upstairs: 'CED_up', downstairs: 'CED_down' },
  Edm: { upstairs: 'EDM_up', downstairs: 'EDM_down' },
  Edo: { upstairs: 'EDO_up', downstairs: 'EDO_down' },
  Edfs: { upstairs: 'EDFS_up', downstairs: 'EDFS_down' },
  Eds: { upstairs: 'EDS_up', downstairs: 'EDS_down' },
  ERd: { upstairs: 'ERD_up', downstairs: 'ERD_down' },
  CEmt: { downstairs: 'CEMT' },
  Ex: { downstairs: 'EX' },
  Expt: { downstairs: 'EXPT' },
  Gd: { downstairs: 'GD' },
  Gfot: { downstairs: 'GFOT' },
  Rk: { downstairs: 'RK' },
  Rx: { downstairs: 'RX' },
  Sm3_1: { downstairs: 'SM3_IM1' },
  Sm3_2: { downstairs: 'SM3_CMH' },
  Sm3_3: { downstairs: 'SM3_TTC' },
  Sm3_4: { downstairs: 'SM3_TT' },
  Sm3_5: { downstairs: 'SM3_CM' },
  Sm3_6: { downstairs: 'SM3_IM2' },
  Sm4: { downstairs: 'SM4', height: 2500, type: 'custom' },
  Sm5: { downstairs: 'SM5', height: 3690, type: 'custom' },
  Dm12: { downstairs: 'DM12', height: 1206, type: 'custom' },
};

const StyledReactSVG = styled(ReactSVG)`
  svg.vr-wagon g#Seats g g path {
    transform: rotate(-90deg);
    transform-origin: center;
    transform-box: fill-box;
  }

  svg.vr-wagon g#Seats g g[id$='-with-service-icon'] path {
    transform: rotate(-90deg) translate(0, 9px);
  }

  svg.vr-wagon g#Seats g g[id$='-with-service-icon'] use {
    transform: rotate(-90deg) translate(0, -9px);
    transform-origin: center;
    transform-box: fill-box;
  }

  svg.vr-wagon g#Seats g[transform^='rotate(90'] g path {
    transform: rotate(180deg);
  }

  svg.vr-wagon g#Seats g[transform^='rotate(-90'] g path {
    transform: rotate(0deg);
  }

  svg.vr-wagon g#Seats g g path[transform^='matrix(-1'] {
    transform: rotate(90deg) scaleX(-1);
  }

  svg.vr-wagon g#Seats g g path[transform^='rotate(-180'] {
    transform: rotate(90deg);
  }

  svg.vr-wagon g#Seats g[transform^='matrix(-1'] g path {
    transform: scaleX(-1) rotate(-90deg);
  }

  svg.vr-wagon g#Service-badges g g path {
    transform: rotate(-90deg);
    transform-origin: center;
    transform-box: fill-box;
  }

  svg.vr-wagon g#Cabins g g path:last-of-type {
    transform: rotate(-90deg);
    transform-origin: center;
    transform-box: fill-box;
  }

  svg.vr-wagon > g[id] {
    transform: translateY(15%) rotate(90deg);
    transform-origin: right top;
    > path: {
      display: none;
    }
  }
`;

type TrainWagonMapProps = {
  wagonType: string;
  type?: 'VR' | 'custom';
  height?: number;
  onLoad: () => void;
};

const TrainWagonMap = ({
  wagonType = 'RX',
  type = 'VR',
  height = 1100,
  onLoad,
}: TrainWagonMapProps) => (
  <StyledReactSVG
    src={`/wagon_maps/${wagonType}.svg`}
    loading={() => (
      <Skeleton
        width={164}
        height={height}
        variant="rectangular"
        sx={{ borderRadius: '1rem' }}
      />
    )}
    fallback={() => (
      <Skeleton
        width={164}
        height={height}
        variant="rectangular"
        animation={false}
        sx={{ borderRadius: '1rem' }}
      />
    )}
    beforeInjection={(svg) => {
      svg.setAttribute('style', `height: ${height}px`);
      if (type === 'VR') {
        svg.classList.add('vr-wagon');
        // Modify viewBox because we are rotating VR svgs from horizontal to vertical
        svg.setAttribute('viewBox', '0 0 237 1586');
      }
    }}
    afterInjection={() => {
      onLoad();
    }}
  />
);

export default TrainWagonMap;
