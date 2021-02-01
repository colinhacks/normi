import { autorun } from 'mobx';
import { Normi } from '../src';

describe("changing a property's child node is observable from parent", () => {
  test('nested object', () => {
    const normi = new Normi();

    const authorId = '3d16368b-79cc-48f4-8b72-e514ec99315c';
    const postId = '7c22ad2a-641a-11eb-ae93-0242ac130002';
    const unrelatedId = '85b4abfe-641a-11eb-ae93-0242ac130002';

    const node = normi.merge({
      id: authorId,
      title: 'first post',
    });

    let updates: any[] = [];
    const fn = jest.fn(() => {
      const data = JSON.parse(JSON.stringify(node.value));
      updates.push(data);
    });
    autorun(fn);

    // update main id
    normi.merge({
      id: authorId,
      foo: 'first post',
      author: {
        id: postId,
        name: 'colin',
      },
    });
    // update child
    normi.merge({
      id: postId,
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
          "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
          "title": "first post",
        },
        Object {
          "author": Object {
            "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
            "name": "colin",
          },
          "foo": "first post",
          "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
          "title": "first post",
        },
        Object {
          "author": Object {
            "github": "https://github.com/colinhacks",
            "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
            "name": "colin",
          },
          "foo": "first post",
          "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
          "title": "first post",
        },
      ]
    `);
  });

  test('deep array test', () => {
    const normi = new Normi();

    const postId = '3d16368b-79cc-48f4-8b72-e514ec99315c';
    const authorId = '7c22ad2a-641a-11eb-ae93-0242ac130002';
    const unrelatedId = '85b4abfe-641a-11eb-ae93-0242ac130002';

    const node = normi.merge({
      id: authorId,
      posts: [
        {
          id: postId,
          title: 'first post',
        },
      ],
    });

    let updates: any[] = [];
    const fn = jest.fn(() => {
      const data = JSON.parse(JSON.stringify(node.value));
      updates.push(data);
    });
    autorun(fn);

    // update post id
    normi.merge({
      id: postId,
      foo: 'hello normi',
    });
    // update author
    normi.merge({
      id: authorId,
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
          "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
          "posts": Array [
            Object {
              "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
              "title": "first post",
            },
          ],
        },
        Object {
          "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
          "posts": Array [
            Object {
              "foo": "hello normi",
              "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
              "title": "first post",
            },
          ],
        },
        Object {
          "github": "https://github.com/colinhacks",
          "id": "7c22ad2a-641a-11eb-ae93-0242ac130002",
          "posts": Array [
            Object {
              "foo": "hello normi",
              "id": "3d16368b-79cc-48f4-8b72-e514ec99315c",
              "title": "first post",
            },
          ],
        },
      ]
    `);
  });
});
