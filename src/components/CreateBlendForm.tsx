import { useState } from 'react';
import { useSpiceContext } from '../context/SpiceContext';
import { validateBlendForm } from '../utils/validation';
import { VALIDATION } from '../utils/constants';

interface CreateBlendFormProps {
  onSuccess?: () => void;
}

export function CreateBlendForm({ onSuccess }: CreateBlendFormProps) {
  const { spices, blends, addBlend } = useSpiceContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSpices, setSelectedSpices] = useState<number[]>([]);
  const [selectedBlends, setSelectedBlends] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    });
    setErrors(validationErrors);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newBlend = {
        name,
        description,
        spices: selectedSpices,
        blends: selectedBlends,
      };

      await addBlend(newBlend);
      setName('');
      setDescription('');
      setSelectedSpices([]);
      setSelectedBlends([]);
      setErrors({ name: '', description: '', spices: '' });
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create blend:', err);
    } finally {
      setIsSubmitting(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Blend Name <span className="text-gray-700">*</span>
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
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description <span className="text-gray-700">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
          rows={3}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 px-3 py-2 ${
            touched.description && errors.description
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-300 focus:border-indigo-500'
          }`}
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Spices <span className="text-gray-700">*</span>
          <span className="text-sm text-gray-500 ml-2">
            (Select at least {VALIDATION.MIN_SPICES})
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md border-gray-300">
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
              />
              <span className="text-sm text-gray-700">{spice.name}</span>
            </label>
          ))}
        </div>
        {touched.spices && errors.spices && (
          <p className="mt-1 text-sm text-red-600">{errors.spices}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Child Blends (Optional)
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md border-gray-300">
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
              />
              <span className="text-sm text-gray-700">{blend.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Blend'}
      </button>
    </form>
  );
}
