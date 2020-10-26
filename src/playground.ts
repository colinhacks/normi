import { Normi } from '.';

export const play = async () => {
  console.log('play');
  const normi = new Normi({
    id: ['id'],
  });

  const obj1 = {
    createdAt: '2020-09-22T06:56:51.541Z',
    uid: 'w2c5dsy8CaUHh6Nvt39xsQLao9R2',
    firstName: 'Colin',
    lastName: 'McDonnell',
    userType: 'Physician',
    suffix: 'MD',
    npi: null,
    ptan: null,
    dea: null,
    termsConsent: true,
    id: '3d16368b-79cc-48f4-8b72-e514ec99315c',
  };

  // const objs = [obj1, obj2, obj3];

  const val = normi.merge(obj1);
  console.log(val.value.npi);
};
play();
