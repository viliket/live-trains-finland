import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../../graphql/generated/digitraffic/graphql';
import {
  getPassengerInformationMessageForLanguage,
  getPassengerInformationMessagesByStation,
  getPassengerInformationMessagesCurrentlyRelevant,
  PassengerInformationMessage,
} from '../passengerInformationMessages';

describe('getPassengerInformationMessageForLanguage', () => {
  const passengerInformationMessageBase: PassengerInformationMessage = {
    id: '',
    version: 1,
    creationDateTime: '',
    startValidity: '',
    endValidity: '',
    stations: [],
  };

  const videoAudioMessage: PassengerInformationMessage = {
    ...passengerInformationMessageBase,
    video: {
      text: {
        en: 'English video text! junalahdot.fi',
        fi: 'Finnish video text! junalahdot.fi',
      },
    },
    audio: {
      text: {
        en: 'English audio text! junalahdot.fi',
        fi: 'Finnish audio text! junalahdot.fi',
      },
    },
  };

  const audioOnlyMessage: PassengerInformationMessage = {
    ...passengerInformationMessageBase,
    audio: {
      text: {
        en: 'English audio text! junalahdot.fi',
        sv: 'Swedish audio text!',
        fi: 'Finnish audio text! junalahdot.fi',
      },
    },
  };

  it('should return the message from video content when available in the specified language', () => {
    const result = getPassengerInformationMessageForLanguage(
      videoAudioMessage,
      'en'
    );
    expect(result).toBe('English video text! junaan.fi / junalahdot.fi');
  });

  it('should return the message from audio content when video content is not available in the specified language', () => {
    const result = getPassengerInformationMessageForLanguage(
      audioOnlyMessage,
      'sv'
    );
    expect(result).toBe('Swedish audio text!');
  });

  it('should return the default language message when the specified language is not available', () => {
    const result = getPassengerInformationMessageForLanguage(
      videoAudioMessage,
      'fr'
    );
    expect(result).toBe('Finnish video text! junaan.fi / junalahdot.fi');
  });

  it('should return an empty string when both video and audio content are undefined', () => {
    const result = getPassengerInformationMessageForLanguage(
      passengerInformationMessageBase,
      'en'
    );
    expect(result).toBe('');
  });
});

describe('getPassengerInformationMessagesByStation', () => {
  it('should add the message to the station present in stations array when there is only single station', () => {
    const passengerInformationMessages: PassengerInformationMessage[] = [
      {
        id: 'SHM20220818174358380',
        version: 94,
        creationDateTime: '2023-09-10T14:37:00Z',
        startValidity: '2023-09-09T21:00:00Z',
        endValidity: '2023-09-10T20:59:00Z',
        stations: ['PSL'],
      },
    ];

    const messagesByStation = getPassengerInformationMessagesByStation(
      passengerInformationMessages
    );

    expectToBeDefined(messagesByStation);
    expect(messagesByStation['PSL']).toBeDefined();
    expect(messagesByStation['PSL'].length).toBe(1);
  });

  it('should only add the message to first and last station in the stations array when there are multiple stations', () => {
    const passengerInformationMessages: PassengerInformationMessage[] = [
      {
        id: 'SHM20220818174358380',
        version: 94,
        creationDateTime: '2023-09-10T14:37:00Z',
        startValidity: '2023-09-09T21:00:00Z',
        endValidity: '2023-09-10T20:59:00Z',
        stations: ['HKI', 'PSL', 'TKL', 'KE', 'RI'],
      },
    ];

    const messagesByStation = getPassengerInformationMessagesByStation(
      passengerInformationMessages
    );

    expectToBeDefined(messagesByStation);
    expect(messagesByStation['HKI']).toBeDefined();
    expect(messagesByStation['HKI'].length).toBe(1);
    expect(messagesByStation['PSL']).toBeUndefined();
    expect(messagesByStation['TKL']).toBeUndefined();
    expect(messagesByStation['KE']).toBeUndefined();
    expect(messagesByStation['RI']).toBeDefined();
    expect(messagesByStation['RI'].length).toBe(1);
  });
});

