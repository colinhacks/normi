import { Normi } from '.';

export const play = async () => {
  const normi = new Normi({
    id: ['id', '__typename'],
  });

  const obj1 = {
    id: 'asdf',
    __typename: 'user',
    a: 'asdf',
    posts: [
      {
        id: 'asdf',
        __typename: 'post',
      },
    ],
  };

  const obj2 = {
    id: 'asdf',
    __typename: 'post',
    b: 'aslsdjkfsdfdf',
    c: 12342134,
    d: false,
  };

  const obj3 = {
    id: 'asdf',
    __typename: 'user',
    b: 'swerqwer',
  };

  const objs = [obj1, obj2, obj3];

  for (const obj of objs) {
    let merged = normi.merge(obj);
    console.log(JSON.stringify(merged, null, 2));
  }

  console.log(JSON.stringify(normi.nodes, null, 2));
};
