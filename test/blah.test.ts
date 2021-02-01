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

describe('ephermal nodes / nodes without ids', () => {
  test('should be embedded on parent node', () => {
    const normi = new Normi();

    const id = '3d16368b-79cc-48f4-8b72-e514ec99315c';

    normi.merge({
      id,
      title: 'a nice sweater',
      price: {
        currency: 'USD',
        amount: 10.0,
      },
    });

    expect(normi.nodes[id].value.price).toEqual({
      currency: 'USD',
      amount: 10.0,
    });
    expect(Object.keys(normi.nodes).length).toBe(1);

    normi.merge({
      id,
      price: {
        amount: 12.0,
      },
    });

    expect(normi.nodes[id].value.price).toEqual({
      currency: 'USD',
      amount: 12.0,
    });
  });

  test('children should still be cached', () => {
    const normi = new Normi();

    const id1 = '3d16368b-79cc-48f4-8b72-e514ec99315c';
    const id2 = '7c22ad2a-641a-11eb-ae93-0242ac130002';

    const apiResponse = {
      data: [
        {
          id: id1,
          title: 'first post',
        },
        {
          id: id2,
          title: 'second post',
        },
      ],
      meta: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    const obj = normi.merge(apiResponse);

    expect(Object.keys(normi.nodes).length).toBe(2);

    expect(obj.value).toEqual(apiResponse);

    expect(normi.nodes[id1].value).toEqual(apiResponse.data[0]);
  });
});
