import type { UserProfile } from './types';

interface AvatarProps {
  profile: UserProfile;
  size?: number;
}

export default function Avatar({ profile, size = 40 }: AvatarProps) {
  const initial = profile.name?.[0]?.toUpperCase() ?? '?';

  if (profile.photoURL) {
    return (
      <img
        src={profile.photoURL}
        alt={profile.name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0"
    >
      <span
        className="text-white font-bold"
        style={{ fontSize: Math.max(10, size * 0.4) }}
      >
        {initial}
      </span>
    </div>
  );
}
