import { Normi } from '.';

export const play = async () => {
  const normi = new Normi({
    id: ['id'],
  });

  const obj1 = {
    id: 'asdf',
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

  // const obj3 = {
  //   id: 'asdf',
  //   __typename: 'user',
  //   b: 'swerqwer',
  // };

  const objs = [obj1, obj2, obj1];

  for (const obj of objs) {
    normi.merge(obj);
  }
  console.log(JSON.stringify(normi.get(obj1.id), null, 2));
  console.log(`total nodes: ${Object.keys(normi.nodes).length}`);

  console.log(JSON.stringify(normi.nodes, null, 2));
};
