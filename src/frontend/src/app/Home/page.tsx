"use client"; // Adicione esta linha no topo do arquivo

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import Header from './components/Header';

export default function Home() {

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex gap-4'>
        <aside className='bg-white'>
          <LeftSidebar />
        </aside>
    
        <aside className='bg-white'>
          <RightSidebar />
        </aside>

        <div className='flex-1 overflow-y-auto px-4 py-6'>
            <Feed />
        </div>
      </div>  
      
    </div>
  );
}