import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, LayoutDashboard, Clock } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

const Projects = () => {
  const { projects, addProject, loading, projectTasks } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    await addProject({
      name: newProjectName,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default due date 2 weeks from now
    });
    
    setNewProjectName('');
    setShowModal(false);
  };

  if (loading) {
     return <div className="max-w-6xl mx-auto flex items-center justify-center py-20 text-textMuted">Loading projects...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">Projects</h1>
          <p className="text-textMuted mt-1">Manage and track your team's initiatives.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-borderLight border-dashed">
            <LayoutDashboard className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-textMain">No projects yet</h3>
            <p className="text-textMuted mt-1">Create your first project to start tracking work.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="mt-6 flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            // Compute task count dynamically
            const board = projectTasks[project.id];
            let tasksCount = 0;
            if (board && board.items) {
               tasksCount = Object.keys(board.items).length;
            }

            return (
              <div key={project.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-borderLight hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <button className="text-textMuted hover:text-textMain p-1 rounded-full hover:bg-cardHover opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <Link to={`/projects/${project.id}/board`} className="block group-hover:text-primary transition-colors">
                  <h3 className="text-lg font-bold text-textMain tracking-tight mb-2 truncate">
                    {project.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-4 text-xs font-medium mb-6">
                  <span className={`px-2.5 py-1 rounded-full ${
                    project.status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-textMuted/10 text-textMuted'
                  }`}>
                    {project.status || 'Planning'}
                  </span>
                  <span className="flex items-center gap-1 text-textMuted">
                    <Clock className="w-3.5 h-3.5" />
                    {project.due_date || 'TBD'}
                  </span>
                </div>

                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-xs text-textMuted">
                    <span>Progress</span>
                    <span className="font-medium text-textMain">{project.progress || 0}%</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-textMuted text-right pt-1">
                    {tasksCount} tasks
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textMain/20 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl border border-borderLight overflow-hidden flex flex-col animation-fadeInUp">
            <div className="px-6 py-4 border-b border-borderLight">
              <h2 className="text-xl font-bold text-textMain">Create New Project</h2>
            </div>
            <form onSubmit={handleCreateProject} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Project Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-borderLight rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-textMain shadow-sm"
                    placeholder="e.g. Q3 Roadmap"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-textMuted hover:text-textMain font-medium hover:bg-cardHover rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 bg-primary hover:bg-primaryHover disabled:bg-primary/50 text-white rounded-lg font-medium shadow-sm transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
