import { User } from '@shared/schema';

export function calculateProfileCompletion(user: any): number {
  if (!user) return 0;

  // Check if user has the expected properties
  const hasPhone = user.phone && typeof user.phone === 'string' && user.phone.trim().length > 0;
  const hasProfileImage = user.profileImageUrl && typeof user.profileImageUrl === 'string' && user.profileImageUrl.trim().length > 0;

  // Count completed optional fields only
  let completedFields = 0;
  if (hasPhone) completedFields++;
  if (hasProfileImage) completedFields++;

  const totalOptionalFields = 2; // phone and profileImageUrl

  // Return 0% if no optional fields are completed
  if (completedFields === 0) return 0;

  return Math.round((completedFields / totalOptionalFields) * 100);
}