export const validateBlendForm = (formData: {
  name: string;
  description: string;
  spices: number[];
  blends: number[];
}) => {
  const errors = {
    name: formData.name.trim() === '' ? 'Name is required' : '',
    description:
      formData.description.trim() === '' ? 'Description is required' : '',
    spices:
      formData.spices.length < 2 && formData.blends.length === 0
        ? 'Select at least 2 spices or 1 blend'
        : '',
  };

  return {
    isValid: !Object.values(errors).some((error) => error !== ''),
    errors,
  };
};
