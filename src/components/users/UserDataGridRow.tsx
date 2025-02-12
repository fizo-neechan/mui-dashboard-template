const formatDate = (dateString: Date) => {
  if (!dateString) return '';

  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDataGridRowProps {
  user: User;
  index: number;
}

export const UserDataGridRow = ({ user, index }: UserDataGridRowProps) => {
  return {
    id: user.id || index,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  };
};