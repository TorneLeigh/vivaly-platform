import { User } from '@shared/schema';

export function calculateProfileCompletion(user: User | null): number {
  if (!user) return 0;

  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.phone,
    user.profileImageUrl,
    user.resetToken,
    user.resetTokenExpiry,
    user.roles && user.roles.length > 0 ? user.roles : null,
  ];

  const completedFields = fields.filter(field => {
    if (typeof field === 'string') {
      return field && field.trim().length > 0;
    }
    if (Array.isArray(field)) {
      return field && field.length > 0;
    }
    return field !== null && field !== undefined;
  }).length;

  return Math.round((completedFields / fields.length) * 100);
}