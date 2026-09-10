import { Icons } from '@/components/icons';
import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'Profile',
      name: 'Profile',
      section: 'other',
      icon: "user",
      perform: () => router.push('/profile')
    },
    {
      id: 'Settings',
      name: 'Settings',
      section: 'other',
      icon: "settings",
      perform: () => router.push('/settings')
    },
    {
      id: 'toggleTheme',
      name: 'Toggle Theme',
      shortcut: ['t', 't'],
      icon: "theme",
      section: 'Theme',
      perform: toggleTheme
    },
    {
      id: 'setLightTheme',
      name: 'Set Light Theme',
      section: 'Theme',
      icon: "lightMode",
      perform: () => setTheme('light')
    },
    {
      id: 'setDarkTheme',
      name: 'Set Dark Theme',
      section: 'Theme',
      icon: "darkMode",
      perform: () => setTheme('dark')
    },
    

  ];

  useRegisterActions(themeAction as any[], [theme]);
};

export default useThemeSwitching;
