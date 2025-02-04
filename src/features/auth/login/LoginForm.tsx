'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm, FieldError, Merge, FieldErrorsImpl, SubmitHandler } from 'react-hook-form';

import { useSnackbar } from '@/contexts/SnackbarContext';
import { LoginInput, loginSchema } from '@/schemas/auth';

const getErrorMessage = (
  error: FieldError | Merge<FieldError, FieldErrorsImpl<LoginInput>> | undefined
): string | undefined => {
  return error?.message || undefined;
};

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setLoading(true);
    try {
      const login = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: '/',
      });

      if (!login?.ok) {
        throw new Error(login?.error || 'Login failed');
      }

      showSnackbar('Login successful');
      reset();
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        showSnackbar(error.message);

        return;
      }

      showSnackbar('Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Typography variant="h1">Login</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              variant="standard"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={getErrorMessage(errors.email)}
              {...register('email')}
            />
            <TextField
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={getErrorMessage(errors.password)}
              {...register('password')}
            />
            <Link href="#">Forgot Password?</Link>
            <Button type="submit" sx={{ mb: '12px' }}>
              {loading ? <CircularProgress size={20} /> : 'Login'}
            </Button>
          </form>
          <Typography variant="h6">
            Don’t have an account?{' '}
            <Link href="/signup" >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LoginForm;
