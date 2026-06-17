'use client';

import LoadingAnimations from '@/components/ui/LoadingAnimations';
import s from './Demo.module.scss';

export default function DemoLoadingPage() {
  return (
    <div className={s.container}>
      <LoadingAnimations onComplete={() => {}} />
    </div>
  );
}
