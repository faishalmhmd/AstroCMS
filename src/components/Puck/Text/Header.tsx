import { fontBold, fontSize, fontColor } from '@/lib/tailwind/utilFont';
import { InputField } from '@/lib/tailwind/utilInput';
import type { ComponentConfig } from '@measured/puck';
import type { HeaderProps } from '@/interface';

export const Header: ComponentConfig<HeaderProps> = {
  fields: {
    inputTitle: InputField({
      label: 'Input Text Here',
      placeholder: 'Masukkan judul...',
      type: 'text',
    }),
    fontBold,
    fontSize,
    fontColor,
  },
  defaultProps: {
    inputTitle: 'Input Text Here',
    fontBold: '',
    fontSize: '',
    fontColor: '',
  },
  render: (props) => {
    const { inputTitle, fontBold, fontSize, fontColor } = props;
    return (
      <div
        className={[fontBold, fontSize, fontColor].filter(Boolean).join(' ')}
      >
        <h1>{inputTitle}</h1>
      </div>
    );
  },
};
