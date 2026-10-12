import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

// The ScrollArea class stops Radix's display:table wrapper from growing to the widest child,
// so wide tables scroll inside themselves instead of widening the page on phones.
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
        <ScrollArea className='h-[calc(100dvh-80px)] [&_[data-radix-scroll-area-viewport]>div]:!block'>
          <div className='flex flex-1 min-w-0 px-4 py-6 md:px-10 md:pt-6 md:pb-10'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 min-w-0 px-4 py-6 md:px-10 md:pt-6 md:pb-10'>{children}</div>
      )}
    </>
  );
}
