export function calculateCompletion(profile: any, role: 'parent' | 'caregiver'): number {
  const baseFields = ['firstName', 'lastName', 'email', 'phone', 'profilePhoto'];
  const caregiverFields = ['introVideo', 'experience', 'availability'];
  const parentFields = ['location', 'numberOfChildren', 'jobPreferences'];

  const fieldsToCheck = role === 'caregiver'
    ? [...baseFields, ...caregiverFields]
    : [...baseFields, ...parentFields];

  const filledCount = fieldsToCheck.filter((field) => profile[field]).length;
  const percent = Math.round((filledCount / fieldsToCheck.length) * 100);
  return percent;
}