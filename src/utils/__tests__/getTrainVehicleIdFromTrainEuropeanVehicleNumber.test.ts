import getTrainVehicleIdFromTrainEuropeanVehicleNumber from '../getTrainVehicleIdFromTrainEuropeanVehicleNumber';

describe('getTrainVehicleIdFromTrainEuropeanVehicleNumber', () => {
  it('should return null when vehicle ID cannot be determined', () => {
    expect(
      getTrainVehicleIdFromTrainEuropeanVehicleNumber(
        '94106000001-0',
        'NoSuchWagonType'
      )
    ).toBeNull();
  });

  it('should return correct vehicle ID for the given vehicle number and wagon type', () => {
    expect(
      getTrainVehicleIdFromTrainEuropeanVehicleNumber('94106000001-0', 'Sm1')
    ).toBe(6001);

    expect(
      getTrainVehicleIdFromTrainEuropeanVehicleNumber('94106000088-7', 'Sm2')
    ).toBe(6088);

    expect(
      getTrainVehicleIdFromTrainEuropeanVehicleNumber('94106004024-8', 'Sm4')
    ).toBe(6324);

    expect(
      getTrainVehicleIdFromTrainEuropeanVehicleNumber('94102081038-3', 'Sm5')
    ).toBe(1038);
  });
});
