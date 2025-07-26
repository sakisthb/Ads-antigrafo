import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small badge component for displaying status, categories, or labels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Status: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="bg-green-100 text-green-800">Active</Badge>
      <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      <Badge className="bg-red-100 text-red-800">Stopped</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of badges used for campaign status in the application.',
      },
    },
  },
};