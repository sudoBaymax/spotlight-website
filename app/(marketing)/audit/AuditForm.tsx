"use client";

import { useState } from "react";

const agentOpts  = ["4–7 agents","8–15 agents","16–25 agents","26+ agents"];
const leadOpts   = ["Under 30/mo","30–60/mo","60–120/mo","120–250/mo","250+/mo"];
const crmOpts    = ["Follow Up Boss","kvCORE","Sierra Interactive","LionDesk","CINC","Other / Not sure"];

type F = { name:string; teamName:string; city:string; agents:string; monthlyLeads:string; crm:string; phone:string; email:string };

export default function AuditForm() {
  const [form, setForm] = useState<F>({ name:"", teamName:"", city:"", agents:"", monthlyLeads:"", crm:"", phone:"", email:"" });
  const [ok, setOk] = useState(false);
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  if (ok) {
    return (
      <div className="bg-card rounded-2xl p-10 text-center">
        <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 7l3 3 6-6" />
          </svg>
        </div>
        <p className="text-[#111] font-semibold text-[18px] mb-2">Got it. Pick a time below.</p>
        <p className="text-muted text-[14px] leading-relaxed max-w-xs mx-auto mb-8">
          We&apos;ll come prepared with specific numbers for your team.
        </p>
        {/* Calendar embed placeholder */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 text-left">
          <p className="text-muted text-[13px] text-center mb-2">Calendar loading…</p>
          <p className="text-[#DDD] text-[11px] text-center">
            Replace this block with your Calendly, Cal.com, or HubSpot meeting embed.
          </p>
        </div>
      </div>
    );
  }

  const label  = "block text-[11px] font-semibold text-accent tracking-[0.14em] uppercase mb-1.5";
  const input  = "w-full border-0 border-b border-[#D8D8D8] focus:border-[#111] outline-none text-[#111] text-[15px] py-3 bg-transparent transition-colors placeholder:text-[#CCC]";
  const select = `${input} cursor-pointer appearance-none`;

  return (
    <form onSubmit={e => { e.preventDefault(); setOk(true); }} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={label}>Your name <span className="text-accent">*</span></label>
          <input required type="text" placeholder="Sarah Reeves" value={form.name} onChange={set("name")} className={input} />
        </div>
        <div>
          <label className={label}>Team name <span className="text-accent">*</span></label>
          <input required type="text" placeholder="The Reeves Group" value={form.teamName} onChange={set("teamName")} className={input} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={label}>City / Market <span className="text-accent">*</span></label>
          <input required type="text" placeholder="Phoenix, AZ" value={form.city} onChange={set("city")} className={input} />
        </div>
        <div>
          <label className={label}>Team size <span className="text-accent">*</span></label>
          <select required value={form.agents} onChange={set("agents")} className={select}>
            <option value="" disabled>Number of agents</option>
            {agentOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={label}>Monthly internet leads <span className="text-accent">*</span></label>
          <select required value={form.monthlyLeads} onChange={set("monthlyLeads")} className={select}>
            <option value="" disabled>Leads per month</option>
            {leadOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Current CRM</label>
          <select value={form.crm} onChange={set("crm")} className={select}>
            <option value="">Select CRM (optional)</option>
            {crmOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={label}>Phone <span className="text-accent">*</span></label>
          <input required type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={set("phone")} className={input} />
        </div>
        <div>
          <label className={label}>Work email <span className="text-accent">*</span></label>
          <input required type="email" placeholder="sarah@reevesgroup.com" value={form.email} onChange={set("email")} className={input} />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" className="btn-dark w-full justify-center py-4 text-[14px]">
          Book my free lead audit
        </button>
        <p className="text-[#CCC] text-[11px] text-center mt-3">
          No commitment. We&apos;ll confirm within 1 business day. Takes 15 minutes.
        </p>
      </div>
    </form>
  );
}
