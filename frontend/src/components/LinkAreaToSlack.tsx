"use client";
import React, { useState } from 'react';

type Props = { areaId: number };

export default function LinkAreaToSlack({ areaId }: Props) {
  const [channelId, setChannelId] = useState('');
  const [inviteUsers, setInviteUsers] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('pending');
    try {
      const res = await fetch(`/api/areas/${areaId}/link-slack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ channelId, inviteUserIds: inviteUsers ? inviteUsers.split(',').map(s => s.trim()) : [] }),
      });
      
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Slack Channel ID</label>
        <input value={channelId} onChange={e => setChannelId(e.target.value)} className="mt-1 block w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Invite User IDs (comma separated)</label>
        <input value={inviteUsers} onChange={e => setInviteUsers(e.target.value)} className="mt-1 block w-full" />
      </div>
      <div>
        <button className="btn-primary" type="submit">Link to Slack</button>
      </div>
      {status === 'pending' && <div>Processing…</div>}
      {status === 'success' && <div className="text-green-600">Linked successfully</div>}
      {status === 'error' && <div className="text-red-600">Error linking channel</div>}
    </form>
  );
}
