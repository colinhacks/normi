import { makeAutoObservable, observable } from 'mobx';
import { util } from './util';

type NormiParams = {
  id: ((arg: any) => string) | string | string[];
};

type Node<T> = {
  value: T;
};

export class Normi {
  params: NormiParams;
  nodes: Record<string, Node<any>>;
  constructor(params: Partial<NormiParams> = {}) {
    this.params = {
      id: params.id || ['id'],
    };
    makeAutoObservable(this);
    this.nodes = {};
  }

  getId = (data: any) => {
    if (typeof this.params.id === 'function') {
      return this.params.id(data);
    }
    if (typeof this.params.id === 'string' || Array.isArray(this.params.id)) {
      const idKeys =
        typeof this.params.id === 'string' ? [this.params.id] : this.params.id;

      let parts: any[] = [];
      for (const key of idKeys) {
        const value = data && data[key];
        if (!util.isPrimitive(value)) {
          return null;
        }
        parts.push(value);
      }
      return parts.join('_');
    }

    return null;
  };

  get = (id: string) => {
    return this.nodes[id] || null;
  };

  merge = <T extends any>(rawData: T, prevNode?: Node<unknown>): Node<T> => {
    // let id;
    const data: any = rawData;
    const id = this.getId(data);

    const node: Node<any> =
      id && this.nodes[id] ? this.nodes[id] : ({} as Node<any>);

    if (util.isPrimitive(data)) {
      return { value: data };
    } else if (Array.isArray(data)) {
      node.value = data.map((el: any) => {
        return this.merge(el).value;
      });
    } else if (util.isPlainObj(data)) {
      if (!node.value) {
        node.value = util.isPlainObj(prevNode?.value)
          ? prevNode!.value
          : observable({});
      }

      for (let key in data) {
        const currentNode = node.value[key];
        node.value[key] = this.merge(data[key], { value: currentNode }).value;
      }
    } else {
      node.value = data;
    }

    if (id) {
      this.nodes[id] = node;
    }
    return node;
  };
}
