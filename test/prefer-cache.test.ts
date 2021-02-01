import { Normi } from '../src';

test('prefer-cache test (for e.g. stale api responses)', () => {
  const normi = new Normi();

  const id = '3d16368b-79cc-48f4-8b72-e514ec99315c';
  const originalPost = {
    id,
    title: 'first post',
    updatedAt: '2021-02-01T00:31:00.000Z',
  };
  const updatedPost = {
    id,
    title: 'Hello, normi!',
    updatedAt: '2021-02-01T00:31:20.000Z',
  };
  normi.merge(originalPost);
  // we just did a mutation
  normi.merge(updatedPost);

  expect(normi.getPreferCache(originalPost).value).toEqual(updatedPost);

  const objNotInCache = {
    id: '7c22ad2a-641a-11eb-ae93-0242ac130002',
    title: 'test',
  };
  expect((normi.getPreferCache(objNotInCache.value)).toEqual(objNotInCache);
});
