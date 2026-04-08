import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Form State
  const [adminAction, setAdminAction] = useState<'add' | 'update'>('add');
  const [adminEmail, setAdminEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [adminMsg, setAdminMsg] = useState({ text: '', type: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAdmins();
      if (res.ok) {
        setAdmins(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) return;

    if (adminAction === 'add' && admins.length >= 3) {
      setAdminMsg({ text: 'Maximum limit of 3 Admins reached.', type: 'error' });
      return;
    }

    setIsSendingOtp(true);
    setAdminMsg({ text: '', type: '' });
    try {
      const res = await apiService.sendAdminOtp({ action: adminAction, targetEmail: adminEmail });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setAdminMsg({ text: 'OTP sent via email. Valid for 5 minutes.', type: 'success' });
      } else {
        setAdminMsg({ text: data.message || 'Failed to send OTP', type: 'error' });
      }
    } catch (err) {
      setAdminMsg({ text: 'Network Error', type: 'error' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    setIsVerifyingOtp(true);
    try {
      const res = await apiService.verifyAdminAction({ action: adminAction, targetEmail: adminEmail, otp: otpInput });
      const data = await res.json();
      if (res.ok) {
        setAdminMsg({ text: data.message || 'Success!', type: 'success' });
        setAdminEmail('');
        setOtpInput('');
        setOtpSent(false);
        fetchAdmins();
      } else {
        setAdminMsg({ text: data.message || 'Failed to verify OTP', type: 'error' });
      }
    } catch (err) {
      setAdminMsg({ text: 'Network Error', type: 'error' });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleRemoveAdmin = async (id: string, name: string) => {
    if (admins.length <= 1) {
      alert("Cannot remove the last remaining admin in the system.");
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${name} from Admins? This user will lose dashboard access.`)) return;

    try {
       const res = await apiService.removeAdmin(id);
       if(res.ok) {
          fetchAdmins();
       } else {
          const err = await res.json();
          alert(err.message || "Failed to remove admin.");
       }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    }
  };

  return (
    <div className="fade-in space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Administrator Access</h1>
            <p className="text-sm text-gray-400 mt-1">Manage platform administrators. Max 3 admins allowed securely.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin List Column */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl shadow-sm overflow-hidden flex flex-col h-full fade-in">
           <div className="bg-[#222] px-6 py-4 border-b border-[#333] flex justify-between items-center">
             <h2 className="font-semibold text-gray-200">Current Admins</h2>
             <span className={`text-[10px] font-bold px-2 py-1 rounded-full tracking-wider uppercase ${admins.length >= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {admins.length} / 3 Seats Used
             </span>
           </div>
           
           {loading ? (
             <div className="p-10 flex justify-center text-gray-400 animate-pulse">Loading admins...</div>
           ) : admins.length === 0 ? (
             <div className="p-10 text-center text-gray-400">No admin found (Wait, you should be one!).</div>
           ) : (
             <ul className="divide-y divide-gray-50 flex-1">
                {admins.map((admin) => (
                  <li key={admin._id} className="p-4 px-6 flex items-center justify-between hover:bg-[#222]/50 transition">
                     <div className="flex items-center gap-4">
                       <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-blue-100">
                         {admin.name.charAt(0).toUpperCase()}
                       </span>
                       <div>
                         <p className="font-semibold text-gray-100 text-sm">{admin.name}</p>
                         <p className="text-xs text-gray-400 truncate max-w-[150px] sm:max-w-[200px]" title={admin.email}>{admin.email}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => handleRemoveAdmin(admin._id, admin.name)}
                       className="p-2 text-red-500 hover:bg-red-50 bg-red-50 lg:bg-transparent lg:hover:bg-red-50 rounded-lg transition flex items-center justify-center shrink-0 w-10 h-10"
                       title="Remove Admin Permissions"
                     >
                        <Trash2 size={18} />
                     </button>
                  </li>
                ))}
             </ul>
           )}
        </div>

        {/* Admin Management Auth Form Column */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl shadow-sm p-6 sm:p-8 relative overflow-hidden h-fit">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-full -z-10 opacity-70"></div>
           
           <h2 className="text-lg font-bold mb-1 text-gray-100">Access Management Gateway</h2>
           <p className="text-xs text-gray-400 mb-6">You must verify ownership via MAGIC LINK OTP to issue or update administrator credentials.</p>

           <div className="flex bg-[#2a2a2a] p-1 rounded-lg mb-6 w-fit">
             <button 
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${adminAction === 'add' ? 'bg-[#1a1a1a] text-gray-100 shadow-sm' : 'text-gray-400 hover:text-gray-100'}`}
               onClick={() => { setAdminAction('add'); setAdminMsg({text: '', type: ''}); }}
             >
               Grant Access
             </button>
             <button 
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${adminAction === 'update' ? 'bg-[#1a1a1a] text-gray-100 shadow-sm' : 'text-gray-400 hover:text-gray-100'}`}
               onClick={() => { setAdminAction('update'); setAdminMsg({text: '', type: ''}); }}
             >
               Update Own Email
             </button>
           </div>

           {adminMsg.text && (
             <div className={`p-3 rounded-lg text-sm font-medium mb-6 flex items-start gap-2 border ${adminMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
               <span className="mt-0.5 shrink-0">{adminMsg.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}</span>
               <span>{adminMsg.text}</span>
             </div>
           )}

           {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                     {adminAction === 'add' ? "New Admin Email Address" : "Your New Email Address"}
                   </label>
                   <input 
                     required type="email" placeholder="e.g. josh@wovenwonder.com" 
                     className="w-full border border-[#444] p-3 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                     value={adminEmail} 
                     onChange={e => setAdminEmail(e.target.value)} 
                     disabled={isSendingOtp}
                   />
                 </div>
                 <button type="submit" disabled={isSendingOtp || !adminEmail} className="w-full py-3 bg-black text-white text-sm font-bold tracking-wider rounded-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-wait shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                   {isSendingOtp ? 'Encrypting & Sending...' : 'Dispatch OTP Securely'}
                 </button>
              </form>
           ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 border-t border-[#333]">
                 <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                     Enter 6-Digit Code
                   </label>
                   <p className="text-xs text-gray-400 mb-3">Verification sent to <span className="font-semibold text-gray-100">{adminEmail}</span></p>
                   <input 
                     required type="text" maxLength={6} placeholder="••••••" 
                     className="w-full text-center border border-dashed border-[#555] bg-[#222]/50 p-4 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none font-mono text-xl tracking-[12px] font-bold"
                     value={otpInput} 
                     onChange={e => setOtpInput(e.target.value)} 
                     disabled={isVerifyingOtp}
                   />
                 </div>
                 
                 <div className="flex gap-3 pt-2">
                   <button type="button" onClick={() => setOtpSent(false)} className="px-5 py-3 border border-[#444] text-gray-400 rounded-lg text-sm font-bold hover:bg-[#222] transition flex-1">
                      Cancel
                   </button>
                   <button type="submit" disabled={isVerifyingOtp || otpInput.length < 6} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-emerald-500/20 transition disabled:opacity-70 flex-[2]">
                      {isVerifyingOtp ? 'Verifying...' : 'Verify Identity & Proceed'}
                   </button>
                 </div>
              </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default Admins;
