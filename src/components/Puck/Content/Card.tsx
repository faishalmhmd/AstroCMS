import type { ComponentConfig, Slot } from '@measured/puck';
import type { CardProps } from '@/interface';
import { InputField } from '@/lib/tailwind/utilInput';

export const Card: ComponentConfig<CardProps> = {
  fields: {
    Content: {
      type: 'slot',
    },
    backgroundColor: InputField({
      label: 'Background',
      placeholder: 'Masukkan judul...',
      type: 'text',
    }),
    borderRadius: InputField({
      label: 'Input Text Here',
      placeholder: 'Masukkan judul...',
      type: 'text',
    }),
    padding: InputField({
      label: 'Input Text Here',
      placeholder: 'Masukkan judul...',
      type: 'number',
    }),
  },
  defaultProps: {
    backgroundColor: 'red',
    borderRadius: 0,
    padding: 0,
    Content: [],
  },
  render: ({ Content, backgroundColor, borderRadius, padding }) => {
    return (
      <div
        className={`${backgroundColor} ${borderRadius}`}
        style={{ padding: `${padding}px` }}
      >
        <Content />
      </div>
    );
  },
};
