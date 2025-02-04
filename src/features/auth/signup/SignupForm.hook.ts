
import { useMutation } from '@tanstack/react-query';

import { RegisterInput } from '@/schemas/auth';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (formData: RegisterInput) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      return response.json();
    },
    onSuccess: () => {},
    onError: () => {},
  });
};
