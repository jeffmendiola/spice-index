import { useParams, Link } from 'react-router-dom';
import { useSpiceContext } from '../context/SpiceContext';
import type { Blend } from '../types';

const BlendDetail = () => {
  const { id } = useParams();
  const { spices, blends, isLoading, errors } = useSpiceContext();

  const blend = blends.find((b) => b.id === Number(id));

  if (isLoading.blends) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" />
    );
  }

  if (errors.blends) {
    return <div className="text-red-600">Error: {errors.blends}</div>;
  }

  if (!blend) {
    return <div className="text-gray-600">Blend not found</div>;
  }

  // Helper to get spice object
  const getSpice = (spiceId: number) => spices.find((s) => s.id === spiceId);

  // Helper for blend color gradient
  const getBlendColors = (blend: Blend) => {
    const colors = blend.spices
      .map((spiceId) => {
        const spice = getSpice(spiceId);
        return spice ? spice.color : null;
      })
      .filter(Boolean);
    if (colors.length === 0) return ['gray'];
    return colors;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-900 mb-4 block"
        >
          ← Back to Spice Collection
        </Link>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Blend Details</h2>
          <div className="space-y-4">
            {/* Name */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">Name</div>
              <div className="font-medium">{blend.name}</div>
            </div>
            {/* Color */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">Color</div>
              <div className="flex items-center">
                <div
                  className="w-5 h-5 rounded border border-gray-300 mr-2"
                  style={{
                    background: `linear-gradient(to right, ${getBlendColors(
                      blend,
                    )
                      .map((color) => `#${color}`)
                      .join(', ')})`,
                  }}
                />
                <span className="text-gray-700">
                  {getBlendColors(blend)
                    .map((color) => `#${color}`)
                    .join(', ')}
                </span>
              </div>
            </div>
            {/* Description */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">
                Description
              </div>
              <div>{blend.description}</div>
            </div>
            {/* Included Spices */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">
                Included Spices
              </div>
              <div className="space-y-2">
                {blend.spices.map((spiceId) => {
                  const spice = getSpice(spiceId);
                  return (
                    <div
                      key={spiceId}
                      className="flex items-center bg-white rounded px-3 py-2 border border-gray-200"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300 mr-2"
                        style={{ backgroundColor: `#${spice?.color || '888'}` }}
                      />
                      <span>{spice ? spice.name : 'Unknown Spice'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlendDetail;
