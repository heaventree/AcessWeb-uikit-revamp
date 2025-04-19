import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, CheckCircle, AlertCircle, XCircle } from "lucide-react";

type ComplianceLevel = 'A' | 'AA' | 'AAA';
type ComplianceStatus = 'pass' | 'partial' | 'fail' | 'unknown';

interface WCAGBadgeProps {
  level: ComplianceLevel;
  status?: ComplianceStatus;
  showDetails?: boolean;
  criteriaId?: string;
  description?: string;
}

export function WCAGBadge({ 
  level = 'AA', 
  status = 'pass', 
  showDetails = false,
  criteriaId,
  description
}: WCAGBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  // Define color variations based on level and status
  const getBadgeVariant = () => {
    if (status === 'pass') return 'success';
    if (status === 'partial') return 'warning';
    if (status === 'fail') return 'destructive';
    return 'secondary';
  };

  // Get the appropriate icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'fail':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <InfoIcon className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={getBadgeVariant() as any} 
              className="cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {getStatusIcon()}
              WCAG {level} {criteriaId && `(${criteriaId})`}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{status === 'pass' ? 'Compliant with' : status === 'partial' ? 'Partially compliant with' : 'Not compliant with'} WCAG {level}</p>
            {description && <p className="text-xs mt-1">{description}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isExpanded && description && (
        <Card className="mt-2 w-full max-w-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">WCAG {level} {criteriaId && `- ${criteriaId}`}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardFooter className="pt-2 flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              Close
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="bg-gradient-to-r from-[#0066FF] to-[#0fae96] hover:from-[#0052cc] hover:to-[#0c9a86] border-none"
            >
              View Criteria
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}