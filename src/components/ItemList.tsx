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
    <section aria-labelledby={`${title.toLowerCase()}-heading`}>
      <h2
        id={`${title.toLowerCase()}-heading`}
        className="text-xl font-semibold mb-4"
      >
        {title} ({items.length})
      </h2>
      <ul
        role="list"
        className="space-y-2"
        aria-label={`List of ${title.toLowerCase()}`}
      >
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={getItemLink(item)}
              className="block bg-white rounded px-3 py-2 border border-gray-200 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label={`View details for ${item.name}`}
            >
              {renderItem(item)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
