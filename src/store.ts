import { action, observable } from 'mobx';
import { util } from './util';
type NormiParams = {
  id: ((arg: any) => string) | string[];
};

export class Normi {
  params: NormiParams;
  constructor(params: Partial<NormiParams>) {
    if (typeof params.id !== 'function' && !Array.isArray(params.id)) {
      throw new Error(`Invalid type for params.id: ${typeof params.id}`);
    }
    this.params = {
      id: params.id || ['id'],
    };
  }

  @observable nodes: { [k: string]: { value: any } } = {};

  @action merge = <T extends any>(data: T): { value: T } => {
    let id;

    if (typeof this.params.id === 'function') {
      id = this.params.id(data);
    } else if (Array.isArray(this.params.id)) {
      id = this.params.id
        .map(k => {
          if (data[k] && util.isPrimitive(data[k])) {
            return data[k];
          }
          return util.randomId();
        })
        .join('_');
    } else {
      id = util.randomId();
    }

    const node = this.nodes[id] || {};

    if (Array.isArray(data)) {
      node.value = data.map((el: any) => this.merge(el).value);
    } else if (typeof data === 'object') {
      if (!node.value) node.value = {};
      for (let key in data) {
        node.value[key] = this.merge(data[key]).value;
      }
    } else if (util.isPrimitive(data)) {
      return { value: data };
    } else {
      node.value = data;
    }

    this.nodes[id] = node;
    return this.nodes[id];
  };
}
