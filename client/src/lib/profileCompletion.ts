export function calculateCompletion(profile: any, role: 'parent' | 'caregiver'): number {
  if (!profile) return 0;

  const baseFields = ['firstName', 'lastName', 'email', 'phone', 'profilePhoto'];
  const caregiverFields = ['introVideo', 'experience', 'availability'];
  const parentFields = ['location', 'numberOfChildren', 'jobPreferences'];

  const fieldsToCheck = role === 'caregiver'
    ? [...baseFields, ...caregiverFields]
    : [...baseFields, ...parentFields];

  const filledCount = fieldsToCheck.filter((field) => {
    const value = profile[field];
    return value && value !== '' && value !== null && value !== undefined;
  }).length;
  
  const percent = Math.round((filledCount / fieldsToCheck.length) * 100);
  return percent;
}