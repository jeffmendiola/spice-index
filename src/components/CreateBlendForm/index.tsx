import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { validateBlendForm } from '../../utils/validation';
import { VALIDATION } from '../../utils/constants';
import type { Blend } from '../../types';

interface CreateBlendFormProps {
  onSuccess?: () => void;
}

const useBlendForm = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSpices, setSelectedSpices] = useState<number[]>([]);
  const [selectedBlends, setSelectedBlends] = useState<number[]>([]);
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    spices: false,
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    spices: '',
  });

  const addBlendMutation = useMutation<Blend, Error, Omit<Blend, 'id'>>({
    mutationFn: (newBlend) => api.blends.create(newBlend),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blends'] });
      onSuccess?.();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      description: true,
      spices: true,
    });

    const { isValid, errors: validationErrors } = validateBlendForm({
      name,
      description,
      spices: selectedSpices,
      blends: selectedBlends,
    });
    setErrors(validationErrors);

    if (!isValid) {
      return;
    }

    try {
      const newBlend = {
        name,
        description,
        spices: selectedSpices,
        blends: selectedBlends,
      };

      await addBlendMutation.mutateAsync(newBlend);
      setName('');
      setDescription('');
      setSelectedSpices([]);
      setSelectedBlends([]);
      setErrors({ name: '', description: '', spices: '' });
    } catch (err) {
      console.error('Failed to create blend:', err);
    }
  };

  const toggleSpice = (spiceId: number) => {
    setSelectedSpices((prev) =>
      prev.includes(spiceId)
        ? prev.filter((id) => id !== spiceId)
        : [...prev, spiceId],
    );
    setTouched((prev) => ({ ...prev, spices: true }));
  };

  const toggleBlend = (blendId: number) => {
    setSelectedBlends((prev) =>
      prev.includes(blendId)
        ? prev.filter((id) => id !== blendId)
        : [...prev, blendId],
    );
  };

  return {
    name,
    setName,
    description,
    setDescription,
    selectedSpices,
    selectedBlends,
    touched,
    errors,
    handleSubmit,
    toggleSpice,
    toggleBlend,
    setTouched,
    addBlendMutation,
  };
};

export function CreateBlendForm({ onSuccess }: CreateBlendFormProps) {
  const { data: spices = [] } = useQuery({
    queryKey: ['spices'],
    queryFn: api.spices.getAll,
  });
  const { data: blends = [] } = useQuery({
    queryKey: ['blends'],
    queryFn: api.blends.getAll,
  });

  const {
    name,
    setName,
    description,
    setDescription,
    selectedSpices,
    selectedBlends,
    touched,
    errors,
    handleSubmit,
    toggleSpice,
    toggleBlend,
    setTouched,
    addBlendMutation,
  } = useBlendForm(onSuccess);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Create new blend form"
      noValidate
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Blend Name{' '}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 px-3 py-2 ${
            touched.name && errors.name
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500'
          }`}
          aria-invalid={touched.name && errors.name ? 'true' : 'false'}
          aria-describedby={
            touched.name && errors.name ? 'name-error' : undefined
          }
          required
        />
        {touched.name && errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description{' '}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 px-3 py-2 ${
            touched.description && errors.description
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500'
          }`}
          aria-invalid={
            touched.description && errors.description ? 'true' : 'false'
          }
          aria-describedby={
            touched.description && errors.description
              ? 'description-error'
              : undefined
          }
          required
        />
        {touched.description && errors.description && (
          <p
            id="description-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            Select Spices{' '}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
            <span className="text-sm text-gray-500 ml-2">
              (Select at least 2 spices or 1 blend)
            </span>
          </legend>
          <div
            className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md border-gray-300"
            role="group"
            aria-describedby={
              touched.spices && errors.spices ? 'spices-error' : undefined
            }
          >
            {spices.map((spice) => (
              <label
                key={spice.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSpices.includes(spice.id)}
                  onChange={() => toggleSpice(spice.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label={`Select ${spice.name}`}
                />
                <span className="text-sm text-gray-700">{spice.name}</span>
              </label>
            ))}
          </div>
          {touched.spices && errors.spices && (
            <p
              id="spices-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.spices}
            </p>
          )}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            Select Child Blends (Optional)
          </legend>
          <div
            className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md border-gray-300"
            role="group"
          >
            {blends.map((blend) => (
              <label
                key={blend.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBlends.includes(blend.id)}
                  onChange={() => toggleBlend(blend.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label={`Select ${blend.name}`}
                />
                <span className="text-sm text-gray-700">{blend.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <button
          type="submit"
          disabled={addBlendMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={addBlendMutation.isPending}
        >
          {addBlendMutation.isPending ? 'Creating...' : 'Create Blend'}
        </button>
      </div>
    </form>
  );
}
