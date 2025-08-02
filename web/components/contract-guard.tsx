"use client"

import { useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ContractContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContractGuardProps {
    children: React.ReactNode;
}

export function ContractGuard({ children }: ContractGuardProps) {
    const { 
        isContractValid, 
        isContractLoading, 
        contractError, 
        contractAddress 
    } = useContext(ContractContext);
    const pathname = usePathname();
    const router = useRouter();
    
    const isDashboardPage = pathname === '/dashboard' || pathname === '/';
    
    if (isDashboardPage) {
        return <>{children}</>;
    }
    
    if (isContractLoading) {
        return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold">Validating Contract</h3>
                    <p className="text-sm text-muted-foreground">
                    Checking contract at {contractAddress}...
                    </p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        );
    }
    
    if (!isContractValid) {
        return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>Invalid Contract</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {contractError || "The contract address is not valid or not accessible."}
                </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                    Current contract: <code className="text-xs bg-muted px-1 rounded">{contractAddress}</code>
                </p>
                <p className="text-sm text-muted-foreground">
                    Please go to the dashboard to enter a valid contract address.
                </p>
                </div>
                
                <Button 
                onClick={() => router.push('/dashboard')} 
                className="w-full"
                >
                Go to Dashboard
                </Button>
            </CardContent>
            </Card>
        </div>
        );
    }
    
    return <>{children}</>;
}
