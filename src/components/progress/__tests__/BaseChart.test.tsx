import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BaseChart from '../BaseChart';
import { LineChart, Line } from 'recharts';

const mockData = [
  { date: '2025-12-01', value: 100 },
  { date: '2025-12-08', value: 110 },
  { date: '2025-12-15', value: 105 },
];

describe('BaseChart', () => {
  it('should render empty state when isEmpty is true', () => {
    render(<BaseChart isEmpty={true}>
      <div>Chart content</div>
    </BaseChart>);

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render custom empty message', () => {
    render(
      <BaseChart isEmpty={true} emptyMessage="Select an exercise to view data">
        <div>Chart content</div>
      </BaseChart>
    );

    expect(screen.getByText('Select an exercise to view data')).toBeInTheDocument();
  });

  it('should render chart container when data is available', () => {
    const { container } = render(
      <BaseChart isEmpty={false}>
        <LineChart data={mockData}>
          <Line type="monotone" dataKey="value" stroke="#3B82F6" />
        </LineChart>
      </BaseChart>
    );

    // ResponsiveContainer renders a div wrapper
    expect(container.firstChild).toBeInTheDocument();
    // The container should have the recharts responsive container
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('should use custom height', () => {
    const { container } = render(
      <BaseChart height={400} isEmpty={true}>
        <div>Chart content</div>
      </BaseChart>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '400px' });
  });

  it('should use default height of 300', () => {
    const { container } = render(
      <BaseChart isEmpty={true}>
        <div>Chart content</div>
      </BaseChart>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: '300px' });
  });
});
