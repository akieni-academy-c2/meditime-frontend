export function Brand() {
  return <div className="brand" aria-label="MediTime"><img src="/brand/meditime-mark-48.webp" srcSet="/brand/meditime-mark-96.webp 2x, /brand/meditime-mark-144.webp 3x" width="48" height="34" alt="" aria-hidden="true" /><span>MediTime</span></div>;
}

export function SecurityArtwork({ email = false }) {
  return <svg className="security-artwork" viewBox="0 0 230 150" aria-hidden="true">
    <defs><linearGradient id={email ? 'email-wash' : 'lock-wash'} x2="1" y2="1"><stop stopColor="#f6f3ff" /><stop offset="1" stopColor="#efebff" /></linearGradient></defs>
    <circle cx="114" cy="74" r="66" fill={`url(#${email ? 'email-wash' : 'lock-wash'})`} />
    {!email && <><path d="M16 138c-14-36 31-52 48-23 5-32 57-28 63-5 25-28 80-28 86 9 2 12-9 20-23 20Z" fill="#f0ebff" />
      <path d="M94 83V62a19 19 0 0 1 38 0v21" fill="none" stroke="#7844fa" strokeWidth="3" />
      <rect x="86" y="78" width="55" height="45" rx="11" fill="#d5c8ff" />
      <circle cx="114" cy="95" r="6" fill="#6120e9" /><path d="M111 98h6v13h-6Z" fill="#6120e9" />
      <path d="m36 85-10-5m17-7-5-12" stroke="#a78aff" strokeWidth="3" strokeLinecap="round" /></>}
    {email && <><rect x="74" y="48" width="67" height="45" rx="6" fill="white" stroke="#141342" strokeWidth="2.5" />
      <path d="m77 51 30 23 31-23" fill="none" stroke="#141342" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="145" cy="95" r="18" fill="#7331f8" stroke="white" strokeWidth="3" /><path d="m138 95 5 5 10-11" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33 63h20M25 75h20" stroke="#b89aff" strokeWidth="3" strokeLinecap="round" /></>}
  </svg>;
}
