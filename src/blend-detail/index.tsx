import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSpiceContext } from '../context/SpiceContext';
import type { Blend } from '../types';
import { useState } from 'react';

const BlendDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spices, blends, isLoading, errors } = useSpiceContext();
  const [showAllSpices, setShowAllSpices] = useState(false);
  const [showAllBlends, setShowAllBlends] = useState(false);

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

  const getSpice = (spiceId: number) => spices.find((s) => s.id === spiceId);

  const getBlend = (blendId: number) => blends.find((b) => b.id === blendId);

  // Helper to recursively get all spices from a blend and its child blends
  const getAllSpices = (blend: Blend): number[] => {
    const directSpices = [...blend.spices];
    const childBlendSpices = blend.blends.flatMap((blendId) => {
      const childBlend = getBlend(blendId);
      return childBlend ? getAllSpices(childBlend) : [];
    });
    return [...new Set([...directSpices, ...childBlendSpices])];
  };

  const getBlendColorsGradient = (blend: Blend) => {
    const colors = blend.spices
      .map((spiceId) => {
        const spice = getSpice(spiceId);
        return spice ? spice.color : null;
      })
      .filter(Boolean);
    if (colors.length === 0) return ['gray'];
    return colors;
  };

  const allSpices = getAllSpices(blend);
  const displayedSpices = showAllSpices ? allSpices : allSpices.slice(0, 5);
  const displayedBlends = showAllBlends
    ? blend.blends
    : blend.blends.slice(0, 3);

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
          <h2 className="text-2xl font-bold mb-6">{blend.name}</h2>
          <div className="space-y-4">
            {/* Color */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">Color</div>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded border border-gray-300 mr-2"
                  style={{
                    background: `linear-gradient(to right, ${getBlendColorsGradient(
                      blend,
                    )
                      .map((color) => `#${color}`)
                      .join(', ')})`,
                  }}
                />
                <span className="text-gray-700">
                  {getBlendColorsGradient(blend)
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
            {/* Included Blends */}
            {blend.blends.length > 0 && (
              <div className="bg-gray-100 rounded p-4">
                <div className="font-semibold text-gray-700 mb-1">
                  Included Blends ({blend.blends.length})
                </div>
                <div className="space-y-2">
                  {displayedBlends.map((blendId) => {
                    const childBlend = getBlend(blendId);
                    return (
                      <Link
                        key={blendId}
                        to={`/blends/${blendId}`}
                        className="block bg-white rounded px-3 py-2 border border-gray-200 hover:border-indigo-500"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded mr-2 border border-gray-200 overflow-hidden"
                            style={{
                              background: `linear-gradient(to right, ${getBlendColorsGradient(
                                childBlend || blend,
                              )
                                .map((color) => `#${color}`)
                                .join(', ')})`,
                            }}
                          />
                          <span>
                            {childBlend ? childBlend.name : 'Unknown Blend'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {blend.blends.length > 3 && (
                    <button
                      onClick={() => setShowAllBlends(!showAllBlends)}
                      className="w-full mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      {showAllBlends
                        ? 'Show Less'
                        : `Show ${blend.blends.length - 3} More`}
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* All Included Spices */}
            <div className="bg-gray-100 rounded p-4">
              <div className="font-semibold text-gray-700 mb-1">
                All Included Spices ({allSpices.length})
              </div>
              <div className="space-y-2">
                {displayedSpices.map((spiceId) => {
                  const spice = getSpice(spiceId);
                  return (
                    <button
                      key={spiceId}
                      onClick={() => navigate(`/spices/${spiceId}`)}
                      className="w-full text-left bg-white rounded px-3 py-2 border border-gray-200 hover:border-indigo-500"
                    >
                      <div className="flex items-center">
                        <span
                          className="w-4 h-4 rounded border border-gray-300 mr-2"
                          style={{
                            backgroundColor: `#${spice?.color || '888'}`,
                          }}
                        />
                        <span>{spice ? spice.name : 'Unknown Spice'}</span>
                      </div>
                    </button>
                  );
                })}
                {allSpices.length > 5 && (
                  <button
                    onClick={() => setShowAllSpices(!showAllSpices)}
                    className="w-full mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    {showAllSpices
                      ? 'Show Less'
                      : `Show ${allSpices.length - 5} More`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlendDetail;
