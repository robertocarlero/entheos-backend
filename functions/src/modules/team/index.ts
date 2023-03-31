import * as oncreate from './oncreate';
import * as ondelete from './ondelete';
import * as onwrite from './onwrite';

export const onCreate = oncreate.method;
export const onDelete = ondelete.method;
export const onWrite = onwrite.method;
