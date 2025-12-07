// AdminGroups.jsx
import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from '../services/firebase';
import { getServiceNameFromPlanType } from './getServiceNameFromPlanType';

function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'payments'));
        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const groupMap = {};
        orders.forEach(order => {
          const key = String(order.planType || order.subscriptionType || 'Other');
          if (!groupMap[key]) groupMap[key] = [];
          groupMap[key].push(order);
        });
        setGroups(
          Object.entries(groupMap).map(([planType, members], i) => ({
            id: String(i + 1),
            planType: String(planType),
            service: getServiceNameFromPlanType(planType) || String(planType),
            members
          }))
        );
      } catch (err) {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  const [search, setSearch] = useState("");
  const filteredGroups = groups.filter(group =>
    group.service.toLowerCase().includes(search.toLowerCase()) ||
    group.planType.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">All Groups</h1>
          <input
            type="text"
            placeholder="Search by service or plan..."
            className="w-full md:w-80 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-56 rounded-xl" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center text-slate-400 py-16">No groups found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group, idx) => (
              <div key={group.planType + '-' + idx} className="rounded-xl border border-slate-200 shadow bg-white flex flex-col">
                <div className="flex items-center gap-4 px-6 py-4 rounded-t-xl" style={{ background: "linear-gradient(90deg, #e0e7ff 0%, #f0fdfa 100%)" }}>
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow">{String(group.service)?.[0] || '?'}</div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg text-slate-900 truncate">{String(group.service) || String(group.planType)}</h2>
                    <p className="text-xs text-slate-500 truncate">Plan Type: {String(group.planType)}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">{group.members.length} Members</span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50 rounded-b-xl">
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                    {group.members.map((member, mIdx) => (
                      <div key={String(member.id || mIdx)} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold uppercase text-xs">{member.name ? member.name[0] : '?'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 text-sm truncate">{member.name}</div>
                          <div className="text-xs text-slate-500 truncate">{member.email}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${member.status === 'active' ? 'bg-green-100 text-green-700' : member.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-500'}`}>{member.status}</span>
                        <button title="Delete user" className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminGroups;
