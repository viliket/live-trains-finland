import { getBearing, toKmsPerHour } from '../math';

describe('getBearing', () => {
  it('should calculate bearing between two coordinates correctly', () => {
    expect(
      getBearing(
        { lat: 39.099912, lng: -94.581213 },
        { lat: 38.627089, lng: -90.200203 }
      )
    ).toBeCloseTo(96.51);

    expect(
      getBearing(
        { lat: 60.171648637103424, lng: 24.940928135986344 },
        { lat: 60.16917455838713, lng: 24.93080011474611 }
      )
    ).toBeCloseTo(-116.151);

    expect(
      getBearing(
        { lat: 60.17167531988447, lng: 24.94075647460939 },
        { lat: 60.17399881624469, lng: 24.940713559265152 }
      )
    ).toBeCloseTo(-0.526);

    expect(
      getBearing({ lat: 61.171, lng: 24.94 }, { lat: 60.173, lng: 24.94 })
    ).toBeCloseTo(180);
  });
});

describe('toKmsPerHour', () => {
  it('should convert m/s to km/h with correct rounding', () => {
    expect(toKmsPerHour(0)).toBe(0);
    expect(toKmsPerHour(100)).toBe(360);
    expect(toKmsPerHour(38.8889)).toBe(140);
    expect(toKmsPerHour(-38.8889)).toBe(-140);
  });
});
