type VehicleMarkerIconProps = {
  rotate: number | null;
  vehicleNumber: string;
  color: string;
};

const VehicleMarkerIcon = ({
  rotate,
  vehicleNumber = '',
  color,
}: VehicleMarkerIconProps) => (
  <div style={{ width: 'inherit', height: 'inherit' }}>
    <div
      style={{
        transform: rotate != null ? `rotate(${rotate - 45}deg` : undefined,
        width: 'inherit',
        height: 'inherit',
        backgroundColor: '#fff',
        boxShadow: '0 0 5px 0 rgb(0 0 0 / 60%)',
        borderRadius: `50% ${rotate != null ? 1 : 50}% 50% 50%`,
      }}
    ></div>
    <div
      style={{
        backgroundColor: color,
        color: '#fff',
        width: 'calc(100% - 4px)',
        height: 'calc(100% - 4px)',
        paddingLeft: '2px',
        paddingRight: '2px',
        textTransform: 'uppercase',
        borderRadius: '50%',
        lineHeight: '1',
        position: 'absolute',
        top: '2px',
        left: '2px',
        fontSize: '12px',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {vehicleNumber}
    </div>
  </div>
);

export default VehicleMarkerIcon;
