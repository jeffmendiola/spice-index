import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Blend, Spice } from '../types';
import { data as spicesData } from '../mocks/data/spices';
import { data as blendsData } from '../mocks/data/blends';

// get blend API is at /api/v1/blends/:id
const BlendDetail = () => {
  const { id } = useParams();
  const [blend, setBlend] = useState<Blend>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const spices = spicesData();
  const blends = blendsData();

  useEffect(() => {
    async function fetchBlend() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/blends/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blendData = await response.json();
        setBlend(blendData);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch blend');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlend();
  }, [id]);

  const getSpiceName = (spiceId: number) => {
    const spice = spices.find(s => s.id === spiceId);
    return spice ? spice.name : 'Unknown Spice';
  };

  const getBlendName = (blendId: number) => {
    const foundBlend = blends.find(b => b.id === blendId);
    return foundBlend ? foundBlend.name : `Unknown Blend (${blendId})`;
  };

  const getBlendColors = (blend: Blend | undefined) => {
    if (!blend) return ['gray'];
    
    const colors = blend.spices.map(spiceId => {
      const spice = spices.find(s => s.id === spiceId);
      return spice ? spice.color : null;
    }).filter(Boolean);

    if (colors.length === 0) return ['gray'];
    return colors;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Spice Collection
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Blend Details</h2>
          
          {error && (
            <div className="text-red-600">Error loading blend: {error}</div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {!isLoading && !error && blend && (
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Name</span>
                <div className="flex items-center mt-1">
                  <div 
                    className="w-4 h-4 rounded mr-2 border border-gray-200 overflow-hidden" 
                    style={{ 
                      background: `linear-gradient(to right, ${getBlendColors(blend).map(color => `#${color}`).join(', ')})`
                    }}
                  />
                  <span className="text-gray-800 font-medium">{blend.name}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Description</span>
                <div className="text-gray-800 mt-1">{blend.description}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-600">Included Spices</span>
                <div className="mt-2 grid gap-2">
                  {blend.spices.map((spiceId) => (
                    <Link
                      key={spiceId}
                      to={`/spices/${spiceId}`}
                      className="flex items-center p-2 bg-white rounded border border-gray-200 hover:border-indigo-500 transition-colors"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2 border border-gray-200" 
                        style={{ 
                          backgroundColor: `#${spices.find(s => s.id === spiceId)?.color || 'gray'}`
                        }}
                      />
                      <span className="text-gray-800">{getSpiceName(spiceId)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {blend.blends.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-600">Included Blends</span>
                  <div className="mt-2 grid gap-2">
                    {blend.blends.map((blendId) => (
                      <Link
                        key={blendId}
                        to={`/blends/${blendId}`}
                        className="flex items-center p-2 bg-white rounded border border-gray-200 hover:border-indigo-500 transition-colors"
                      >
                        <div 
                          className="w-4 h-4 rounded mr-2 border border-gray-200 overflow-hidden" 
                          style={{ 
                            background: `linear-gradient(to right, ${getBlendColors(blends.find(b => b.id === blendId)).map(color => `#${color}`).join(', ')})`
                          }}
                        />
                        <span className="text-gray-800">{getBlendName(blendId)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlendDetail;
