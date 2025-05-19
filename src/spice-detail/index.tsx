import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Spice } from '../types';

const SpiceDetail = () => {
  const { id } = useParams();
  const [spice, setSpice] = useState<Spice>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpice() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/spices/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const spiceData = await response.json();
        setSpice(spiceData);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to fetch spice',
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpice();
  }, [id]);

  const getPriceLevel = (price: string) => {
    return price ? price.length : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Spice Collection
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Spice Details
          </h2>

          {error && (
            <div className="text-red-600">Error loading spice: {error}</div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {!isLoading && !error && spice && (
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Name</span>
                <div className="text-gray-800 font-medium mt-1">
                  {spice.name}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Color</span>
                <div className="flex items-center mt-1">
                  <div
                    className="w-6 h-6 rounded mr-2 border border-gray-200"
                    style={{ backgroundColor: `#${spice.color}` }}
                  />
                  <span className="text-gray-800 font-medium">
                    #{spice.color}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Price</span>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`text-xl mr-1 flex items-center justify-center ${
                        index < getPriceLevel(spice.price)
                          ? 'text-green-500'
                          : 'text-gray-200'
                      }`}
                    >
                      $
                    </div>
                  ))}
                  <span className="ml-2 text-gray-800 font-medium">
                    {getPriceLevel(spice.price)} / 5
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Heat Level</span>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`text-xl mr-1 flex items-center justify-center ${
                        index < spice.heat ? 'opacity-100' : 'opacity-25'
                      }`}
                    >
                      🔥
                    </div>
                  ))}
                  <span className="ml-2 text-gray-800 font-medium">
                    {spice.heat} / 5
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpiceDetail;
