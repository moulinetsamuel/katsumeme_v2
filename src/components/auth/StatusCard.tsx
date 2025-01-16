import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ThumbsUp, AlertTriangle, type LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  description?: ReactNode;
  icon?: "success" | "error";
  children?: ReactNode;
  titleColor?: "default" | "error";
}

export function StatusCard({
  title,
  description,
  icon = "success",
  children,
  titleColor = "default",
}: StatusCardProps) {
  const IconComponent: LucideIcon =
    icon === "success" ? ThumbsUp : AlertTriangle;
  const iconColorClass =
    icon === "success"
      ? "bg-primary/10 text-primary"
      : "bg-red-100 text-red-500";
  const titleColorClass = titleColor === "error" ? "text-red-500" : "";

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className={`rounded-full ${iconColorClass} p-3`}>
              <IconComponent className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className={`text-2xl ${titleColorClass}`}>
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-base">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {children && (
          <CardContent className="text-center space-y-4">
            {children}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
