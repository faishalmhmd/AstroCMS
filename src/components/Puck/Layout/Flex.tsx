import type { ComponentConfig, Slot } from '@measured/puck';
import { SelectField } from '@/lib/tailwind/utilInput';
import type { FlexProps } from '@/interface';

export const Flex: ComponentConfig<FlexProps> = {
  fields: {
    direction: SelectField({
      label: 'Flex Direction',
      options: [
        { label: 'Row', value: 'row' },
        { label: 'Column', value: 'column' },
      ],
      placeholder: 'Pilih direction...',
    }),
    justify: SelectField({
      label: 'Justify Content',
      options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Space Between', value: 'space-between' },
        { label: 'Space Around', value: 'space-around' },
        { label: 'Space Evenly', value: 'space-evenly' },
      ],
      placeholder: 'Pilih justify...',
    }),
    align: SelectField({
      label: 'Align Items',
      options: [
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Stretch', value: 'stretch' },
        { label: 'Baseline', value: 'baseline' },
      ],
      placeholder: 'Pilih align...',
    }),
    Content: {
      type: 'slot',
    },
  },

  defaultProps: {
    direction: 'row',
    justify: 'flex-start',
    align: 'stretch',
    Content: [],
  },

  render: (props) => {
    const { direction, justify, align, Content } = props;
    return (
      <Content
        style={{
          display: 'flex',
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
        }}
        collisionAxis="dynamic"
      />
    );
  },
};
