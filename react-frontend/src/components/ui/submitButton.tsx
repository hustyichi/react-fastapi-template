import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  text: string;
  isLoading?: boolean;
}

export function SubmitButton({ text, isLoading = false }: SubmitButtonProps) {
  return (
    <Button className="w-full" type="submit" disabled={isLoading}>
      {isLoading ? "Loading..." : text}
    </Button>
  );
}
