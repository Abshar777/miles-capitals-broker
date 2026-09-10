"use client"
import { Spinner } from '@heroui/react';
import React from 'react';

export const SkeletonCard: React.FC = () => (
  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center animate-pulse">
    <Spinner size='sm'/>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="overflow-x-auto animate-pulse">
    <div className="h-12 bg-muted/50 w-full" />
    <div className="divide-y divide-border">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="px-6 py-4 flex gap-4">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded flex-1" />
          <div className="h-8 w-20 bg-muted rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC = () => (
  <div className="w-full h-[300px] flex items-center justify-center flex-col gap-4 ">
   <Spinner/>
  </div>
);
