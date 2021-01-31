import { autorun } from 'mobx';
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

test('update node + child node + unrelated data', () => {
  const normi = new Normi();

  const mainId = '3d16368b-79cc-48f4-8b72-e514ec99315c';
  const childId = '7c22ad2a-641a-11eb-ae93-0242ac130002';
  const unrelatedId = '85b4abfe-641a-11eb-ae93-0242ac130002';

  normi.merge({
    id: mainId,
    title: 'first post',
  });

  let updates: any[] = [];
  const fn = jest.fn(() => {
    const data = JSON.parse(JSON.stringify(normi.nodes[mainId]));
    updates.push(data);
  });
  autorun(fn);

  // update main id
  normi.merge({
    id: mainId,
    foo: 'first post',
    author: {
      id: childId,
      name: 'colin',
    },
  });
  // update child
  normi.merge({
    id: childId,
    github: 'https://github.com/colinhacks',
  });

  // update unrelated data
  normi.merge({
    id: unrelatedId,
    foo: 'bar',
  });

  expect(fn).toHaveBeenCalledTimes(3);
  expect(updates).toMatchInlineSnapshot(`
    Array [
      Object {
        "value": Object {
          "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
          "title": "first post",
        },
      },
      Object {
        "value": Object {
          "author": Object {
            "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
            "name": "colin",
          },
          "foo": "first post",
          "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
          "title": "first post",
        },
      },
      Object {
        "value": Object {
          "author": Object {
            "github": "https://github.com/colinhacks",
            "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
            "name": "colin",
          },
          "foo": "first post",
          "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
          "title": "first post",
        },
      },
    ]
  `);
});
