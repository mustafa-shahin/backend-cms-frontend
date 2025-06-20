import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CogIcon,
  BriefcaseIcon,
  SunIcon,
  MoonIcon,
  FolderIcon,
  PhotoIcon,
  DocumentIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  ClockIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UsersIcon as UsersIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  MapPinIcon as MapPinIconSolid,
  CogIcon as CogIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  FolderIcon as FolderIconSolid,
  PhotoIcon as PhotoIconSolid,
  DocumentIcon as DocumentIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  MusicalNoteIcon as MusicalNoteIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  ClockIcon as ClockIconSolid,
  PlayIcon as PlayIconSolid,
} from "@heroicons/react/24/solid";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count?: number;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "Pages",
    href: "/dashboard/pages",
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
  },
  {
    name: "Company",
    href: "/dashboard/company",
    icon: BuildingOfficeIcon,
    iconSolid: BuildingOfficeIconSolid,
  },
  {
    name: "Locations",
    href: "/dashboard/locations",
    icon: MapPinIcon,
    iconSolid: MapPinIconSolid,
  },
  {
    name: "Files",
    href: "/dashboard/files",
    icon: FolderIcon,
    iconSolid: FolderIconSolid,
    children: [
      {
        name: "All Files",
        href: "/dashboard/files",
        icon: FolderIcon,
        iconSolid: FolderIconSolid,
      },
      {
        name: "Folders",
        href: "/dashboard/files/folders",
        icon: FolderIcon,
        iconSolid: FolderIconSolid,
      },
      {
        name: "Documents",
        href: "/dashboard/files/documents",
        icon: DocumentIcon,
        iconSolid: DocumentIconSolid,
      },
      {
        name: "Photos",
        href: "/dashboard/files/photos",
        icon: PhotoIcon,
        iconSolid: PhotoIconSolid,
      },
      {
        name: "Videos",
        href: "/dashboard/files/videos",
        icon: VideoCameraIcon,
        iconSolid: VideoCameraIconSolid,
      },
      {
        name: "Audio",
        href: "/dashboard/files/audio",
        icon: MusicalNoteIcon,
        iconSolid: MusicalNoteIconSolid,
      },
      {
        name: "Archives",
        href: "/dashboard/files/archives",
        icon: ArchiveBoxIcon,
        iconSolid: ArchiveBoxIconSolid,
      },
    ],
  },
  {
    name: "Jobs",
    href: "/dashboard/jobs",
    icon: BriefcaseIcon,
    iconSolid: BriefcaseIconSolid,
    children: [
      {
        name: "Triggers",
        href: "/dashboard/jobs/triggers",
        icon: PlayIcon,
        iconSolid: PlayIconSolid,
      },
      {
        name: "Jobs History",
        href: "/dashboard/jobs/history",
        icon: ClockIcon,
        iconSolid: ClockIconSolid,
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href.split("#")[0]);
  };

  const isChildActive = (parentHref: string, children?: NavigationItem[]) => {
    if (!children) return false;
    return children.some((child) => isActive(child.href));
  };

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4 shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-sm font-semibold text-white">CMS</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            Backend CMS
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const hasActiveChild = isChildActive(item.href, item.children);
                const IconComponent =
                  active || hasActiveChild ? item.iconSolid : item.icon;

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                        active || hasActiveChild
                          ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 shrink-0 ${
                          active || hasActiveChild
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.count && (
                        <span
                          className={`ml-auto w-9 min-w-max whitespace-nowrap rounded-full px-2.5 py-0.5 text-center text-xs font-medium leading-5 ${
                            active || hasActiveChild
                              ? "bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </NavLink>

                    {/* Sub-menu items */}
                    {item.children && (active || hasActiveChild) && (
                      <ul className="mt-1 ml-6 space-y-1">
                        {item.children.map((child) => {
                          const childActive = isActive(child.href);
                          const ChildIcon = childActive
                            ? child.iconSolid
                            : child.icon;

                          return (
                            <li key={child.name}>
                              <NavLink
                                to={child.href}
                                className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors ${
                                  childActive
                                    ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"
                                }`}
                              >
                                <ChildIcon
                                  className={`h-5 w-5 shrink-0 ${
                                    childActive
                                      ? "text-primary-600 dark:text-primary-400"
                                      : "text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                                  }`}
                                  aria-hidden="true"
                                />
                                {child.name}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>

          <li className="mt-auto">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
              >
                {isDark ? (
                  <SunIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                ) : (
                  <MoonIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                )}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>

              {/* User Profile Section */}
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400"
              >
                <svg
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400"
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
