interface Props {
  onKey: (key: string) => void;
  disabled?: boolean;
}

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PinPad({ onKey, disabled }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 w-64">
      {KEYS.map((key, i) => (
        key === '' ? (
          <div key={i} />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => !disabled && onKey(key)}
            disabled={disabled}
            className={`h-14 rounded-2xl text-xl font-semibold transition-colors
              ${key === '⌫'
                ? 'text-gray-400 hover:bg-gray-100 active:bg-gray-200'
                : 'bg-gray-50 text-gray-800 hover:bg-orange-50 active:bg-orange-100 border border-gray-100'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {key}
          </button>
        )
      ))}
    </div>
  );
}
