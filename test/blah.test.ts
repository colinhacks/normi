import { Normi } from '../src';

test('normal merge', () => {
  const normi = new Normi();

  normi.merge({
    id: '3d16368b-79cc-48f4-8b72-e514ec99315c',
    fish: 'tuna',
  });

  const val = normi.merge({
    id: '3d16368b-79cc-48f4-8b72-e514ec99315c',
    foo: 'bar',
  });

  expect(val.value.foo).toEqual('bar');
  expect((val.value as any).fish).toEqual('tuna');
});

test('custom id key', () => {
  const normi = new Normi({
    id: 'uid',
  });

  normi.merge({
    id: '1',
    uid: '3d16368b-79cc-48f4-8b72-e514ec99315c',
    fish: 'tuna',
  });

  const val = normi.merge({
    id: '2',
    uid: '3d16368b-79cc-48f4-8b72-e514ec99315c',
    foo: 'bar',
  });

  expect(val.value.foo).toEqual('bar');
  expect((val.value as any).fish).toEqual('tuna');
});

test('custom id multikey', () => {
  const normi = new Normi({
    id: ['username', 'domain'],
  });

  normi.merge({
    username: 'colin',
    domain: 'google.com',
    first: 'tuna',
  });

  const appleColin = normi.merge({
    username: 'colin',
    domain: 'apple.com',
    second: 'frankenstein',
  });

  // no domain
  normi.merge({
    username: 'colin',
    stone: 'blarney',
  });

  const val: any = normi.merge({
    username: 'colin',
    domain: 'google.com',
    instrument: 'flugelhorn',
  });

  expect(val.value.username).toEqual('colin');
  expect(val.value.domain).toEqual('google.com');
  expect(val.value.first).toEqual('tuna');
  expect(val.value.instrument).toEqual('flugelhorn');
  expect(appleColin.value.username).toEqual('colin');
});

test('custom id function', () => {
  const normi = new Normi({
    id: data => {
      return `${data.username || Math.random()}__${data.domain ||
        Math.random()}`;
    },
  });

  normi.merge({
    username: 'colin',
    domain: 'google.com',
    first: 'tuna',
  });

  const appleColin = normi.merge({
    username: 'colin',
    domain: 'apple.com',
    second: 'frankenstein',
  });

  // no domain
  normi.merge({
    username: 'colin',
    stone: 'blarney',
  });

  const val: any = normi.merge({
    username: 'colin',
    domain: 'google.com',
    instrument: 'flugelhorn',
  });

  expect(val.value.username).toEqual('colin');
  expect(val.value.domain).toEqual('google.com');
  expect(val.value.first).toEqual('tuna');
  expect(val.value.instrument).toEqual('flugelhorn');
  expect(appleColin.value.username).toEqual('colin');
});
