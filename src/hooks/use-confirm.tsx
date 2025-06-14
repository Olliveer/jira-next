'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VariantProps } from 'class-variance-authority';
import { JSX, useState } from 'react';

interface UseConfirmProps {
  title: string;
  message: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export const useConfirm = ({
  title,
  message,
  variant = 'default',
}: UseConfirmProps): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => {
    return new Promise(resolve => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true);
      handleClose();
    }
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(false);
      handleClose();
    }
  };

  const ConfirmationDialog = () => (
    <ResponsiveModal isOpen={promise !== null} onOpenChange={handleClose}>
      <Card className="w-ful h-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle className="">{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
            <Button onClick={handleCancel} variant="outline" className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant={variant} className="w-full lg:w-auto">
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
