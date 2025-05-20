'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/core/logo';

import { navItemsClient, navItemsMkt, navItemsUserTI } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  //const user: any = JSON.parse(localStorage.getItem('user')!);
  const { user, error, isLoading } = useUser();

  if (isLoading || !user) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: 'var(--SideNav-width)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--SideNav-background)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }
  let navItems: NavItemConfig[] = [];
  if (user?.rol_id === 1) {
    navItems = navItemsUserTI;
  } else if (user?.rol_id === 3) {
    navItems = navItemsMkt;
  } else {
    navItems = navItemsClient;
  }

  return (
    <Box
      sx={{
        background: `
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.05) 0px,
      rgba(255, 255, 255, 0.05) 2px,
      transparent 2px,
      transparent 6px
    ),
    linear-gradient(
      to bottom,
      rgba(10, 4, 44, 0.95) 0%,
      rgba(107, 51, 34, 0.64) 20%,
      rgba(214, 76, 34, 0.85) 45%,
      rgba(235, 14, 32, 0.75) 65%,
      rgba(172, 34, 34, 0.65) 100%
    )
  `,
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': '#f4d9db',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': ' #1e3353',
        '--NavItem-active-color': '#ffffff',
        '--NavItem-disabled-color': '#c58c8f',
        '--NavItem-icon-color': '#f3b8bc',
        '--NavItem-icon-active-color': '#ffffff',
        '--NavItem-icon-disabled-color': '#b37679',
        bgcolor: 'transparent',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: 2,
            backgroundColor: 'transparent',
          }}
        >
          <Logo
            color="light"
            sx={{
              height: 195,
              width: 90,
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: ' #1e3353',
            border: '1px solid var(--mui-palette-neutral-800)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              Usuario
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              {user ? user.nombre + ' ' + user.apellidos : null}
            </Typography>
          </Box>
          <CaretUpDownIcon />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-800)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-800)' }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;
    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--mui-palette-neutral-800)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--mui-palette-neutral-700)' : 'var(--mui-palette-neutral-800)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
