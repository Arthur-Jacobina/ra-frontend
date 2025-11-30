import { createRootRoute, Outlet } from '@tanstack/react-router';
import { createContext, useState } from 'react';
import { Drawer } from '@/components/drawer';
import { RegisterForm } from '@/components/register-form.component';

interface DrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

function RootComponent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} side="right" width="w-1/2">
        <RegisterForm />
      </Drawer>
      <Outlet />
    </DrawerContext.Provider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
