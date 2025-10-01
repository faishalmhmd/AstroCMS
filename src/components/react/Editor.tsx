import '@measured/puck/puck.css';
import { Puck, type Config, type Data } from '@measured/puck';
import { Header, Paragraph } from '@/components/Puck/Text';
import { Card } from '@/components/Puck/Content';
import { Grid, Flex, LeftSidebar } from '@/components/Puck/Layout';
import DrawerItem from '../Puck/DrawerItem';
import React, { useEffect, useState } from 'react';
import type { ComponentInterface, ComponentCategories } from '@/interface';
import axios from 'axios';

interface EditorProps {
  pageId?: string; // Optional page ID for edit mode
}

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

export function Editor({ pageId }: EditorProps): React.ReactElement {
  const [data, setData] = useState<Data<ComponentInterface>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!pageId);

  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  }, [pageId]);

  const loadPage = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/get-page/${id}`);
      if (response.data.success) {
        setData(response.data.page);
        console.log('✅ Page loaded successfully');
      } else {
        console.error('❌ Failed to load page:', response.data.error);
        setData(initialData);
        setIsEditMode(false);
      }
    } catch (error: any) {
      console.error('❌ Error loading page:', error.message || error);
      setData(initialData);
      setIsEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

const savePage = async (
  pageData: Data<ComponentInterface>
): Promise<void> => {
  try {
    let response;

    if (isEditMode && pageId) {
      response = await axios.put(`/api/update-page/${pageId}`, {
        ...pageData,
      });
      if (response.data.success) {
        console.log('✅ Page updated successfully');
      } else {
        console.error('❌ Failed to update page:', response.data.error);
      }
    } else {
      response = await axios.post('/api/pages/', pageData);
      if (response.data.success) {
        console.log('✅ Page created successfully. ID:', response.data.id);
        setIsEditMode(true);
        window.history.pushState({}, '', `/edit/${response.data.id}`);
      } else {
        console.error('❌ Failed to create page:', response.data.error);
      }
    }
  } catch (error: any) {
    console.error('❌ Error saving page:', error.message || error);
  }
};


  const handlePublish = (pageData: Data<ComponentInterface>): void => {
    console.log(pageData)
    console.log(`📤 ${isEditMode ? 'Updating' : 'Creating'} page...`);
    savePage(pageData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading page...</div>
      </div>
    );
  }

  return (
    <Puck
      config={config}
      data={data}
      onPublish={handlePublish}
      overrides={{
        drawerItem: ({ name }: { name: string }) => <DrawerItem name={name} />,
      }}
    />
  );
}
