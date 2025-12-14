import React, { useState, useEffect, useCallback } from 'react';
import { List, Moon, Sun, Plus, X, Trash2, Power, Check } from 'lucide-react';
import { Task, TaskLog, AppView, CardState } from './types';
import { DEFAULT_TASKS, STORAGE_KEYS, CELEBRATION_MESSAGES } from './constants';
import { TaskCard } from './components/TaskCard';
import { Button } from './components/Button';
import { playCompletionSound } from './utils/sound';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [cardState, setCardState] = useState<CardState>('idle');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Animation state for entering/exiting cards
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskIcon, setNewTaskIcon] = useState('✨');

  // --- Initialization ---
  useEffect(() => {
    // Load Tasks
    const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(DEFAULT_TASKS);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
    }

    // Load Logs
    const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }

    // Load Theme
    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // --- Persistence ---
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
  };

  const saveLog = (log: TaskLog) => {
    const newLogs = [...logs, log];
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(newLogs));
  };

  // --- Logic ---

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  };

  const pickRandomTask = () => {
    const activeTasks = tasks.filter(t => t.isActive);
    if (activeTasks.length === 0) return;

    // Filter out the current active task to prevent immediate repeat if possible
    const candidates = activeTasks.length > 1 
      ? activeTasks.filter(t => t.id !== activeTask?.id) 
      : activeTasks;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const nextTask = candidates[randomIndex];

    // Animation Sequence
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTask(nextTask);
      setCardState('active');
      setFeedbackMsg('');
      
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);
      
      // Reveal animation
      requestAnimationFrame(() => setIsAnimating(false));
    }, 200);
  };

  const handleComplete = () => {
    if (!activeTask) return;

    // Record log
    const log: TaskLog = {
      id: Date.now().toString(),
      taskId: activeTask.id,
      completedAt: Date.now()
    };
    saveLog(log);

    // Feedback
    playCompletionSound();
    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    
    // Pick random celebration message
    const msg = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
    setFeedbackMsg(msg);
    setCardState('completed');

    // Reset after delay
    setTimeout(() => {
      setCardState('idle');
      setActiveTask(null);
    }, 2500);
  };

  const getLastCompletedAt = (taskId: string): number | null => {
    const taskLogs = logs.filter(l => l.taskId === taskId).sort((a, b) => b.completedAt - a.completedAt);
    return taskLogs.length > 0 ? taskLogs[0].completedAt : null;
  };

  // --- Settings Logic ---
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      icon: newTaskIcon || '✨',
      isActive: true
    };

    saveTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskIcon('✨');
  };

  const toggleTaskActive = (id: string) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t);
    saveTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    if (confirm('确定要删除这件事吗？')) {
      const newTasks = tasks.filter(t => t.id !== id);
      saveTasks(newTasks);
    }
  };

  // --- Renders ---

  // 1. Home View
  const renderHome = () => {
    if (cardState === 'idle') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <button 
            onClick={pickRandomTask}
            className="group relative w-48 h-48 rounded-full bg-white dark:bg-stone-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-200 active:scale-95 animate-breathe"
          >
            <div className="absolute inset-0 rounded-full border border-stone-100 dark:border-stone-700 opacity-50"></div>
            <span className="text-4xl text-stone-300 dark:text-stone-600 group-hover:text-stone-400 dark:group-hover:text-stone-500 transition-colors">
              ⚡️
            </span>
            <span className="absolute -bottom-12 text-stone-400 text-sm font-medium tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              一件小事
            </span>
          </button>
        </div>
      );
    }

    if (cardState === 'completed') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pop">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">{feedbackMsg}</h2>
          <p className="text-stone-400">Rest your mind.</p>
        </div>
      );
    }

    if (activeTask) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <TaskCard 
            task={activeTask}
            lastCompletedAt={getLastCompletedAt(activeTask.id)}
            onComplete={handleComplete}
            onSkip={pickRandomTask}
            isAnimating={isAnimating}
          />
        </div>
      );
    }
    return null;
  };

  // 2. Settings View
  const renderSettings = () => (
    <div className="max-w-md mx-auto w-full pt-10 pb-20 animate-fade-in px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">小事列表</h2>
        <Button variant="ghost" onClick={() => setCurrentView('home')} className="p-2 !rounded-full">
          <X size={24} />
        </Button>
      </div>

      {/* Add New */}
      <form onSubmit={addTask} className="bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-sm mb-6 flex gap-3">
        <input 
          type="text" 
          value={newTaskIcon}
          onChange={(e) => setNewTaskIcon(e.target.value)}
          maxLength={2}
          className="w-12 h-12 text-center text-xl rounded-xl bg-stone-50 dark:bg-stone-700 border-none focus:ring-2 focus:ring-stone-400"
          placeholder="🏷️"
        />
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="添加一件新的小事..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-stone-800 dark:text-stone-100 placeholder-stone-400"
        />
        <button 
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 disabled:opacity-50"
        >
          <Plus size={20} />
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${task.isActive ? 'bg-white dark:bg-stone-800 shadow-sm' : 'bg-stone-100 dark:bg-stone-900 opacity-60 grayscale'}`}>
            <span className="text-2xl">{task.icon}</span>
            <div className="flex-1">
              <h3 className="font-medium text-stone-800 dark:text-stone-200">{task.title}</h3>
            </div>
            
            <button onClick={() => toggleTaskActive(task.id)} className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
              <Power size={18} className={task.isActive ? "text-green-500" : ""} />
            </button>
            <button onClick={() => deleteTask(task.id)} className="p-2 text-stone-300 hover:text-red-400">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background patterns */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-stone-200/20 dark:bg-stone-800/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-stone-200/30 dark:bg-stone-800/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Bar (Home only) */}
      {currentView === 'home' && (
        <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
          <button onClick={toggleTheme} className="p-2 rounded-full text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setCurrentView('settings')} className="p-2 rounded-full text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
            <List size={20} />
          </button>
        </header>
      )}

      {/* Main Content Area */}
      <main className="min-h-screen flex flex-col relative z-10">
        {currentView === 'home' ? renderHome() : renderSettings()}
      </main>

    </div>
  );
};

export default App;