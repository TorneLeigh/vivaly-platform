import { User } from '@shared/schema';

export function calculateProfileCompletion(user: User | null): number {
  if (!user) return 0;

  // Only count meaningful profile fields that users actually fill out (excluding auto-generated data)
  const fields = [
    user.phone,
    user.profileImageUrl,
  ];

  const completedFields = fields.filter(field => {
    if (typeof field === 'string') {
      return field && field.trim().length > 0;
    }
    return field !== null && field !== undefined;
  }).length;

  // Don't count firstName, lastName, email and roles as they're automatically set during registration
  return Math.round((completedFields / fields.length) * 100);
}