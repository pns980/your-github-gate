import { cn } from "@/lib/utils";
import forestLogo from "@/assets/brand/perfec-logotype-forest.svg";
import creamLogo from "@/assets/brand/perfec-logotype-cream.svg";

interface PerfecLogotypeProps {
  variant?: "forest" | "cream";
  className?: string;
}

const PerfecLogotype = ({ variant = "forest", className }: PerfecLogotypeProps) => (
  <img
    src={variant === "forest" ? forestLogo : creamLogo}
    alt="Perfec™"
    width={1890}
    height={730}
    className={cn("h-7 w-auto", className)}
  />
);

export default PerfecLogotype;