import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Modal, Button, TextField} from '@mui/material';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { useSnackbar } from '@/contexts/SnackbarContext';
import { useCreateUser } from '@/hooks/users/useUsers';
import { createUserSchema } from '@/lib/validations/user';

import RoleSelect from './RoleSelect';

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateNewUserProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues: CreateUserFormData = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
};

const CreateNewUser: React.FC<CreateNewUserProps> = ({ open, onClose }) => {
  const createUserMutation = useCreateUser();
  const {showSnackbar} = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      onClose();
      showSnackbar('New user Created successful');
      reset();
    } catch (error: unknown ) {
      if (error instanceof Error) {
        showSnackbar(error.message);
        onClose();

        return;
      }
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
          <RoleSelect control={control} errors={errors} />
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