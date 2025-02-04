'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FieldError, Merge, FieldErrorsImpl, SubmitHandler } from 'react-hook-form';

import { RegisterInput, registerSchema } from '@/schemas/auth';

import { useRegister } from './SignupForm.hook';
import { useSnackbar } from '../../../contexts/SnackbarContext';

const getErrorMessage = (
  error: FieldError | Merge<FieldError, FieldErrorsImpl<RegisterInput>> | undefined
): string | undefined => {
  return error?.message || undefined;
};

const defaultValues: RegisterInput = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignupForm = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues
  });

  const { mutate: submitForm, isPending: isLoading } = useRegister();
  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    submitForm(data, {
      onSuccess: () => {
        showSnackbar('Please check your email to verify your account!');
        reset();
        router.push('/login');

      },
      onError: () => {
        showSnackbar('Failed to Register. Please try again later!');
      }
    });
  };

  return (
    <>
      <Box>
        <Box>
          <Typography variant="h1">Signup</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name*"
              variant="standard"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={getErrorMessage(errors.name)}
              {...register('name')}
            />
            <TextField
              label="Email*"
              variant="standard"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={getErrorMessage(errors.email)}
              {...register('email')}
            />
            <TextField
              label="Password*"
              type="password"
              variant="standard"
              fullWidth
              autoComplete='new-password'
              margin="normal"
              error={!!errors.password}
              helperText={getErrorMessage(errors.password)}
              {...register('password')}
            />
            <TextField
              label="Confirm Password*"
              type="password"
              variant="standard"
              autoComplete='new-password'
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={getErrorMessage(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
            <Button type="submit" sx={{ mb: '12px' }}>
              {isLoading ? <CircularProgress size={20} /> : 'SIGNUP'}
            </Button>
          </form>
          <Typography variant="h6">
            Don’t have an account?{' '}
            <Link href="/signup">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SignupForm;
