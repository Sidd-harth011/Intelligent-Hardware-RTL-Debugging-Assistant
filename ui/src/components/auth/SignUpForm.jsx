import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const inputClass =
  'w-full rounded-lg border border-white/8 bg-white/[0.03] py-2.5 pl-10 pr-3 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/15';

function Field({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium text-slate-400">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
          {icon}
        </span>
        <input className={inputClass} {...props} />
      </div>
    </div>
  );
}

// ... keep your userIcon, mailIcon, lockIcon definitions here ...
const userIcon = <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const mailIcon = <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const lockIcon = <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;

export default function SignUpForm({ toggleAuthMode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Save JWT session
        navigate('/dashboard'); // Redirect to IDE
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection failed. Is your backend running?');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-[27px]">Create an account</h2>
        <p className="mt-2 text-[13px] text-slate-500">Join the Intelligent Hardware Debugger</p>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-500/10 p-3 text-center text-sm text-red-400">{error}</div>}

      <form className="space-y-4" onSubmit={handleSignUp}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" icon={userIcon} type="text" placeholder="Jane" onChange={handleChange} required />
          <Field label="Last name" name="lastName" icon={userIcon} type="text" placeholder="Doe" onChange={handleChange} required />
        </div>

        <Field label="Work email" name="email" icon={mailIcon} type="email" placeholder="engineer@domain.com" onChange={handleChange} required />
        <Field label="Password" name="password" icon={lockIcon} type="password" placeholder="••••••••" onChange={handleChange} required />
        <Field label="Confirm password" name="confirmPassword" icon={lockIcon} type="password" placeholder="••••••••" onChange={handleChange} required />

        {/* ... keep your checkbox here ... */}

        <button type="submit" className="w-full rounded-lg bg-teal-400 py-2.5 text-[13px] font-semibold text-[#04211d] transition-colors hover:bg-teal-300 active:scale-[0.99]">
          Create account
        </button>
      </form>

      <p className="mt-7 text-center text-[13px] text-slate-500">
         Already have an account?{' '}
        <button
          onClick={toggleAuthMode}
          className="font-medium text-teal-300 underline decoration-teal-400/30 underline-offset-4 transition-colors hover:text-teal-200"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}