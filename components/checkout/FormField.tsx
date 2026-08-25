interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  className?: string;
  error?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  className,
  error,
}: FormFieldProps) {
  const errorId = `${name}-error`;
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="font-sans uppercase text-nav">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`border px-3 py-2 font-serif text-body bg-white focus:outline-none focus:ring-1 ${
          error ? "border-red-600 focus:ring-red-600" : "border-black focus:ring-black"
        }`}
        required
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} role="alert" className="font-serif text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
