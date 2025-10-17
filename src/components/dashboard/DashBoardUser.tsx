/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { useAuthStore } from '@/stores/auth.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import EntityAvatar from '../shared/entity/Avatar';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UserDash() {
  const { user, me, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    me();
  }, []); // eslint-ignore deps

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );

  function updateWidth() {
    const el = triggerRef.current;
    if (el) setTriggerWidth(Math.ceil(el.getBoundingClientRect().width));
  }

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          ref={triggerRef}
          className='flex gap-3 items-center border cursor-pointer p-1 rounded-lg w-full hover:border-ring focus:border:ring hover:bg-transparent'
        >
          <EntityAvatar image={user?.image} name={user?.name} />
          <div className='flex flex-col'>
            <span className='font-bold line-clamp-1'>{user?.name}</span>
            <span className='text-muted-foreground line-clamp-1'>
              {user?.email}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='start'
        sideOffset={4}
        style={triggerWidth ? { width: triggerWidth } : undefined}
      >
        <DropdownMenuItem asChild className='w-full'>
          <button
            type='button'
            className='flex gap-2 items-center w-full'
            onClick={(e) => {
              e.preventDefault();
              navigate({ to: '/admin/profile' });
            }}
          >
            <User className='w-4 h-4 text-primary dark:text-secondary' />
            {t('common.profile')}
          </button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className='w-full'>
          <button
            type='button'
            className='flex gap-2 items-center w-full'
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <LogOut className='w-4 h-4 text-primary dark:text-secondary' />
            {t('common.logout')}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
