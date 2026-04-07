import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Bookmark, Share2, MoreHorizontal } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-14 bg-surface/50 border-b border-borderLight/50 flex items-center justify-between px-6 sticky top-0 z-20 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="text-textSoft hover:text-textMain"><ChevronLeft className="w-4 h-4" /></button>
          <button className="text-textSoft hover:text-textMain"><ChevronRight className="w-4 h-4" /></button>
        </div>
        
        <div className="flex items-center text-sm font-medium gap-2">
          <span className="text-textMuted cursor-pointer hover:text-textMain">My Pages</span>
          <span className="text-textSoft">/</span>
          <span className="text-textMuted cursor-pointer hover:text-textMain">Emura Project</span>
          <span className="text-textSoft">/</span>
          <span className="text-textMain cursor-pointer">Beling Pottery</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-textMuted">
        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-textMain transition-colors">
          <Plus className="w-4 h-4" /> New Tab
        </button>
        <div className="h-4 w-px bg-borderLight mx-1"></div>
        <button className="hover:text-textMain transition-colors p-1"><Bookmark className="w-4 h-4" /></button>
        <button className="hover:text-textMain transition-colors p-1"><Share2 className="w-4 h-4" /></button>
        <button className="hover:text-textMain transition-colors p-1"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
    </header>
  );
};

export default Header;
