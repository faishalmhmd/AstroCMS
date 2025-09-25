import '@measured/puck/puck.css';
import { Puck, type Config, type Data } from '@measured/puck';
import { Header, Paragraph } from '@/components/Puck/Text';
import { Card } from '@/components/Puck/Content';
import { Grid, Flex, LeftSidebar } from '@/components/Puck/Layout';
import DrawerItem from '../Puck/DrawerItem';
import React from 'react';
import type { ComponentInterface, ComponentCategories } from '@/interface';
import axios from 'axios';

const savePage = async (pageData: Data<ComponentInterface>): Promise<void> => {
  try {
    const response = await axios.post('/api/save-page', pageData);
    if (response.data.success) {
      console.log('✅ Data berhasil disimpan. ID:', response.data.id);
    } else {
      console.error('❌ Gagal menyimpan data:', response.data.error);
    }
  } catch (error: any) {
    console.error(
      '❌ Error saat menyimpan ke backend:',
      error.message || error
    );
  }
};

const config: Config<ComponentInterface, {}, ComponentCategories> = {
  categories: {
    layout: {
      title: 'Layout',
      components: ['Grid', 'Flex', 'LeftSidebar'],
    },
    text: {
      title: 'Text',
      components: ['Header', 'Paragraph'],
    },
    content: {
      title: 'Content',
      components: ['Card'],
    },
  },
  components: {
    Header,
    Paragraph,
    Grid,
    Flex,
    LeftSidebar,
    Card,
  },
};

const initialData: Data<ComponentInterface> = {
  content: [],
  root: { props: {} },
};

const save = (data: Data<ComponentInterface>): void => {
  console.log('📤 Menyimpan data editor...');
  savePage(data);
};

export function Editor(): React.ReactElement {
  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={save}
      overrides={{
        drawerItem: ({ name }: { name: string }) => <DrawerItem name={name} />,
      }}
    />
  );
}
