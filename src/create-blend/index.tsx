import { useNavigate } from 'react-router-dom';
import { CreateBlendForm } from '../components/CreateBlendForm';

export function CreateBlend() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-900 mb-4 block"
        >
          ← Back
        </button>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Blend</h2>
          <CreateBlendForm onSuccess={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
}
