interface Props {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function NextButton({ label, onClick, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-xl py-3 text-white text-base font-semibold ${
        disabled ? 'bg-gray-300' : 'bg-[#FF8FA9]'
      }`}
    >
      {label}
    </button>
  );
}
