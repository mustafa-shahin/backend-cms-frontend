import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UsersIcon as UsersIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  MapPinIcon as MapPinIconSolid,
  CogIcon as CogIconSolid,
} from '@heroicons/react/24/solid';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count?: number;
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid 
  },
  { 
    name: 'Pages', 
    href: '/dashboard/pages', 
    icon: DocumentTextIcon, 
    iconSolid: DocumentTextIconSolid 
  },
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: UsersIcon, 
    iconSolid: UsersIconSolid 
  },
  { 
    name: 'Company', 
    href: '/dashboard/company', 
    icon: BuildingOfficeIcon, 
    iconSolid: BuildingOfficeIconSolid 
  },
  { 
    name: 'Locations', 
    href: '/dashboard/locations', 
    icon: MapPinIcon, 
    iconSolid: MapPinIconSolid 
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-sm font-semibold text-white">CMS</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">Backend CMS</span>
        </div>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const IconComponent = active ? item.iconSolid : item.icon;
                
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                        active
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 shrink-0 ${
                          active ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.count && (
                        <span
                          className={`ml-auto w-9 min-w-max whitespace-nowrap rounded-full px-2.5 py-0.5 text-center text-xs font-medium leading-5 ${
                            active
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="border-t border-gray-200 pt-6">
              {/* User Profile Section */}
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600"
              >
                <svg
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;