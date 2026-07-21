import React, { useState } from 'react';

interface BillingControlProps {
  onTriggerLog?: (msg: string, type: "info" | "success" | "warning" | "error") => void;
}

export default function BillingControl({ onTriggerLog }: BillingControlProps) {
  const [activeTab, setActiveTab] = useState<'signUp' | 'signIn'>('signUp'); // 'signUp' | 'signIn'
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly'); // 'monthly' | 'yearly'
  const [email, setEmail] = useState('phidephefem@gmail.com');
  const [fullName, setFullName] = useState('Akin Adewumi');
  const [loading, setLoading] = useState(false);

  const API_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

  const handleCheckout = async (isTrial = false) => {
    if (!email) {
      if (onTriggerLog) onTriggerLog('Please enter a valid email address.', 'warning');
      else alert('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      if (onTriggerLog) {
        onTriggerLog(`Initializing ${isTrial ? '7-Day Trial' : selectedPlan.toUpperCase()} Stripe Session for ${email}...`, 'info');
      }

      const res = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          planType: selectedPlan,
          isTrial
        })
      });

      const data = await res.json();
      if (data.url) {
        if (onTriggerLog) {
          onTriggerLog(`Redirecting to Stripe Hosted Checkout (${data.simulated ? 'Simulated' : 'Live Gateway'})...`, 'success');
        }
        window.location.href = data.url; // Redirect to Stripe Hosted Checkout
      } else {
        const errorMsg = 'Payment initialization failed: ' + (data.error || 'Unknown error');
        if (onTriggerLog) onTriggerLog(errorMsg, 'error');
        else alert(errorMsg);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = 'Error connecting to payment gateway: ' + (err.message || 'Network error');
      if (onTriggerLog) onTriggerLog(errorMsg, 'error');
      else alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-wide font-display text-white">MUBUSLINK SUBSCRIPTION & BILLING CONTROL</h2>
        <p className="text-xs text-slate-400 mt-1">Manage corporate accounts, trial licenses, and premium Stripe payments.</p>
      </div>

      {/* Auth Tabs */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveTab('signUp')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'signUp' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          7-Day Trial Sign Up
        </button>
        <button 
          onClick={() => setActiveTab('signIn')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'signIn' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Sign In
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400">FULL NAME</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="w-full mt-1.5 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400">EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full mt-1.5 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          <button 
            onClick={() => handleCheckout(true)}
            disabled={loading}
            className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
          >
            {loading ? 'Processing...' : 'START 7-DAY FREE TRIAL'}
          </button>
        </div>

        {/* Plan Selectors & Direct Checkout Redirect */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                selectedPlan === 'monthly' ? 'border-emerald-500 bg-slate-950 shadow-lg' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400">PLAN: MONTHLY</span>
              <h3 className="text-xl font-bold mt-1 text-white">$6.99 <span className="text-xs font-normal text-slate-400">/ Month</span></h3>
            </div>

            <div 
              onClick={() => setSelectedPlan('yearly')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                selectedPlan === 'yearly' ? 'border-emerald-500 bg-slate-950 shadow-lg' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400">PLAN: YEARLY</span>
              <h3 className="text-xl font-bold mt-1 text-white">$69.99 <span className="text-xs font-normal text-slate-400">/ Year</span></h3>
            </div>
          </div>

          <button 
            onClick={() => handleCheckout(false)}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md mt-4"
          >
            {loading ? 'Redirecting...' : `REDIRECT TO STRIPE HOSTED CHECKOUT (${selectedPlan === 'monthly' ? '$6.99' : '$69.99'})`}
          </button>
        </div>
      </div>
    </div>
  );
}
