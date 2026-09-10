import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-80px)]'>
          <div className='flex flex-1 px-4 py-6 md:px-10 md:pt-6 md:pb-10'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 px-4 py-6 md:px-10 md:pt-6 md:pb-10'>{children}</div>
      )}
    </>
  );
}
