import cuid from 'cuid';

/**
 * Abstract entity model with `gid` property initialization
 * and `equals` method for entity comparisons.
 */
abstract class AbstractEntity {
  constructor(public gid?: string) {
    gid ? (this.gid = gid) : (this.gid = cuid());
  }
  equals(e1: AbstractEntity, e2: AbstractEntity) {
    return e1.gid == e2.gid;
  }
}

export default AbstractEntity;
