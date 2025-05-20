'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divider } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  username: zod.string().min(1, { message: 'Username is required' }),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { username: 'prueba', password: '1234' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signInWithPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      await checkSession?.();

      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/assets/fondo-pomasqui.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0.5,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '100vh',
          p: 2,
        }}
      >
        <Stack
          spacing={3}
          sx={{
            background: `
        repeating-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.04) 0px,
          rgba(255, 255, 255, 0.04) 2px,
          transparent 2px,
          transparent 6px
        ),
        linear-gradient(145deg, rgba(224, 108, 74, 0.9) 0%, rgba(15, 26, 43, 0.9) 100%)
      `,
            borderRadius: 3,
            p: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            width: '100%',
            maxWidth: 450,
            color: 'white',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(32, 7, 7, 0.15)',
          }}
        >
          <Box
            component="img"
            src="/assets/logo-pomasqui.png"
            alt="Logo"
            sx={{
              width: 180,
              height: 110,
              objectFit: 'contain',
              display: 'block',
              mx: 'auto',
              borderRadius: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'common.white',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Iniciar Sesión
          </Typography>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.username)}>
                    <InputLabel
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-focused': {
                          color: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Username
                    </InputLabel>
                    <OutlinedInput
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(51,0,27,0.7)',
                          borderWidth: '2px',
                        },
                      }}
                      {...field}
                      label="Username"
                    />
                    {errors.username && <FormHelperText>{errors.username.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.password)}>
                    <InputLabel
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-focused': {
                          color: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Contraseña
                    </InputLabel>
                    <OutlinedInput
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(51,0,27,0.7)',
                          borderWidth: '2px',
                        },
                      }}
                      {...field}
                      endAdornment={
                        showPassword ? (
                          <EyeIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <EyeSlashIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={() => setShowPassword(true)}
                          />
                        )
                      }
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              {errors.root && <Alert color="error">{errors.root.message}</Alert>}
              <Button
                sx={{
                  background: 'rgba(51,0,27,0.85)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(51,0,27,1)',
                    boxShadow: '0 4px 15px rgba(51,0,27,0.4)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                disabled={isPending}
                type="submit"
                variant="contained"
              >
                Ingresar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Box>
  );
}
