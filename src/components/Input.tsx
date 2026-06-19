interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function Input({ label, type = 'text', value, onChange, placeholder, required }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="px-4 py-3 rounded-xl border border-orange-200 bg-white text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-300"
      />
    </div>
  );
}
