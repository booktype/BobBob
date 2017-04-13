/* @flow */

import Operation from './Operation';
import { Record, List } from 'immutable';

const defaultRecord: {
  operations: List<Operation>
} = {
  operations: new List(),
};

const TransformationRecord = Record(defaultRecord);

class Transformation extends TransformationRecord {
  insert(values) {
    return this.update('operations', (operations) => (
      operations.push(new Operation({ type: 'insert', values, numOfValues: values.length }))
    ));
  }
  merge(values){
    return this.update('operations', (operations)=>(
      operations.push(new Operation({type: 'merge', values, numOfValues: values.length}))
    ));
  }
  retain(numOfValues) {
    return this.update('operations', (operations) => (
      operations.push(new Operation({ type: 'retain', numOfValues }))
    ));
  }

  delete(numOfValues) {
    return this.update('operations', (operations) => (
      operations.push(new Operation({ type: 'delete', numOfValues }))
    ));
  }

  toString() {
    return this.get('operations').reduce((memo, operation) => (
      `${memo}${operation.toString()},`
    ), '');
  }
}

module.exports = Transformation;
