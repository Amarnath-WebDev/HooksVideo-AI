import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AuthForm } from "./ui/auth-form";

interface GetStartedDialogProps {
  children: React.ReactNode;
  className?: string;
}

export function GetStartedDialog({ children, className }: GetStartedDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className={className}>{children}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Started with HooksVideo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AuthForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}