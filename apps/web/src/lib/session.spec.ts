import { Participant } from 'models';

import { calcScore, calcSessionTime } from './session'

describe('lib/session', () => {
  describe('calcSessionTime', () => {
    test(`経過時間が0秒の場合
      作業中
      残り時間:25分
      経過時間:0秒
    `, () => {
      const elapsedTime = 0;
      const { sessionElapsedTime, sessionRemainingTime, isRestTime } = calcSessionTime(elapsedTime);
      expect(sessionElapsedTime).toBe(0);
      expect(sessionRemainingTime).toBe(25 * 60 * 1000);
      expect(isRestTime).toBe(false);
    });

    test(`経過時間が25分1秒の場合
      休憩中
      残り時間:4分59秒
      経過時間1秒
    `, () => {
      const elapsedTime = 25 * 60 * 1000 + 1 * 1000;
      const { sessionElapsedTime, sessionRemainingTime, isRestTime } = calcSessionTime(elapsedTime);
      expect(sessionElapsedTime).toBe(1 * 1000);
      expect(sessionRemainingTime).toBe(4 * 60 * 1000 + 59 * 1000);
      expect(isRestTime).toBe(true);
    });

    test(`経過時間が56分20秒の場合
      作業中
      残り時間:8分40秒
      経過時間:16分20秒
    `, () => {
      const elapsedTime = 46 * 60 * 1000 + 20 * 1000;
      const { sessionElapsedTime, sessionRemainingTime, isRestTime } = calcSessionTime(elapsedTime);
      expect(sessionElapsedTime).toBe(16 * 60 * 1000 + 20 * 1000);
      expect(sessionRemainingTime).toBe(8 * 60 * 1000 + 40 * 1000);
      expect(isRestTime).toBe(false);
    })
  })

  describe('calcScore', () => {
    test('参加者が1人・休憩時間となった場合、スコアは1', () => {
      const participants: Participant[] = [{
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }];
      const score = calcScore(participants, false);
      expect(score).toBe(1);
    })

    test('参加者が4人・休憩時間となった場合、スコアは3', () => {
      const participants: Participant[] = [{
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }, {
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }, {
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }, {
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }];
      const score = calcScore(participants, false);
      expect(score).toBe(4);
    })

    test('参加者が4人・作業時間となった場合、スコアは0', () => {
      const participants: Participant[] = [{
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }, {
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }, {
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }, {
        username: 'test',
        avatar: '',
        score: 0,
        roomId: 'roomId',
        id: 'id'
      }];
      const score = calcScore(participants, true);
      expect(score).toBe(0);
    })
  })
})