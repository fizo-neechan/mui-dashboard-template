import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Modal, Button, TextField, Select, MenuItem } from '@mui/material';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { useCreateUser } from '@/hooks/users/useUsers';
import { createUserSchema } from '@/lib/validations/user';

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateNewUserProps {
  open: boolean;
  onClose: () => void;
}

const CreateNewUser: React.FC<CreateNewUserProps> = ({ open, onClose }) => {
  const createUserMutation = useCreateUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      onClose();
      reset();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Name'
                fullWidth
                margin='dense'
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Email'
                fullWidth
                margin='dense'
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Password'
                type='password'
                fullWidth
                margin='dense'
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                margin='dense'
                error={!!errors.role}
              >
                <MenuItem value='USER'>User</MenuItem>
                <MenuItem value='MODERATOR'>Moderator</MenuItem>
                <MenuItem value='ADMIN'>Admin</MenuItem>
              </Select>
            )}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            style={{ marginTop: '10px' }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateNewUser;