import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';

function initials(name) {
  const words = (name || '').split('·')[0].trim().replace(/^(dr\.?|dre\.?|docteur|docteure)\s+/iu, '').split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words.at(-1))[0] : '';
  return (first + last).toLocaleUpperCase('fr');
}

export default function PersonAvatar({ name, avatarUrl, className = '' }) {
  return <Avatar className={`person-avatar ${className}`} aria-hidden="true">
    <AvatarImage src={avatarUrl} alt="" className="object-cover" />
    <AvatarFallback>{initials(name)}</AvatarFallback>
  </Avatar>;
}