describe('getPassengerInformationMessagesCurrentlyRelevant', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    // Default system time within validity of passengerInformationMessageBase
    // that can be overwritten by individual tests
    jest.setSystemTime(parseISO('2023-09-09T00:00:00Z'));
  });

  const passengerInformationMessageBase: PassengerInformationMessage = {
    id: 'SHM20220818174358380',
    version: 94,
    creationDateTime: '2023-09-10T14:37:00Z',
    startValidity: '2023-09-01T00:00:00Z',
    endValidity: '2023-09-14T21:00:00Z',
    stations: ['HKI'],
  };

  const defaultPassengerInformationTextContent = {
    fi: 'Huomio!',
    sv: 'Observera!',
    en: 'Attention!',
  };

  describe('overall message validity', () => {
    const passengerInformationMessages: PassengerInformationMessage[] = [
      {
        ...passengerInformationMessageBase,
        startValidity: '2023-09-01T00:00:00Z',
        endValidity: '2023-09-14T21:00:00Z',
        audio: {
          text: defaultPassengerInformationTextContent,
        },
      },
    ];

    it.each(['2023-09-01T00:00:00Z', '2023-09-14T21:00:00Z'])(
      'should be relevant at time %p',
      (nowISO: string) => {
        jest.setSystemTime(parseISO(nowISO));

        const relevantMessages =
          getPassengerInformationMessagesCurrentlyRelevant(
            passengerInformationMessages
          );

        expect(relevantMessages.length).toBe(1);
      }
    );

    it.each(['2023-08-31T23:59:59Z', '2023-09-14T21:00:01Z'])(
      'should not be relevant at time %p',
      (nowISO: string) => {
        jest.setSystemTime(parseISO(nowISO));

        const relevantMessages =
          getPassengerInformationMessagesCurrentlyRelevant(
            passengerInformationMessages
          );

        expect(relevantMessages.length).toBe(0);
      }
    );
  });

  describe('audio', () => {
    it('should not return messages with unsupported deliveryRules type', () => {
      const passengerInformationMessages: PassengerInformationMessage[] = [
        {
          ...passengerInformationMessageBase,
          audio: {
            text: defaultPassengerInformationTextContent,
            deliveryRules: {
              deliveryType: 'NO_SUPPORT_FOR_SUCH_TYPE' as any,
            },
          },
        },
      ];

      const relevantMessages = getPassengerInformationMessagesCurrentlyRelevant(
        passengerInformationMessages
      );

      expect(relevantMessages.length).toBe(0);
    });

    it('should return messages that have no deliveryRules', () => {
      const passengerInformationMessages: PassengerInformationMessage[] = [
        {
          ...passengerInformationMessageBase,
          audio: {
            text: defaultPassengerInformationTextContent,
          },
        },
      ];

      const relevantMessages = getPassengerInformationMessagesCurrentlyRelevant(
        passengerInformationMessages
      );

      expect(relevantMessages.length).toBe(1);
    });

    describe('deliveryRules type NOW', () => {
      describe('message with creationDateTime "2023-09-10T14:37:00Z"', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            creationDateTime: '2023-09-10T14:37:00Z',
            audio: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                deliveryType: 'NOW',
              },
            },
          },
        ];

        it.each(['2023-09-10T14:37:00Z', '2023-09-10T14:52:00Z'])(
          'should be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(1);
          }
        );

        it.each(['2023-09-10T14:36:00Z', '2023-09-10T14:53:00Z'])(
          'should not be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(0);
          }
        );
      });
    });

    describe('deliveryRules type DELIVERY_AT', () => {
      describe('message with deliveryAt "2023-09-10T14:30:00Z"', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            audio: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                deliveryType: 'DELIVERY_AT',
                deliveryAt: '2023-09-10T14:30:00Z',
              },
            },
          },
        ];

        it.each(['2023-09-10T14:30:00Z', '2023-09-10T14:45:00Z'])(
          'should be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(1);
          }
        );

        it.each(['2023-09-10T14:29:00Z', '2023-09-10T14:46:00Z'])(
          'should not be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(0);
          }
        );
      });

      describe('message with no deliveryAt set but creationDateTime set as "2023-09-10T14:30:00Z"', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            audio: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                deliveryType: 'DELIVERY_AT',
                deliveryAt: '2023-09-10T14:30:00Z',
              },
            },
          },
        ];

        it.each(['2023-09-10T14:30:00Z', '2023-09-10T14:45:00Z'])(
          'should be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(1);
          }
        );

        it.each(['2023-09-10T14:29:00Z', '2023-09-10T14:46:00Z'])(
          'should not be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(0);
          }
        );
      });
    });

    describe('deliveryRules type REPEAT_EVERY', () => {
      describe('message with timespan "2023-09-01T08:20:00+03:00" to "2023-09-03T15:00:00+03:00" on all weekdays', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            audio: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                startDateTime: '2023-09-01T21:00:00Z',
                endDateTime: '2023-09-03T20:59:00Z',
                startTime: '8:20',
                endTime: '15:00',
                weekDays: [
                  'MONDAY',
                  'TUESDAY',
                  'WEDNESDAY',
                  'THURSDAY',
                  'FRIDAY',
                  'SATURDAY',
                  'SUNDAY',
                ],
                deliveryType: 'REPEAT_EVERY',
                repetitions: 1,
                repeatEvery: 20,
              },
            },
          },
        ];

        it.each(['2023-09-02T08:20:00+03:00', '2023-09-03T15:00:00+03:00'])(
          'should be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(1);
          }
        );

        it.each(['2023-09-02T08:19:00+03:00', '2023-09-03T15:01:00+03:00'])(
          'should not be relevant at time %p',
          (nowISO: string) => {
            jest.setSystemTime(parseISO(nowISO));

            const relevantMessages =
              getPassengerInformationMessagesCurrentlyRelevant(
                passengerInformationMessages
              );

            expect(relevantMessages.length).toBe(0);
          }
        );
      });
    });

    describe('deliveryRules type ON_SCHEDULE', () => {
      describe('train with departureDate 2023-09-02 and message with stations [LUS=15:51, PUN=16:00]', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            trainNumber: 750,
            trainDepartureDate: '2023-09-02',
            stations: ['LUS', 'PUN', 'REE', 'KIÄ', 'PKY'],
            audio: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                deliveryType: 'ON_SCHEDULE',
                repetitions: 1,
                repeatEvery: 0,
              },
            },
          },
        ];

        const train: TrainByStationFragment = {
          trainNumber: 750,
          departureDate: '2023-09-02',
          version: '1',
          trainType: {
            name: '',
            trainCategory: {
              name: '',
            },
          },
          operator: {
            uicCode: 10,
          },
          timeTableRows: [
            {
              scheduledTime: '2023-09-02T15:51:00Z',
              cancelled: false,
              station: {
                name: '',
                shortCode: 'LUS',
              },
              trainStopping: true,
              type: TimeTableRowType.Arrival,
            },
            {
              scheduledTime: '2023-09-02T16:00:00Z',
              cancelled: false,
              station: {
                name: '',
                shortCode: 'PUN',
              },
              trainStopping: true,
              type: TimeTableRowType.Arrival,
            },
          ],
        };

        it.each([
          '2023-09-02T15:51:00Z',
          '2023-09-02T15:52:00Z',
          '2023-09-02T16:00:00Z',
          '2023-09-02T16:01:00Z',
        ])('should be relevant at time %p', (nowISO: string) => {
          jest.setSystemTime(parseISO(nowISO));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages,
              train
            );

          expect(relevantMessages.length).toBe(1);
        });

        it.each([
          '2023-09-02T15:50:59Z',
          '2023-09-02T15:53:00Z',
          '2023-09-02T15:59:59Z',
          '2023-09-02T16:02:00Z',
        ])('should not be relevant at time %p', (nowISO: string) => {
          jest.setSystemTime(parseISO(nowISO));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages,
              train
            );

          expect(relevantMessages.length).toBe(0);
        });

        it('should not return messages if no train is given as parameter', () => {
          jest.setSystemTime(parseISO('2023-09-02T15:50:59Z'));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages
            );

          expect(relevantMessages.length).toBe(0);
        });
      });
    });

    describe('deliveryRules type ON_EVENT', () => {
      it('should not return messages with type ON_EVENT because they are not currently supported', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            audio: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                deliveryType: 'ON_EVENT',
              },
            },
          },
        ];

        const relevantMessages =
          getPassengerInformationMessagesCurrentlyRelevant(
            passengerInformationMessages
          );

        expect(relevantMessages.length).toBe(0);
      });
    });
  });

  describe('video', () => {
    it('should not return messages with unsupported deliveryRules type', () => {
      const passengerInformationMessages: PassengerInformationMessage[] = [
        {
          ...passengerInformationMessageBase,
          video: {
            text: defaultPassengerInformationTextContent,
            deliveryRules: {
              deliveryType: 'NO_SUPPORT_FOR_SUCH_TYPE' as any,
            },
          },
        },
      ];

      const relevantMessages = getPassengerInformationMessagesCurrentlyRelevant(
        passengerInformationMessages
      );

      expect(relevantMessages.length).toBe(0);
    });

    it('should return messages that have no deliveryRules', () => {
      const passengerInformationMessages: PassengerInformationMessage[] = [
        {
          ...passengerInformationMessageBase,
          video: {
            text: defaultPassengerInformationTextContent,
          },
        },
      ];

      const relevantMessages = getPassengerInformationMessagesCurrentlyRelevant(
        passengerInformationMessages
      );

      expect(relevantMessages.length).toBe(1);
    });

    describe('deliveryRules type CONTINUOS_VISUALIZATION', () => {
      describe('message with timespan "2023-09-11T01:00:00+03:00" to "2023-09-15T04:20:00+03:00" on Mon-Thu', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            video: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                startDateTime: '2023-09-10T21:00:00Z',
                endDateTime: '2023-09-15T20:59:00Z',
                startTime: '0:01',
                endTime: '4:20',
                weekDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'],
                deliveryType: 'CONTINUOS_VISUALIZATION',
              },
            },
          },
        ];

        it.each([
          '2023-09-10T21:01:00Z',
          '2023-09-12T00:00:00Z',
          // 2023-09-14 is Thursday (which is one of the weekDays) and this is one second before Friday
          '2023-09-14T23:59:59+03:00',
        ])('should be relevant at time %p', (nowISO: string) => {
          jest.setSystemTime(parseISO(nowISO));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages
            );

          expect(relevantMessages.length).toBe(1);
        });

        it.each([
          '2023-09-10T21:00:00Z',
          '2023-09-15T01:20:01Z',
          // 2023-09-15 is Friday which is not one of the weekDays
          '2023-09-15T00:00:00+03:00',
        ])('should not be relevant at time %p', (nowISO: string) => {
          jest.setSystemTime(parseISO(nowISO));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages
            );

          expect(relevantMessages.length).toBe(0);
        });
      });
    });

    describe('video deliveryRules type WHEN', () => {
      describe('message with timespan "2023-09-08T21:00:00Z" to "2023-09-10T20:59:00Z" on Mon-Sun from 7:45 to 7:50', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            ...passengerInformationMessageBase,
            video: {
              text: defaultPassengerInformationTextContent,
              deliveryRules: {
                startDateTime: '2023-09-08T21:00:00Z',
                endDateTime: '2023-09-10T20:59:00Z',
                startTime: '7:45',
                endTime: '7:50',
                weekDays: [
                  'MONDAY',
                  'TUESDAY',
                  'WEDNESDAY',
                  'THURSDAY',
                  'FRIDAY',
                  'SATURDAY',
                  'SUNDAY',
                ],
                deliveryType: 'WHEN',
              },
            },
          },
        ];

        it.each([
          '2023-09-09T07:45:00+03:00',
          '2023-09-09T07:47:00+03:00',
          '2023-09-09T07:50:00+03:00',
          '2023-09-10T07:45:00+03:00',
          '2023-09-10T07:47:00+03:00',
          '2023-09-10T07:50:00+03:00',
        ])('should be relevant at time %p', (nowISO: string) => {
          jest.setSystemTime(parseISO(nowISO));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages
            );

          expect(relevantMessages.length).toBe(1);
        });

        it.each([
          '2023-09-09T07:44:59+03:00',
          '2023-09-09T07:50:01+03:00',
          '2023-09-11T07:47:00+03:00',
        ])('should not be relevant at time %p', (nowISO: string) => {
          jest.setSystemTime(parseISO(nowISO));

          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(
              passengerInformationMessages
            );

          expect(relevantMessages.length).toBe(0);
        });
      });
    });
  });
});
