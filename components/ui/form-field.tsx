import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Labelled input with error text — composes the shared Input + Label. */
export const FormField = forwardRef<HTMLInputElement, FieldProps>(
  function FormField({ label, error, id, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Input ref={ref} id={id} {...props} />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    );
  },
);
