import { autorun } from 'mobx';
import { Normi } from '../src';

test('nested object', () => {
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
