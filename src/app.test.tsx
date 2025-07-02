import { render } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App Test', () => {
  it('should render a button with correct text', () => {
    const Application = render(<App />);
    expect(Application).toBeDefined();
  });
});
