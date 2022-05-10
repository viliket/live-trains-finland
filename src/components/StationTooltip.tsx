import { Tooltip, TooltipProps } from 'react-leaflet';

type StationTooltipProps = {
  permanent?: boolean;
};

const StationTooltip = (props: TooltipProps & StationTooltipProps) => {
  return <Tooltip key={`${props.permanent}`} {...props} />;
};

export default StationTooltip;
