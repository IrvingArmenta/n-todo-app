import { createId } from '@paralleldrive/cuid2';

/**
 * Abstract entity model with `gid` property initialization
 * and `equals` method for entity comparisons.
 */
abstract class AbstractEntity {
  constructor(public gid?: string) {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    gid ? (this.gid = gid) : (this.gid = createId());
  }
  equals(e1: AbstractEntity, e2: AbstractEntity) {
    return e1.gid === e2.gid;
  }
}

export default AbstractEntity;
