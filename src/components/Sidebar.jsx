import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, MenuSquare, 
  Settings, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { projects } = useProjects();
  
  return (
    <aside className="w-64 bg-sidebar border-r border-borderLight flex flex-col h-full sticky top-0 md:flex shrink-0">
      <div className="p-5 flex flex-col gap-4">
        {/* Profile Block */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-gray-500 text-sm tracking-widest shrink-0">
            JM
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-textMain text-sm truncate">Judha Maygustya</h3>
            <p className="text-[11px] text-textMuted truncate">judha@emura.studio</p>
          </div>
          <button className="text-textMuted hover:text-textMain"><ChevronRight className="w-4 h-4 p-0.5" /></button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-surface border border-borderLight rounded-md py-1.5 pl-3 pr-8 text-xs placeholder:text-textSoft focus:outline-none focus:border-primary/50 text-textMain shadow-sm"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-1">
            <span className="border border-borderLight rounded px-1 text-[9px] text-textSoft flex items-center shadow-sm">⌘</span>
            <span className="border border-borderLight rounded px-1 text-[9px] text-textSoft flex items-center shadow-sm">K</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-6">
        {/* Main Menu */}
        <div>
          <h4 className="text-[10px] font-bold text-textSoft tracking-widest uppercase mb-3">Main Menu</h4>
          <nav className="space-y-1">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary/5 text-primary font-medium' : 'text-textMuted hover:bg-cardHover hover:text-textMain'}`}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary/5 text-primary font-medium' : 'text-textMuted hover:bg-cardHover hover:text-textMain'}`}>
              <MenuSquare className="w-4 h-4" /> All Projects
            </NavLink>
          </nav>
        </div>

        {/* My Projects */}
        <div>
          <h4 className="text-[10px] font-bold text-textSoft tracking-widest uppercase mb-3">My Projects</h4>
          <nav className="space-y-1">
            {projects && projects.length > 0 ? projects.map((item) => (
              <NavLink key={item.id} to={`/projects/${item.id}/board`} className={({ isActive }) => `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary/5 text-primary font-medium' : 'text-textMuted hover:bg-cardHover hover:text-textMain'}`}>
                <span className="w-4 h-4 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] text-gray-400 font-bold tracking-tighter truncate shrink-0">
                    {item.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="truncate">{item.name}</span>
              </NavLink>
            )) : (
                <div className="px-2 py-2 text-xs text-textSoft italic">No projects yet</div>
            )}
          </nav>
        </div>
      </div>

      <div className="p-5 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-2 py-2 rounded-lg w-full text-textMain text-sm font-medium hover:bg-cardHover transition-colors"
        >
          <Settings className="w-4 h-4 text-textMuted" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
