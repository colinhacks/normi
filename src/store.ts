import { action, observable } from 'mobx';
import { util } from './util';

type NormiParams = {
  id: ((arg: any) => string) | string[];
};

export class Normi {
  params: NormiParams;
  constructor(params: Partial<NormiParams> = {}) {
    this.params = {
      id: params.id || ['id'],
    };
  }

  getId = (data: any) => {
    console.log(`getId`);
    console.log(JSON.stringify(data, null, 2));
    if (typeof this.params.id === 'function') {
      return this.params.id(data);
    } else if (Array.isArray(this.params.id)) {
      return this.params.id
        .map(k => {
          if (data && data[k] && util.isPrimitive(data[k])) {
            return data[k];
          }
          return util.randomId();
        })
        .join('_');
    } else {
      return util.randomId();
    }
  };

  get = (id: string) => {
    return this.nodes[id] || null;
  };

  @observable nodes: { [k: string]: { value: any } } = {};

  @action merge = <T extends any>(rawData: T): { value: T } => {
    // let id;
    const data: any = rawData;
    const id = this.getId(data);

    const node = this.nodes[id] || {};

    if (util.isPrimitive(data)) {
      return { value: data };
    } else if (Array.isArray(data)) {
      node.value = data.map((el: any) => {
        return this.merge(el).value;
      });
    } else if (typeof data === 'object') {
      if (!node.value) node.value = {};
      for (let key in data) {
        node.value[key] = this.merge(data[key]).value;
      }
    } else {
      node.value = data;
    }

    this.nodes[id] = node;
    return this.nodes[id];
  };
}
