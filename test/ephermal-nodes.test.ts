import { Normi } from '../src';

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
