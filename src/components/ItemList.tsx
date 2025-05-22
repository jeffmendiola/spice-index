import React from 'react';
import { Link } from 'react-router-dom';

interface Item {
  id: number;
  name: string;
}

interface ItemListProps<T extends Item> {
  items: T[];
  title: string;
  renderItem: (item: T) => React.ReactNode;
  getItemLink: (item: T) => string;
}

export function ItemList<T extends Item>({
  items,
  title,
  renderItem,
  getItemLink,
}: ItemListProps<T>) {
  return (
    <section
      aria-labelledby={`${title.toLowerCase()}-heading`}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2
        id={`${title.toLowerCase()}-heading`}
        className="text-2xl font-semibold text-gray-800 mb-4"
      >
        {title} {items.length > 0 && `(${items.length})`}
      </h2>
      {items.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No {title.toLowerCase()} found matching your search.
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 p-1"
          role="list"
          aria-label={`List of ${title.toLowerCase()}`}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={getItemLink(item)}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label={`View details for ${item.name}`}
            >
              {renderItem(item)}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
