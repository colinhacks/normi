import { Normi } from '.';

export const play = async () => {
  console.log('play');
  const normi = new Normi({
    id: ['id'],
  });

  const obj1 = {
    id: '10f17846-d069-4d9b-b150-193cd1c586eb',
    name: 'user1',
    posts: [
      {
        id: 'post1',
      },
    ],
  };

  const obj2 = {
    ...obj1,
    posts: [
      {
        id: 'post1',
      },
      {
        id: 'post2',
      },
    ],
  };

  const obj3 = {
    createdAt: '2020-08-29T05:25:49.289Z',
    dea: null,
    firstName: 'Colin',
    id: '10f17846-d069-4d9b-b150-193cd1c586eb',
    me: [`10f17846-d069-4d9b-b150-193cd1c586eb`],
    meList: [{ id: `10f17846-d069-4d9b-b150-193cd1c586eb` }],
    lastName: 'McDonnell',
    npi: null,
    asdf: undefined,
    qwer: NaN,
    poiu: Infinity,
    dfgh: [Infinity, NaN, null, undefined],
    ptan: null,
    suffix: 'DO',
    termsConsent: true,
    uid: '0AHE4lK7uXYGOj7aIgjl1FhNVBF3',
    userType: 'Physician',
  };

  const objs = [obj1, obj2, obj3];

  for (const obj of objs) {
    console.log(`obj`);
    console.log(obj);
    normi.merge(obj);
  }
  // console.log(JSON.stringify(normi.get(obj1.id), null, 2));
  // console.log(`total nodes: ${Object.keys(normi.nodes).length}`);
  // console.log(JSON.stringify(normi.nodes, null, 2));
};
play();
