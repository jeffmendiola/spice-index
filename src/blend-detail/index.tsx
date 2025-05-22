import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlend } from '../hooks/useBlend';
import { useBlends } from '../hooks/useBlend';
import type { BlendWithSpices, Blend } from '../types';
import { useState } from 'react';
import { getBlendColors, formatColorsForGradient } from '../utils/colors';

const BlendDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllSpices, setShowAllSpices] = useState(false);
  const [showAllBlends, setShowAllBlends] = useState(false);

  const {
    data: blend,
    isLoading: isLoadingBlend,
    error: blendError,
  } = useBlend(Number(id));
  const { data: blends = [] } = useBlends();

  if (isLoadingBlend) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" />
    );
  }

  if (blendError) {
    return <div className="text-red-600">Error: {blendError.message}</div>;
  }

  if (!blend || !blends) {
    return <div className="text-gray-600">Blend not found</div>;
  }

  const getBlend = (blendId: number) => blends.find((b) => b.id === blendId);
  const blendWithSpices = blend as BlendWithSpices;
  const displayedSpices = showAllSpices
    ? blendWithSpices.allSpices
    : blendWithSpices.allSpices.slice(0, 5);
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
                    background: `linear-gradient(to right, ${formatColorsForGradient(
                      getBlendColors(blend, blendWithSpices.allSpices, blends),
                    )})`,
                  }}
                />
                <span className="text-gray-700">
                  {formatColorsForGradient(
                    getBlendColors(blend, blendWithSpices.allSpices, blends),
                  )}
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
                              background: `linear-gradient(to right, ${formatColorsForGradient(
                                getBlendColors(
                                  childBlend || blend,
                                  blendWithSpices.allSpices,
                                  blends,
                                ),
                              )})`,
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
                All Included Spices ({blendWithSpices.allSpices.length})
              </div>
              <div className="space-y-2">
                {displayedSpices.map((spice) => (
                  <button
                    key={spice.id}
                    onClick={() => navigate(`/spices/${spice.id}`)}
                    className="w-full text-left bg-white rounded px-3 py-2 border border-gray-200 hover:border-indigo-500"
                  >
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded border border-gray-300 mr-2"
                        style={{
                          backgroundColor: `#${spice.color}`,
                        }}
                      />
                      <span>{spice.name}</span>
                    </div>
                  </button>
                ))}
                {blendWithSpices.allSpices.length > 5 && (
                  <button
                    onClick={() => setShowAllSpices(!showAllSpices)}
                    className="w-full mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    {showAllSpices
                      ? 'Show Less'
                      : `Show ${blendWithSpices.allSpices.length - 5} More`}
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
