/** @jest-environment jsdom */

import { render } from '@testing-library/react';
import { GoogleIcon } from '@/components/google-icon';

describe('GoogleIcon', () => {
  it('renders svg icon wrapper', () => {
    const { container } = render(<GoogleIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

