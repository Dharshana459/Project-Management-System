import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

const defaultBoardState = {
  columns: {
    todo: { id: 'todo', title: 'To Do', taskIds: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', taskIds: [] },
    review: { id: 'review', title: 'Review', taskIds: [] },
    done: { id: 'done', title: 'Done', taskIds: [] },
  },
  items: {}
};

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch initial data when user logs in
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setProjects([]);
        setProjectTasks({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch projects
        const { data: dbProjects, error: errProj } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (errProj) throw errProj;
        setProjects(dbProjects || []);

        // Fetch board states
        const { data: dbBoards, error: errBoard } = await supabase
          .from('board_states')
          .select('*');
          
        if (errBoard) throw errBoard;
        
        const boardsMapping = {};
        dbBoards?.forEach(b => {
          boardsMapping[b.project_id] = b.state_json;
        });
        
        setProjectTasks(boardsMapping);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Actions
  const addProject = async (projectObj) => {
    if (!user) return;
    try {
      const newProjectId = uuidv4();
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
           id: newProjectId,
           user_id: user.id,
           name: projectObj.name,
           status: 'Planning',
           progress: 0,
           due_date: projectObj.dueDate || null
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setProjects([...projects, data]);
      setProjectTasks({ ...projectTasks, [data.id]: defaultBoardState });
    } catch (err) {
      console.error("Failed to add project", err);
    }
  };

  const deleteProject = async (projectId) => {
    if (!user) return;
    try {
       await supabase.from('projects').delete().eq('id', projectId);
       setProjects(projects.filter(p => p.id !== projectId));
       const newTasks = { ...projectTasks };
       delete newTasks[projectId];
       setProjectTasks(newTasks);
    } catch (err) {
       console.error("Failed to delete project", err);
    }
  };

  const getBoard = (projectId) => {
    const board = projectTasks[projectId];
    if (!board || !board.columns || !board.items) {
      return JSON.parse(JSON.stringify(defaultBoardState));
    }
    return board;
  };

  const updateBoard = async (projectId, newBoardData) => {
    if (!user) return;
    
    // Optimistic UI updates
    setProjectTasks({
      ...projectTasks,
      [projectId]: newBoardData
    });
    
    // Auto-calculate project progress based on board state
    let totalTasks = 0;
    let doneTasks = 0;
    
    Object.values(newBoardData.columns).forEach(col => {
      totalTasks += col.taskIds.length;
      if (col.id === 'done') doneTasks += col.taskIds.length;
    });

    const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    
    setProjects(prevProjects => prevProjects.map(p => 
      p.id === projectId ? { ...p, progress } : p
    ));

    // Async sync to DB
    try {
       await supabase.from('board_states').upsert({
         project_id: projectId,
         user_id: user.id,
         state_json: newBoardData
       });
       
       await supabase.from('projects').update({ progress }).eq('id', projectId);
    } catch (err) {
       console.error("Failed to sync board updates to supabase", err);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      projectTasks, // exposed if needed globally outside board
      addProject,
      deleteProject,
      getBoard,
      updateBoard,
      loading
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
