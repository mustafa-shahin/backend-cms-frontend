// src/components/ui/Dropdown.tsx
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface DropdownItem {
  id: string | number;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
  className = '',
}) => {
  const placementClasses = {
    'bottom-start': 'left-0 mt-2',
    'bottom-end': 'right-0 mt-2',
    'top-start': 'left-0 mb-2 bottom-full',
    'top-end': 'right-0 mb-2 bottom-full',
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <Menu.Button as={Fragment}>
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className={`absolute z-10 ${placementClasses[placement]} w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 focus:outline-none`}
        >
          <div className="py-1">
            {items.map((item) => (
              <Menu.Item key={item.id} disabled={item.disabled}>
                {({ active }) => (
                  <button
                    className={clsx(
                      'group flex w-full items-center px-4 py-2 text-sm',
                      {
                        'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100': active,
                        'text-gray-700 dark:text-gray-300': !active,
                        'opacity-50 cursor-not-allowed': item.disabled,
                      }
                    )}
                    onClick={item.onClick}
                    disabled={item.disabled}
                  >
                    {item.icon && (
                      <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    )}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;