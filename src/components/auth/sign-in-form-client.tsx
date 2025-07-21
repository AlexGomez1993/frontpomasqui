'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { isCedulaEcuador, isPasaporte, isRucEcuador } from '@/utils/validationCI';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import axiosClient from '@/lib/axiosClient';
import { useUser } from '@/hooks/use-user';

import { NewClientForm } from './new-client.form';

const schema = zod.object({
  ruc: zod.string().min(6, { message: 'Campo requerido' }),
  password: zod.string().min(1, { message: 'Campo requerido' }),
});

type Values = zod.infer<typeof schema>;

export function SignInFormClient(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [clienteState, setClienteState] = React.useState<null | { estado: number }>({ estado: 0 });
  const [openDialog, setOpenDialog] = React.useState(false);
  const [cliente, setCliente] = React.useState<{ ciRuc: string }>({ ciRuc: '' });
  const [validado, setValidado] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { ruc: '', password: '' },
  });

  const rucValue = watch('ruc');

  const handleValidarRuc = async () => {
    if (!rucValue) {
      setError('ruc', { message: 'Debe ingresar su número de identificación' });
      return;
    }
    const isValid = isCedulaEcuador(rucValue) || isRucEcuador(rucValue) || isPasaporte(rucValue);

    if (!isValid) {
      setError('ruc', { message: 'Identificación inválida' });
      return;
    }

    try {
      setIsPending(true);
      const res = await axiosClient.post('/api/auth/validarCliente', { ruc: rucValue });

      const data = res.data;
      setClienteState(data);
      setCliente({ ciRuc: rucValue });
      setValidado(true);
    } catch (err: any) {
      console.error('Error al validar cliente:', err);
      if (err.response.data.estado === 2) {
        setOpenDialog(true);
      }
    } finally {
      setIsPending(false);
    }
  };
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signInClientWithPassword(values);

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
              zIndex: 1,
            }}
          >
            Iniciar Sesión
          </Typography>
          <Divider sx={{ borderColor: 'rgba(242, 101, 58,0.6)' }} />

          <form onSubmit={handleSubmit(onSubmit)} style={{ zIndex: 1, position: 'relative' }}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="ruc"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.ruc)}>
                    <InputLabel
                      sx={{
                        color: 'white',
                        '&.Mui-focused': {
                          color: 'rgba(242, 101, 58,0.9)',
                        },
                      }}
                    >
                      C.I. / Pasaporte
                    </InputLabel>
                    <OutlinedInput
                      {...field}
                      label="C.I./ Pasaporte"
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
                    />
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      * Recuerda si tienes pasaporte anteponer la letra P *
                    </Typography>
                    {errors.ruc && (
                      <Typography variant="caption" color="error">
                        {errors.ruc.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              {!validado && (
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
                  variant="outlined"
                  onClick={handleValidarRuc}
                  disabled={isPending}
                >
                  {isPending ? <CircularProgress size={20} /> : 'Siguiente'}
                </Button>
              )}

              {(clienteState?.estado === 1 || clienteState?.estado === 3) && (
                <>
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
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            showPassword ? (
                              <Eye onClick={() => setShowPassword(false)} />
                            ) : (
                              <EyeSlash onClick={() => setShowPassword(true)} />
                            )
                          }
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
                        />
                        {errors.password && (
                          <Typography variant="caption" color="error">
                            {errors.password.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Link
                    component={RouterLink}
                    href={paths.auth.resetPassword}
                    variant="subtitle2"
                    sx={{ color: 'white' }}
                  >
                    ¿Olvidaste tu Contraseña?
                  </Link>

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
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                  >
                    {isPending ? <CircularProgress size={20} /> : 'Ingresar'}
                  </Button>
                </>
              )}

              {clienteState?.estado === 1 && (
                <Alert severity="info">
                  Usted fue registrado en la isla de atención al cliente del centro comercial. Su clave es su número de
                  identificación. Recomendamos cambiarla en el módulo Perfil → Cambiar contraseña.
                </Alert>
              )}

              {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
            </Stack>
          </form>

          <NewClientForm
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            ciRuc={rucValue}
            setClienteState={setClienteState}
            onSubmitAfterCreate={onSubmit}
          />
        </Stack>
      </Box>

    </Box>
  );
}
