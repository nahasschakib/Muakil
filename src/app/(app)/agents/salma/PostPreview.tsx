"use client";

type Post = {
  caption: string;
  hashtags: string[];
  visualSuggestion: string;
  hook: string;
};

type Props = {
  post: Post;
  network: "Instagram" | "LinkedIn" | "Facebook";
  brandName?: string;
};

const networkConfig = {
  Instagram: {
    gradient: "from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
    handle: "@votremarque",
    avatar: "IG",
    avatarBg: "bg-gradient-to-br from-orange-400 to-pink-600",
    cardBg: "bg-white",
    cardRadius: "rounded-3xl",
    textColor: "text-gray-900",
    hashtagColor: "text-blue-500",
    badge: "Instagram",
    badgeBg: "bg-gradient-to-r from-orange-400 to-pink-600",
  },
  LinkedIn: {
    gradient: "from-[#0077B5] to-[#005885]",
    handle: "Votre Entreprise",
    avatar: "LI",
    avatarBg: "bg-[#0077B5]",
    cardBg: "bg-white",
    cardRadius: "rounded-lg",
    textColor: "text-gray-800",
    hashtagColor: "text-[#0077B5]",
    badge: "LinkedIn",
    badgeBg: "bg-[#0077B5]",
  },
  Facebook: {
    gradient: "from-[#1877F2] to-[#0a5cc7]",
    handle: "Votre Page",
    avatar: "FB",
    avatarBg: "bg-[#1877F2]",
    cardBg: "bg-white",
    cardRadius: "rounded-xl",
    textColor: "text-gray-900",
    hashtagColor: "text-[#1877F2]",
    badge: "Facebook",
    badgeBg: "bg-[#1877F2]",
  },
};

export function PostPreview({ post, network, brandName }: Props) {
  const cfg = networkConfig[network];

  return (
    <div className="flex flex-col gap-4">
      {/* Badge réseau */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${cfg.badgeBg}`}>
          {cfg.badge}
        </span>
        <span className="text-xs text-gray-400">Aperçu du post</span>
      </div>

      {/* Card post */}
      <div className={`${cfg.cardBg} ${cfg.cardRadius} overflow-hidden shadow-2xl border border-gray-100`}>
        {/* Header profil */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-full ${cfg.avatarBg} flex items-center justify-center text-white text-xs font-bold`}>
            {brandName ? brandName.slice(0, 2).toUpperCase() : cfg.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">
              {brandName || cfg.handle}
            </p>
            <p className="text-xs text-gray-400">
              {network === "LinkedIn" ? "Entreprise • Suivre" : "Maintenant · 🌍"}
            </p>
          </div>
          {network === "Instagram" && (
            <button className="ml-auto text-xs font-semibold text-blue-500">Suivre</button>
          )}
        </div>

        {/* Visuel suggéré */}
        <div className={`bg-gradient-to-br ${cfg.gradient} h-48 flex items-center justify-center p-4`}>
          <div className="text-center">
            <p className="text-white/80 text-xs mb-1 uppercase tracking-wider">Visuel suggéré</p>
            <p className="text-white text-sm font-medium text-center leading-relaxed max-w-xs">
              {post.visualSuggestion}
            </p>
          </div>
        </div>

        {/* Corps du post */}
        <div className="p-4 space-y-3">
          {/* Hook */}
          {post.hook && network !== "LinkedIn" && (
            <p className="text-sm font-semibold text-gray-900 leading-snug">{post.hook}</p>
          )}

          {/* Caption */}
          <p className={`text-sm ${cfg.textColor} leading-relaxed whitespace-pre-line`}>
            {post.caption}
          </p>

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {post.hashtags.map((tag, i) => (
                <span key={i} className={`text-xs ${cfg.hashtagColor} font-medium`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions réseau */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          {network === "Instagram" && (
            <div className="flex gap-4 text-gray-500 text-xs">
              <span>♥ J'aime</span>
              <span>💬 Commenter</span>
              <span>↗ Partager</span>
              <span className="ml-auto">🔖</span>
            </div>
          )}
          {network === "LinkedIn" && (
            <div className="flex gap-4 text-gray-500 text-xs">
              <span>👍 Recommander</span>
              <span>💬 Commenter</span>
              <span>↗ Partager</span>
            </div>
          )}
          {network === "Facebook" && (
            <div className="flex gap-4 text-gray-500 text-xs">
              <span>👍 J'aime</span>
              <span>💬 Commenter</span>
              <span>↗ Partager</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
