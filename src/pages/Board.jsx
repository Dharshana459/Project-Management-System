import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Users, UserPlus, MoreHorizontal, MessageSquare, Paperclip, 
  Plus, Calendar, MenuSquare, LayoutGrid, List, Clock, Filter, Search, Edit2, ChevronRight, X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useProjects } from '../context/ProjectContext';

const MOCK_USERS = [
  { id: 'u1', name: 'Galang Andika', avatar: 'G', color: 'bg-blue-100 text-blue-700' },
  { id: 'u2', name: 'Septin Annisa', avatar: 'S', color: 'bg-pink-100 text-pink-700' },
  { id: 'u3', name: 'Azie Melasari', avatar: 'M', color: 'bg-purple-100 text-purple-700' },
  { id: 'u4', name: 'John Doe', avatar: 'J', color: 'bg-orange-100 text-orange-700' }
];

const Board = () => {
  const { projectId } = useParams();
  const { projects, getBoard, updateBoard, loading } = useProjects();
  
  const [boardData, setBoardData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState('Kanban');
  
  // Add Task Modal State
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('todo');
  const [newTask, setNewTask] = useState({
    title: '',
    subtitle: '',
    dueDate: '',
    priority: 'Medium',
    assignees: [] // array of user IDs
  });

  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (!loading && projectId) {
      setBoardData(getBoard(projectId));
    }
  }, [projectId, getBoard, loading]);

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !boardData) return;

    const newTaskId = uuidv4();
    
    let tagColor = 'text-green-500 bg-green-50';
    if (newTask.priority === 'High') tagColor = 'text-red-500 bg-red-50';
    if (newTask.priority === 'Medium') tagColor = 'text-orange-500 bg-orange-50';
    
    const taskItem = {
      id: newTaskId,
      title: newTask.title,
      subtitle: newTask.subtitle,
      tags: [{ label: newTask.priority, color: tagColor }],
      remaining: newTask.dueDate ? `Due ${newTask.dueDate}` : 'No deadline',
      dueDateRaw: newTask.dueDate, // Keep raw date for input fields
      progress: 0,
      comments: 0,
      attachments: 0,
      assignees: newTask.assignees,
      priority: newTask.priority,
      createdAt: new Date().toISOString()
    };

    const newBoardData = {
      ...boardData,
      items: { ...(boardData?.items || {}), [newTaskId]: taskItem },
      columns: {
        ...(boardData?.columns || {}),
        [targetColumnId]: {
          ...(boardData?.columns?.[targetColumnId] || { id: targetColumnId, title: targetColumnId, taskIds: [] }),
          taskIds: [...(boardData?.columns?.[targetColumnId]?.taskIds || []), newTaskId]
        }
      }
    };

    setBoardData(newBoardData);
    updateBoard(projectId, newBoardData);
    setIsAddingTask(false);
    setNewTask({ title: '', subtitle: '', dueDate: '', priority: 'Medium', assignees: [] });
  };

  const handleUpdateSelectedTask = (field, value) => {
    if (!selectedTask || !boardData) return;
    
    const updatedTask = { ...selectedTask, [field]: value };
    
    if (field === 'priority') {
        let tagColor = 'text-green-500 bg-green-50';
        if (value === 'High') tagColor = 'text-red-500 bg-red-50';
        if (value === 'Medium') tagColor = 'text-orange-500 bg-orange-50';
        updatedTask.tags = [{ label: value, color: tagColor }];
    }

    if (field === 'dueDateRaw') {
        updatedTask.remaining = value ? `Due ${value}` : 'No deadline';
    }

    const newBoardData = {
      ...boardData,
      items: { ...boardData.items, [selectedTask.id]: updatedTask },
    };

    setBoardData(newBoardData);
    setSelectedTask(updatedTask);
    updateBoard(projectId, newBoardData);
  };

  const toggleAssignee = (userId) => {
    setNewTask(prev => ({
      ...prev,
      assignees: prev.assignees.includes(userId) 
        ? prev.assignees.filter(id => id !== userId)
        : [...prev.assignees, userId]
    }));
  };

  const tabs = [
    { name: 'Kanban', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { name: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
    { name: 'Gantt', icon: <MenuSquare className="w-3.5 h-3.5" /> },
    { name: 'List', icon: <List className="w-3.5 h-3.5" /> },
    { name: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  if (loading || !boardData) {
    return <div className="h-full flex items-center justify-center text-textMuted">Loading board...</div>;
  }

  return (
    <div className="h-full flex flex-col dotted-bg relative">
      <div className="mb-6 shrink-0 bg-transparent">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
               <span className="font-bold text-xl">{project?.name ? project.name.charAt(0).toUpperCase() : 'P'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-textMain tracking-tight">{project?.name || 'Loading Project...'}</h1>
                <ChevronRight className="w-4 h-4 text-textMuted -rotate-90" />
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs font-medium text-textMuted">
                 <span>Status: <span className={`font-semibold ${project?.status === 'Active' ? 'text-secondary' : 'text-warning'}`}>{project?.status || 'Planning'}</span></span>
                 <span>Progress: <span className="text-textMain font-semibold">{project?.progress || 0}%</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-background bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-800 z-30">A</div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-pink-100 flex items-center justify-center text-[10px] font-bold text-pink-800 z-20">B</div>
             </div>
             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primaryHover text-white rounded-lg text-xs font-medium transition-colors shadow-sm">
               <UserPlus className="w-3.5 h-3.5" /> Invite
             </button>
          </div>
        </div>

        <div className="flex items-center mt-6 gap-2 border-b border-borderLight pb-2 overflow-x-auto hide-scrollbar">
           {tabs.map((tab) => (
             <button 
               key={tab.name}
               onClick={() => setActiveTab(tab.name)}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors shrink-0 ${
                 activeTab === tab.name 
                 ? 'bg-white shadow-sm text-textMain border border-borderLight' 
                 : 'text-textMuted hover:text-textMain hover:bg-white/50'
               }`}
             >
               {tab.icon} {tab.name}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 relative">
        {Object.values(boardData.columns).map((column, idx) => {
          const colTasks = column.taskIds.map(id => boardData.items[id]).filter(Boolean);
          const pipColors = ['bg-borderLight', 'bg-warning', 'bg-primary', 'bg-secondary'];

          return (
            <div key={column.id} className="w-[300px] shrink-0 flex flex-col max-h-full">
               <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-3 rounded-full ${pipColors[idx % pipColors.length]}`}></div>
                  <h3 className="font-bold text-textMain text-sm tracking-tight">{column.title}</h3>
                  <span className="text-textMuted bg-cardHover border border-borderLight px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                        setTargetColumnId(column.id);
                        setIsAddingTask(true);
                    }}
                    className="text-textSoft hover:text-textMain p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="text-textSoft hover:text-textMain p-1"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="bg-surface p-4 rounded-xl shadow-sm border border-borderLight/80 cursor-pointer hover:shadow-premium hover:border-borderLight transition-all group flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                       <div className="flex gap-1.5">
                          {task.tags && task.tags.map(tag => (
                             <span key={tag.label} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tag.color}`}>{tag.label}</span>
                          ))}
                       </div>
                       <span className="text-xs font-semibold text-textSoft">{task.remaining || 'No deadline'}</span>
                    </div>

                    <div>
                       <h4 className="text-sm font-bold text-textMain leading-snug">{task.title}</h4>
                       {task.subtitle && <p className="text-[11px] text-textMuted mt-1 leading-snug">{task.subtitle}</p>}
                    </div>

                    <div className="space-y-1 mt-1">
                       <div className="flex justify-between items-center text-[10px] font-bold text-textSoft">
                         <span className="flex items-center gap-1"><Filter className="w-2.5 h-2.5"/> Progress</span>
                         <span>{task.progress || 0}%</span>
                       </div>
                       <div className="h-1 w-full bg-cardHover rounded-full overflow-hidden">
                         <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${task.progress || 0}%` }}></div>
                       </div>
                    </div>

                    <div className="flex justify-between items-center mt-1 border-t border-dashed border-borderLight/80 pt-3">
                       <div className="flex -space-x-1.5">
                         {task.assignees && task.assignees.length > 0 ? (
                             task.assignees.map(uId => {
                                 const user = MOCK_USERS.find(u => u.id === uId);
                                 if(!user) return null;
                                 return (
                                     <div key={user.id} className={`w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold ${user.color}`} title={user.name}>
                                         {user.avatar}
                                     </div>
                                 )
                             })
                         ) : (
                             <div className="w-5 h-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[8px] font-bold text-gray-400">?</div>
                         )}
                       </div>
                       <div className="flex gap-2.5 text-textSoft font-medium">
                          <div className="flex items-center gap-1 text-[10px] hover:text-textMain"><MessageSquare className="w-3 h-3"/> {task.comments || 0}</div>
                          <div className="flex items-center gap-1 text-[10px] hover:text-textMain"><Paperclip className="w-3 h-3"/> {task.attachments || 0}</div>
                       </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                      setTargetColumnId(column.id);
                      setIsAddingTask(true);
                  }}
                  className="w-full py-2.5 border border-dashed border-borderLight rounded-xl text-xs font-semibold text-textMuted hover:text-textMain hover:bg-white/50 transition-colors flex items-center justify-center gap-1.5"
                >
                   <Plus className="w-3.5 h-3.5" /> Add new
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <div className="absolute right-0 top-0 bottom-0 w-[450px] bg-white shadow-modal rounded-3xl border border-borderLight overflow-hidden flex flex-col z-40 animate-slide-up mx-2 my-2">
           <div className="p-6 border-b border-borderLight bg-surface shrink-0">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                       <span className="font-bold text-lg">{project?.name ? project.name.charAt(0).toUpperCase() : 'P'}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-textMain tracking-tight">Edit Task</h2>
                    </div>
                 </div>
                 <div className="flex gap-1.5 text-textMuted">
                    <button className="p-1.5 rounded bg-cardHover border border-borderLight hover:text-textMain" onClick={() => setSelectedTask(null)}>
                        <X className="w-4 h-4"/>
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-textMuted text-xs shrink-0">Task name</span>
                    <input 
                        type="text" 
                        value={selectedTask.title || ''}
                        onChange={(e) => handleUpdateSelectedTask('title', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-borderLight rounded focus:ring-1 focus:ring-primary outline-none transition-all text-textMain text-sm shadow-sm"
                    />
                 </div>
                 <div className="flex items-start text-sm">
                    <span className="w-24 text-textMuted text-xs mt-1 shrink-0">Assignees</span>
                    <div className="flex flex-col gap-2 flex-1 p-2 bg-cardHover/50 rounded border border-borderLight">
                        {MOCK_USERS.map(user => {
                            const isAssigned = selectedTask.assignees?.includes(user.id);
                            return (
                                <label key={user.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={isAssigned || false}
                                        onChange={() => {
                                            const newAssig = isAssigned 
                                                ? selectedTask.assignees.filter(id => id !== user.id)
                                                : [...(selectedTask.assignees || []), user.id];
                                            handleUpdateSelectedTask('assignees', newAssig);
                                        }}
                                        className="w-4 h-4 text-primary rounded border-borderLight focus:ring-primary"
                                    />
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${user.color}`}>{user.avatar}</div> 
                                    <span className="text-xs font-semibold text-textMain">{user.name}</span>
                                </label>
                            )
                        })}
                    </div>
                 </div>
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-textMuted text-xs shrink-0">Due date</span>
                    <input 
                        type="date"
                        value={selectedTask.dueDateRaw || ''}
                        onChange={(e) => handleUpdateSelectedTask('dueDateRaw', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-borderLight rounded focus:ring-1 focus:ring-primary outline-none transition-all text-textMain text-sm shadow-sm"
                    />
                 </div>
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-textMuted text-xs shrink-0">Priority</span>
                    <select 
                        value={selectedTask.priority || 'Medium'}
                        onChange={(e) => handleUpdateSelectedTask('priority', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-borderLight rounded focus:ring-1 focus:ring-primary outline-none transition-all text-textMain text-sm shadow-sm"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                 </div>
                 <div className="flex items-start text-sm mt-2">
                    <span className="w-24 text-textMuted text-xs mt-1 shrink-0">Description</span>
                    <textarea 
                        value={selectedTask.subtitle || ''}
                        onChange={(e) => handleUpdateSelectedTask('subtitle', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-borderLight rounded focus:ring-1 focus:ring-primary outline-none transition-all text-textMain text-sm shadow-sm resize-none min-h-[80px]"
                    />
                 </div>
                 <div className="flex items-center text-sm">
                    <span className="w-24 text-textMuted text-xs shrink-0">Progress</span>
                    <div className="flex-1 flex gap-2 items-center">
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={selectedTask.progress || 0}
                            onChange={(e) => handleUpdateSelectedTask('progress', parseInt(e.target.value))}
                            className="flex-1 accent-primary"
                        />
                        <span className="text-xs font-bold text-textMain">{selectedTask.progress || 0}%</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 bg-cardHover/30">
               <h4 className="text-sm font-bold text-textMain mb-4">Activity</h4>
               <p className="text-xs text-textMuted">Task creation recorded. Task modifications are directly synced to your workspace context!</p>
           </div>
        </div>
      )}

      {/* Add Task Form Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textMain/20 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-borderLight overflow-hidden flex flex-col animation-fadeInUp">
                <div className="px-6 py-4 border-b border-borderLight flex justify-between items-center">
                    <h2 className="text-lg font-bold text-textMain">Create New Task</h2>
                    <button onClick={() => setIsAddingTask(false)} className="text-textMuted hover:text-textMain"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSaveTask} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-1">Task Title</label>
                            <input
                                required
                                type="text"
                                autoFocus
                                value={newTask.title}
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                className="w-full px-4 py-2 bg-white border border-borderLight rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-textMain text-sm shadow-sm"
                                placeholder="e.g. Design Landing Page"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-1">Description (Optional)</label>
                            <textarea
                                value={newTask.subtitle}
                                onChange={(e) => setNewTask({...newTask, subtitle: e.target.value})}
                                className="w-full px-4 py-2 bg-white border border-borderLight rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-textMain text-sm shadow-sm resize-none h-20"
                                placeholder="Task details..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-textMain mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                    className="w-full px-4 py-2 bg-white border border-borderLight rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-textMain text-sm shadow-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-textMain mb-1">Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                    className="w-full px-4 py-2 bg-white border border-borderLight rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-textMain text-sm shadow-sm"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textMain mb-2">Assign to Team Members</label>
                            <div className="border border-borderLight rounded-lg p-2 bg-white grid grid-cols-2 gap-2 shadow-sm">
                                {MOCK_USERS.map(user => (
                                    <label key={user.id} className="flex items-center gap-2 p-2 hover:bg-cardHover rounded cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={newTask.assignees.includes(user.id)}
                                            onChange={() => toggleAssignee(user.id)}
                                            className="w-4 h-4 text-primary rounded border-borderLight focus:ring-primary"
                                        />
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${user.color}`}>
                                            {user.avatar}
                                        </div>
                                        <span className="text-sm font-medium text-textMain">{user.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAddingTask(false)}
                            className="px-4 py-2 text-textMuted hover:text-textMain font-medium hover:bg-cardHover rounded-lg transition-colors border border-transparent hover:border-borderLight"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Board;
