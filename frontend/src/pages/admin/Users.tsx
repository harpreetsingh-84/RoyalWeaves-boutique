import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Ban, CheckCircle, Trash2 } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.getUsers();
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (id: string, currentStatus: boolean, name: string) => {
    const action = currentStatus ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${name}?`)) return;

    try {
      const res = await apiService.blockUser(id, !currentStatus);
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !currentStatus } : u));
      } else {
        const err = await res.json();
        alert(err.message || `Failed to ${action} user`);
      }
    } catch (e) {
      console.error(e);
      alert(`Error trying to ${action} user.`);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`WARNING: Deleting ${name} is permanent and irreversible. Are you absolutely certain?`)) return;

    try {
      const res = await apiService.deleteUser(id);
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
         const err = await res.json();
         alert(err.message || 'Failed to delete user');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting user');
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-lightText">Manage Users</h1>
            <p className="text-sm text-lightText/60 mt-1">View, block or remove customer accounts.</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-lightText/60 animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
           <div className="p-12 text-center text-lightText/60">No users registered yet.</div>
        ) : (
           <div>
             {/* Desktop Table View */}
             <div className="hidden lg:block overflow-x-auto">
               <table className="w-full text-left min-w-[700px]">
                 <thead className="bg-darkBg border-b border-gray-100 uppercase text-[10px] font-bold tracking-wider text-lightText/60">
                   <tr>
                     <th className="p-4 px-6">Name</th>
                     <th className="p-4">Email</th>
                     <th className="p-4 text-center">Status</th>
                     <th className="p-4 text-center">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {users.map((user) => (
                     <tr key={user._id} className={`hover:bg-gray-50/50 transition-colors ${user.isBlocked ? 'bg-red-50/30' : ''}`}>
                       <td className="p-4 px-6 font-medium text-lightText flex items-center gap-3">
                         <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                           {user.name.charAt(0).toUpperCase()}
                         </span>
                         {user.name}
                       </td>
                       <td className="p-4 text-lightText/60 text-sm">{user.email}</td>
                       <td className="p-4 text-center">
                         {user.isBlocked ? (
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                             <Ban size={12} /> Blocked
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                             <CheckCircle size={12} /> Active
                           </span>
                         )}
                       </td>
                       <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                             <button 
                               onClick={() => handleBlockToggle(user._id, user.isBlocked, user.name)}
                               className={`px-3 py-1.5 flex items-center gap-1.5 rounded text-xs font-bold transition-colors ${
                                 user.isBlocked ? 'bg-primaryAction text-darkBg hover:bg-opacity-90 shadow-sm' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                               }`}
                             >
                                {user.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                                {user.isBlocked ? 'Unblock' : 'Block'}
                             </button>
                             <button 
                               onClick={() => handleDeleteUser(user._id, user.name)}
                               className="px-3 py-1.5 flex items-center gap-1.5 rounded text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                             >
                                <Trash2 size={14} /> Delete
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             {/* Mobile Card View */}
             <div className="lg:hidden flex flex-col divide-y divide-gray-100">
               {users.map((user) => (
                 <div key={user._id} className={`p-5 flex flex-col gap-4 ${user.isBlocked ? 'bg-red-50/30' : ''}`}>
                   <div className="flex items-center gap-4">
                     <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                       {user.name.charAt(0).toUpperCase()}
                     </span>
                     <div className="flex-1 min-w-0">
                       <h3 className="font-bold text-lightText truncate">{user.name}</h3>
                       <p className="text-lightText/60 text-xs truncate">{user.email}</p>
                     </div>
                     <div className="shrink-0">
                       {user.isBlocked ? (
                         <span className="inline-flex items-center gap-1 px-2py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                           <Ban size={10} /> Blocked
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                           <CheckCircle size={10} /> Active
                         </span>
                       )}
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 mt-2">
                     <button 
                       onClick={() => handleBlockToggle(user._id, user.isBlocked, user.name)}
                       className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                         user.isBlocked ? 'bg-primaryAction text-darkBg hover:bg-opacity-90 shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                       }`}
                     >
                        {user.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />}
                        {user.isBlocked ? 'Unblock Account' : 'Block Account'}
                     </button>
                     <button 
                       onClick={() => handleDeleteUser(user._id, user.name)}
                       className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                     >
                        <Trash2 size={14} /> Delete
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Users;
