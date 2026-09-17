"use client";

type Message = {
  step: string;
  day: number;
  text: string;
  subject?: string;
};

type Sequence = {
  messages: Message[];
  channel: string;
  tip: string;
};

type Props = {
  sequence: Sequence;
  onCopy: (text: string) => void;
};

const channelConfig = {
  WhatsApp: {
    bg: "bg-[#0B141A]",
    headerBg: "bg-[#202C33]",
    bubbleBg: "bg-[#005C4B]",
    bubbleText: "text-white",
    timeText: "text-[#8696A0]",
    badge: "bg-[#25D366] text-white",
    headerText: "text-white",
    subText: "text-[#8696A0]",
    icon: "💬",
    label: "WhatsApp",
  },
  LinkedIn: {
    bg: "bg-[#F3F2EF]",
    headerBg: "bg-[#0A66C2]",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-800",
    timeText: "text-gray-400",
    badge: "bg-[#0A66C2] text-white",
    headerText: "text-white",
    subText: "text-blue-100",
    icon: "💼",
    label: "LinkedIn",
  },
  Email: {
    bg: "bg-gray-50",
    headerBg: "bg-gray-800",
    bubbleBg: "bg-white",
    bubbleText: "text-gray-800",
    timeText: "text-gray-400",
    badge: "bg-gray-700 text-white",
    headerText: "text-white",
    subText: "text-gray-300",
    icon: "✉️",
    label: "Email",
  },
  SMS: {
    bg: "bg-black",
    headerBg: "bg-gray-900",
    bubbleBg: "bg-[#3C3C3E]",
    bubbleText: "text-white",
    timeText: "text-gray-500",
    badge: "bg-gray-700 text-white",
    headerText: "text-white",
    subText: "text-gray-400",
    icon: "📱",
    label: "SMS",
  },
};

const dayLabels: Record<number, string> = {
  0: "Aujourd'hui",
  2: "J+2",
  5: "J+5",
};

export function SequencePreview({ sequence, onCopy }: Props) {
  const cfg = channelConfig[sequence.channel as keyof typeof channelConfig] || channelConfig.WhatsApp;

  return (
    <div className="flex flex-col gap-4">
      {/* Badge canal */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.badge}`}>
          {cfg.icon} {cfg.label}
        </span>
        <span className="text-xs text-gray-400">Séquence de prospection — 3 messages</span>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {sequence.messages.map((msg, i) => (
          <div key={i} className={`${cfg.bg} rounded-2xl overflow-hidden border border-white/5`}>
            {/* Header message */}
            <div className={`${cfg.headerBg} px-4 py-3 flex items-center justify-between`}>
              <div>
                <p className={`text-sm font-semibold ${cfg.headerText}`}>{msg.step}</p>
                <p className={`text-xs ${cfg.subText}`}>
                  {dayLabels[msg.day] || `J+${msg.day}`}
                  {msg.subject && ` · Objet : ${msg.subject}`}
                </p>
              </div>
              <span className="text-xs text-white/40 font-mono">#{i + 1}</span>
            </div>

            {/* Bulle message */}
            <div className="p-4">
              {sequence.channel === "Email" && msg.subject && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Objet</p>
                  <p className="text-sm font-semibold text-gray-800">{msg.subject}</p>
                </div>
              )}
              <div className={`${cfg.bubbleBg} rounded-xl p-3 max-w-sm ml-auto shadow-sm`}>
                <p className={`text-sm ${cfg.bubbleText} whitespace-pre-line leading-relaxed`}>
                  {msg.text}
                </p>
                <p className={`text-xs ${cfg.timeText} text-right mt-1`}>
                  {sequence.channel === "WhatsApp" ? "✓✓" : ""} {new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {/* Bouton copier */}
              <button
                onClick={() => onCopy(msg.subject ? `Objet : ${msg.subject}\n\n${msg.text}` : msg.text)}
                className="mt-2 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1 rounded-lg transition-all ml-auto block"
              >
                Copier ce message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Conseil Youssef */}
      {sequence.tip && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-amber-400 font-semibold mb-1">💡 Conseil de Youssef</p>
          <p className="text-sm text-amber-200/80">{sequence.tip}</p>
        </div>
      )}
    </div>
  );
}
