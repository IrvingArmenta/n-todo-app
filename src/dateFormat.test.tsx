import { describe, expect, it } from 'vitest';
import { dateFormat } from './dateFormat';

const japaneseDateRegex = /\d{4}年\d{1,2}月\d{1,2}日 \d{1,2}:\d{2}:\d{2}/;

describe('dateFormat function', () => {
  it('should render a date with localized japanese text', () => {
    const jaDate = dateFormat(new Date()).format('LL LTS');
    expect(jaDate).toMatch(japaneseDateRegex);
  });
});
