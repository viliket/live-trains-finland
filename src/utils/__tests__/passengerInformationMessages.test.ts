import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../../graphql/generated/digitraffic';
import {
  getPassengerInformationMessagesCurrentlyRelevant,
  PassengerInformationMessage,
} from '../passengerInformationMessages';

describe('getPassengerInformationMessagesCurrentlyRelevant', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  describe('audio', () => {
    it('should not return messages with unsupported deliveryRules type', () => {
      const passengerInformationMessages: PassengerInformationMessage[] = [
        {
          id: 'SHM20220818174358380',
          version: 94,
          creationDateTime: '2023-09-10T14:37:00Z',
          startValidity: '2023-09-09T21:00:00Z',
          endValidity: '2023-09-10T20:59:00Z',
          stations: ['HKI'],
          audio: {
            text: {
              fi: 'Huomio!',
              sv: 'Observera!',
              en: 'Attention!',
            },
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

    describe('deliveryRules type NOW', () => {
      describe('message with creationDateTime "2023-09-10T14:37:00Z"', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            id: 'SHM20220818174358380',
            version: 94,
            creationDateTime: '2023-09-10T14:37:00Z',
            startValidity: '2023-09-09T21:00:00Z',
            endValidity: '2023-09-10T20:59:00Z',
            stations: ['HKI'],
            audio: {
              text: {
                fi: 'Huomio! Intercity 963 klo 17.36 Kupittaalle saapuu lähtöraiteelleen noin 5 minuutin kuluttua.',
                sv: 'Observera! Intercity 963 till Kuppis kl 17.36 anländer till sitt avgångsspår om cirka 5 minuter.',
                en: 'Attention! Intercity 963 to Kupittaa at 17.36 arrives to its departure track in about 5 minutes.',
              },
              deliveryRules: {
                deliveryType: 'NOW',
                repetitions: 0,
                repeatEvery: 0,
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
            id: 'SHM20220818174358380',
            version: 94,
            creationDateTime: '2023-09-10T14:37:00Z',
            startValidity: '2023-09-09T21:00:00Z',
            endValidity: '2023-09-10T20:59:00Z',
            stations: ['HKI'],
            audio: {
              text: {
                fi: 'Huomio! Intercity 963 klo 17.36 Kupittaalle saapuu lähtöraiteelleen noin 5 minuutin kuluttua.',
                sv: 'Observera! Intercity 963 till Kuppis kl 17.36 anländer till sitt avgångsspår om cirka 5 minuter.',
                en: 'Attention! Intercity 963 to Kupittaa at 17.36 arrives to its departure track in about 5 minutes.',
              },
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
            id: 'SHM20230420115013317',
            version: 15,
            creationDateTime: '2023-09-03T08:07:00Z',
            startValidity: '2023-09-01T21:00:00Z',
            endValidity: '2023-09-03T20:59:00Z',
            stations: ['KV'],
            audio: {
              text: {
                fi: 'Hyvät matkustajat! Rataverkolla tehdään kunnossapitotöitä. 2.-3.9.2023 osa junista Kouvolan ja Pieksämäen, sekä Kouvolan ja Joensuun välillä, on korvattu busseilla. Lisäksi joulukuuhun asti, myös Kouvolan ja Kotkan sataman välillä osa junista on korvattu busseilla. Kouvolassa korvaavat bussit lähtevät asemarakennuksen ja raiteen 1 välistä. Korvatut junavuorot, bussien aikataulut sekä asemakohtaiset lähtöpaikat löydät osoitteesta vr.fi.',
                sv: 'Bästa passagerare! Underhållsarbeten pågår på järnvägsnätet. Mellan 2 till 3 september 2023 har en del av tågen mellan Kouvola och Pieksämäki samt Kouvola och Joensuu ersatts av bussar.  Dessutom fram till december ersätts några tåg med buss mellan Kouvola och Kotka. I Kouvola avgår ersättningsbussar mellan stationshuset och spår 1.  Ersatta tågtider, busstidtabeller och stationsspecifika avgångsplatser finns på vr.fi.',
                en: 'Dear passangers! There are changes in train traffic due to maintenance works. Between 2.9.2023 and 3.9.2023, some of the trains between Kouvola and Pieksämäki, and Kouvola and Joensuu, have been replaced by buses. There are also some train replaced by buses until December between Kouvola, and Kotka. In Kouvola, replacement buses leave from between the station building and track 1. Replaced train times, bus schedules and station-specific departure points can be found at vr.fi.',
              },
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
            id: 'MVM20230902154021600',
            version: 5,
            creationDateTime: '2023-09-02T15:51:00Z',
            startValidity: '2023-09-02T15:51:00Z',
            endValidity: '2023-09-04T00:00:00Z',
            trainNumber: 750,
            trainDepartureDate: '2023-09-02',
            stations: ['LUS', 'PUN', 'REE', 'KIÄ', 'PKY'],
            audio: {
              text: {
                fi: 'Huomio ilmoitus! Juna H750 on korvattu linja-autolla Savonlinnan ja Parikkalan välillä. Korvaava linja-auto lähtee aseman edustalta. Bussin matka-aika asemien välillä on pidempi kuin junan matka-aika. Info:vr.fi',
                sv: 'Observera! Tåg H750 har ersatts av ett buss mellan Nyslott och Parikkala. Bussen avgår från järnvägsstationen.  Restiden för bussen mellan stationerna är längre än tågets restid. Info:vr.fi',
                en: 'Attention! Train H750 has been replaced by bus between Savonlinna and Parikkala. The bus leaves from the railwaystation. The bus travel time between stations is longer than the train travel time. Info:vr.fi.',
              },
              deliveryRules: {
                deliveryType: 'ON_SCHEDULE',
                repetitions: 1,
                repeatEvery: 0,
              },
            },
          },
        ];

        const train: TrainByStationFragment = {
          runningCurrently: true,
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
            shortCode: '',
            uicCode: 1,
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
      });
    });

    describe('deliveryRules type ON_EVENT', () => {
      it('should not return messages with type ON_EVENT because they are not currently supported', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            id: 'SHM20220818174358380',
            version: 94,
            creationDateTime: '2023-09-10T14:37:00Z',
            startValidity: '2023-09-09T21:00:00Z',
            endValidity: '2023-09-10T20:59:00Z',
            stations: ['HKI'],
            audio: {
              text: {
                fi: 'Huomio!',
                sv: 'Observera!',
                en: 'Attention!',
              },
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
          id: 'SHM20220818174358380',
          version: 94,
          creationDateTime: '2023-09-10T14:37:00Z',
          startValidity: '2023-09-09T21:00:00Z',
          endValidity: '2023-09-10T20:59:00Z',
          stations: ['HKI'],
          video: {
            text: {
              fi: 'Huomio!',
              sv: 'Observera!',
              en: 'Attention!',
            },
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

    describe('deliveryRules type CONTINUOS_VISUALIZATION', () => {
      describe('message with timespan "2023-09-11T01:00:00+03:00" to "2023-09-15T04:20:00+03:00" on Mon-Thu', () => {
        const passengerInformationMessages: PassengerInformationMessage[] = [
          {
            id: 'SHM20230727799106000',
            version: 7,
            creationDateTime: '2023-09-08T04:16:00Z',
            startValidity: '2023-09-10T21:00:00Z',
            endValidity: '2023-09-15T20:59:00Z',
            stations: ['AVP', 'VEH', 'KTÖ'],
            video: {
              text: {
                fi: 'Suomeksi',
                sv: 'På svenska',
                en: 'In English',
              },
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
            id: 'SHM20230504174327890',
            version: 10,
            creationDateTime: '2023-09-09T05:38:00Z',
            startValidity: '2023-09-08T21:00:00Z',
            endValidity: '2023-09-10T20:59:00Z',
            stations: ['HKI'],
            video: {
              text: {
                fi: 'Raide suljettu. Varmista junasi lähtöraide aikataulunäytöiltä tai osoitteesta junalahdot.fi.',
                sv: 'Spåret är stängt. Kolla tågens avgångsspår från tidtabellsskärmarna eller på addressen junalahdot.fi.',
                en: 'The track is closed. Check the departure tracks from the timetable displays or at junalahdot.fi.',
              },
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
