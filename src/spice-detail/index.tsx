import { useParams, useNavigate } from 'react-router-dom';
import { useSpiceContext } from '../context/SpiceContext';

const SpiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spices, isLoading, errors } = useSpiceContext();

  const spice = spices.find((s) => s.id === Number(id));

  if (isLoading.spices) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" />
    );
  }

  if (errors.spices) {
    return <div className="text-red-600">Error: {errors.spices}</div>;
  }

  if (!spice) {
    return <div className="text-gray-600">Spice not found</div>;
  }

  // Helper for price display
  const getPriceLevel = (price: string) => (price ? price.length : 0);

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
          <h2 className="text-2xl font-bold mb-6">{spice.name}</h2>
          <div className="space-y-4">
            {/* Color */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">Color</div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded border border-gray-300 mr-2"
                  style={{ backgroundColor: `#${spice.color}` }}
                />
                <span className="text-gray-700">#{spice.color}</span>
              </div>
            </div>
            {/* Price */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">Price</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      opacity: i < getPriceLevel(spice.price) ? 1 : 0.3,
                      fontSize: '1.25rem',
                    }}
                  >
                    💲
                  </span>
                ))}
                <span className="ml-2 text-gray-500">
                  {getPriceLevel(spice.price)} / 5
                </span>
              </div>
            </div>
            {/* Heat Level */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">Heat Level</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      opacity: i < spice.heat ? 1 : 0.3,
                      fontSize: '1.25rem',
                    }}
                  >
                    🔥
                  </span>
                ))}
                <span className="ml-2 text-gray-500">{spice.heat} / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiceDetail;
