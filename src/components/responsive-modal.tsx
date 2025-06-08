import { useMedia } from 'react-use';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';

interface ResponsiveModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function ResponsiveModal({ isOpen, onOpenChange, children }: ResponsiveModalProps) {
  const isDesktop = useMedia('(min-width: 1024px)', true);

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh] ">
          <DialogTitle className="sr-only">Create Workspace</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTitle className="sr-only">Create Workspace</DrawerTitle>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh] ">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
