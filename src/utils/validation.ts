export const validateBlendForm = (formData: {
  name: string;
  description: string;
  spices: number[];
}) => {
  const errors = {
    name: formData.name.trim() === '' ? 'Name is required' : '',
    description:
      formData.description.trim() === '' ? 'Description is required' : '',
    spices: formData.spices.length < 2 ? 'Select at least 2 spices' : '',
  };

  return {
    isValid: !Object.values(errors).some((error) => error !== ''),
    errors,
  };
};
