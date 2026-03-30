import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

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
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">View, block or remove customer accounts.</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-400 animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
           <div className="p-12 text-center text-gray-500">No users registered yet.</div>
        ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left min-w-[700px]">
               <thead className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] font-bold tracking-wider text-gray-500">
                 <tr>
                   <th className="p-4 px-6">Name</th>
                   <th className="p-4">Email</th>
                   <th className="p-4 text-center">Status</th>
                   <th className="p-4 text-center">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {users.map((user) => (
                   <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${user.isBlocked ? 'bg-red-50/30' : ''}`}>
                     <td className="p-4 px-6 font-medium text-gray-900 flex items-center gap-3">
                       <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                         {user.name.charAt(0).toUpperCase()}
                       </span>
                       {user.name}
                     </td>
                     <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                     <td className="p-4 text-center">
                       {user.isBlocked ? (
                         <span className="px-2.5 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">Blocked</span>
                       ) : (
                         <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">Active</span>
                       )}
                     </td>
                     <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => handleBlockToggle(user._id, user.isBlocked, user.name)}
                             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                               user.isBlocked ? 'bg-gray-800 text-white hover:bg-black' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                             }`}
                           >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                           </button>
                           <button 
                             onClick={() => handleDeleteUser(user._id, user.name)}
                             className="px-3 py-1.5 rounded text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                           >
                              Delete
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
};

export default Users;
