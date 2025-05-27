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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/assets/fondo-pomasqui.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 800,
          position: 'relative',
        }}
      >
        <Stack
          spacing={3}
          sx={{
            background: 'rgb(21, 48, 99)',
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
              width: 210,
              mx: 'auto',
              marginBottom: 2,
              borderRadius: 2,
              transform: 'translateY(15px)', // Ajuste fino de alineación vertical
              flexShrink: 0,
              '@media (max-width: 400px)': {
                transform: 'translateY(0)',
                marginBottom: 2,
                width: 180,
              },
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

          <Divider sx={{ borderColor: 'rgba(242, 101, 58,0.6)' }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.username)}>
                    <InputLabel
                      sx={{
                        color: 'white',
                        '&.Mui-focused': {
                          color: 'rgba(242, 101, 58,0.9)',
                        },
                      }}
                    >
                      Username
                    </InputLabel>
                    <OutlinedInput
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(242, 101, 58,0.6)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(242, 101, 58,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(242, 101, 58,0.6)',
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
                        color: 'white',
                        '&.Mui-focused': {
                          color: 'rgba(242, 101, 58,0.9)',
                        },
                      }}
                    >
                      Contraseña
                    </InputLabel>
                    <OutlinedInput
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(242, 101, 58,0.6)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(242, 101, 58,0.6)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(242, 101, 58,0.6)',
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
                  background: 'rgba(242, 101, 58,0.85)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgb(250, 80, 28)',
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
