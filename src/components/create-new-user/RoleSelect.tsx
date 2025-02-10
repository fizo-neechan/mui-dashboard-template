import { Select, MenuItem, FormHelperText, FormControl } from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form'; 
import { z } from 'zod';

import { createUserSchema } from '@/lib/validations/user';

type CreateUserFormData = z.infer<typeof createUserSchema>;
interface RoleSelectProps {
  control: Control<CreateUserFormData>;
  errors: FieldErrors<CreateUserFormData>;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ control, errors }) => {
  return (
    <FormControl fullWidth margin='dense' error={!!errors.role}>
      <Controller
        name='role'
        control={control}
        render={({ field }) => (
          <>
            <Select {...field} fullWidth>
              <MenuItem value='USER'>User</MenuItem>
              <MenuItem value='MODERATOR'>Moderator</MenuItem>
              <MenuItem value='ADMIN'>Admin</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
          </>
        )}
      />
    </FormControl>
  );
};

export default RoleSelect;
