import React from 'react';
import { Briefcase, CheckCircle2, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-surface p-6 rounded-2xl shadow-sm hover:shadow-premium border border-borderLight/60 premium-transition group animate-slide-up relative overflow-hidden">
    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 premium-transition"></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-3.5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl text-primary shadow-sm group-hover:scale-110 premium-transition border border-primary/10">
        <Icon className="w-6 h-6" />
      </div>
      <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${trend >= 0 ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
      </span>
    </div>
    <h3 className="text-textMuted text-sm font-medium mt-2 relative z-10">{title}</h3>
    <p className="text-3xl font-bold text-textMain mt-1 tracking-tight relative z-10">{value}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textMain tracking-tight animate-fade-in">Dashboard Overview</h1>
          <p className="text-textMuted mt-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>Welcome back! Here's what's happening with your projects today.</p>
        </div>
        <Link 
          to="/projects" 
          className="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-xl font-medium premium-transition shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          View All Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value="12" icon={Briefcase} trend={8} />
        <StatCard title="Completed Tasks" value="148" icon={CheckCircle2} trend={12} />
        <StatCard title="In Progress" value="34" icon={Clock} trend={-2} />
        <StatCard title="Active Members" value="24" icon={Users} trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-sm hover:shadow-premium border border-borderLight/60 h-[400px] flex flex-col premium-transition">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-textMain tracking-tight">Project Status Overview</h3>
                 <select className="bg-cardHover border border-borderLight text-textMain text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none">
                     <option>Last 7 days</option>
                     <option>Last 30 days</option>
                     <option>This Year</option>
                 </select>
             </div>
             
             {/* Mock Chart Area */}
             <div className="flex-1 flex items-end justify-between gap-2 mt-4 px-2 pb-2">
                 {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                     <div key={i} className="w-full max-w-[40px] flex flex-col justify-end group">
                         <div 
                             className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-sm premium-transition relative"
                             style={{ height: `${height}%` }}
                         >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-textMain text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 premium-transition pointer-events-none">
                                 {height}
                             </div>
                             <div 
                                className="w-full bg-primary rounded-t-sm absolute bottom-0 premium-transition group-hover:opacity-90"
                                style={{ height: `${height * 0.6}%` }} 
                             />
                         </div>
                         <span className="text-[10px] text-center text-textMuted mt-2 font-medium">Day {i+1}</span>
                     </div>
                 ))}
             </div>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm hover:shadow-premium border border-borderLight/60 h-[400px] overflow-hidden flex flex-col premium-transition">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h3 className="text-lg font-bold text-textMain tracking-tight">Recent Activity</h3>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[
              { id: 1, user: 'JD', action: 'completed task', target: 'Design System Update', time: '10 min ago', color: 'bg-secondary/10 text-secondary border-secondary/20' },
              { id: 2, user: 'Sarah', action: 'commented on', target: 'Homepage Hero section', time: '1 hour ago', color: 'bg-primary/10 text-primary border-primary/20' },
              { id: 3, user: 'Mike', action: 'moved task', target: 'API Integration to In Progress', time: '3 hours ago', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
              { id: 4, user: 'Ann', action: 'created project', target: 'Marketing Q3 Campaign', time: 'Yesterday', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
              { id: 5, user: 'JD', action: 'uploaded', target: 'Q2 Performance Report.pdf', time: 'Yesterday', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' }
            ].map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start pb-4 border-b border-borderLight/50 last:border-0 last:pb-0 group">
                <div className={`w-9 h-9 rounded-full ${activity.color} border flex items-center justify-center shrink-0 mt-0.5 premium-transition group-hover:scale-105`}>
                  <span className="text-xs font-bold">{activity.user.substring(0, 2)}</span>
                </div>
                <div>
                  <p className="text-sm text-textMain font-medium leading-snug">
                    <span className="hover:text-primary cursor-pointer premium-transition">{activity.user}</span> <span className="text-textMuted font-normal">{activity.action}</span>
                  </p>
                  <p className="text-xs text-textMain font-medium mt-0.5 hover:text-primary cursor-pointer premium-transition line-clamp-1">{activity.target}</p>
                  <p className="text-[10px] text-textMuted mt-1 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
