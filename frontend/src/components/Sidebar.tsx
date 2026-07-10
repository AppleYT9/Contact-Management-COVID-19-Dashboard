import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, BarChart3, Map, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import type { RootState } from '../redux/store';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { to: '/', label: 'Contacts', icon: Users },
    { to: '/charts', label: 'COVID Charts', icon: BarChart3 },
    { to: '/maps', label: 'COVID Map', icon: Map },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-900 flex flex-col h-screen sticky top-0 z-30 select-none">
      <div className="p-6 border-b border-slate-200 flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-bold text-white shadow-sm">
          C
        </div>
        <span className="text-base font-bold text-slate-950">
          COVID-19
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500 font-semibold shadow-inner'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        {user && (
          <div className="mb-4 px-3 py-2 bg-slate-100/50 rounded-lg border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{user.full_name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors font-semibold text-xs border border-slate-200 hover:border-rose-250 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
