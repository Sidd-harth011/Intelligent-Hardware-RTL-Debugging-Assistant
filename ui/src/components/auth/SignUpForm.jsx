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

const userIcon = (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const mailIcon = (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const lockIcon = (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

export default function SignUpForm({ toggleAuthMode }) {
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-[27px]">
          Create an account
        </h2>
        <p className="mt-2 text-[13px] text-slate-500">
          Join the Intelligent Hardware Debugger
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name" icon={userIcon} type="text" placeholder="Jane" required />
          <Field label="Last name" icon={userIcon} type="text" placeholder="Doe" required />
        </div>

        <Field label="Work email" icon={mailIcon} type="email" placeholder="engineer@domain.com" required />
        <Field label="Password" icon={lockIcon} type="password" placeholder="••••••••" required />
        <Field label="Confirm password" icon={lockIcon} type="password" placeholder="••••••••" required />

        <label className="flex items-start gap-2.5 pt-1 text-[12px] leading-relaxed text-slate-500">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/15 bg-white/[0.05] accent-teal-400"
          />
          <span>
            I agree to the{' '}
            <a href="#" className="text-teal-300 underline decoration-teal-400/30 underline-offset-4 hover:text-teal-200">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-teal-300 underline decoration-teal-400/30 underline-offset-4 hover:text-teal-200">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-400 py-2.5 text-[13px] font-semibold text-[#04211d] transition-colors hover:bg-teal-300 active:scale-[0.99]"
        >
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
