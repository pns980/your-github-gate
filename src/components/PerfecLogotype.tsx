import { cn } from "@/lib/utils";
import forestLogo from "@/assets/brand/perfec-logotype-forest.svg.asset.json";
import creamLogo from "@/assets/brand/perfec-logotype-cream.svg.asset.json";

interface PerfecLogotypeProps {
  variant?: "forest" | "cream";
  className?: string;
}

const PerfecLogotype = ({ variant = "forest", className }: PerfecLogotypeProps) => (
  <img
    src={variant === "forest" ? forestLogo.url : creamLogo.url}
    alt="Perfec™"
    width={1890}
    height={730}
    className={cn("h-7 w-auto", className)}
  />
);

export default PerfecLogotype;