/* @flow */

import type { OperationType } from './OperationType';
import type { AttributeType } from './AttributeType';
import { Record, Map } from 'immutable';

const defaultRecord: {
  type: OperationType,
  numOfValues: number,
  value: string,
  attributes: Map<AttributeType, any>,
} = {
  type: 'insert',
  numOfValues: 0,
  values: '',
  attributes: new Map(),
};

const OperationRecord = Record(defaultRecord);

class Operation extends OperationRecord {
  isInsert() {
    return this.get('type') === 'insert';
  }
  isUpdate() {
    return this.get('type') === 'merge';
  }
  isRetain() {
    return this.get('type') === 'retain';
  }

  isDelete() {
    return this.get('type') === 'delete';
  }

  toString() {
    return `${this.get('type')} ${this.get('values') || this.get('numOfValues')}`;
  }
}

export default Operation;
