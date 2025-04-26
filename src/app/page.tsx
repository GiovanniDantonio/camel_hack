"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Shield, Zap, FileCode2, BarChart2, Lock, Beaker } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/components/ui/use-toast';

export default function Home() {
  const { toast } = useToast();

  // Function to call the test API endpoint using POST
  const callTestApi = async () => {
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'Quick Test Button'
      };

      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      const data = await response.json();
      
      // Show toast notification with the response
      toast({
        title: 'Test API Response',
        description: `${data.message} at ${new Date(data.timestamp).toLocaleTimeString()}`,
        variant: 'default',
      });
      
      console.log('Test API response:', data);
    } catch (error) {
      console.error('Error calling test API:', error);
      toast({
        title: 'Test API Error',
        description: 'Failed to call test API endpoint',
        variant: 'destructive',
      });
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">0PenAI</span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Test Button */}
            <Button 
              variant="secondary" 
              onClick={callTestApi}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Beaker className="h-4 w-4" />
              Test POST
            </Button>
            <ThemeToggle />
            <Button variant="outline" asChild>
              <a href="/login">
                <Github className="h-4 w-4 mr-2" />
                Login with GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          Powered by AI
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          AI-Powered Penetration Testing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Secure your GitHub repositories with automated penetration testing
          powered by Large Language Models. Get actionable vulnerability reports
          and remediation steps.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="/login">
              <Github className="h-5 w-5 mr-2" />
              Start Securing Your Code
            </a>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileCode2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
              Link repositories and automatically scan code on push events.
              Seamless integration with your existing workflow.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              Advanced vulnerability detection using GPT-4o. Identifies security
              risks and suggests targeted penetration tests.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Automated Testing</CardTitle>
            </CardHeader>
            <CardContent>
              Deploy attack simulations using serverless functions. Verify
              vulnerabilities with real-world testing.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              Secure authentication via GitHub OAuth with customizable roles for
              Admins, Penetration Testers, and Developers.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              Get comprehensive vulnerability reports with severity levels and
              step-by-step remediation guidance.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              Track security status across all repositories with a centralized
              dashboard and instant alerts.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Code?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join leading companies in building more secure applications with
          AI-powered penetration testing.
        </p>
        <Button size="lg" asChild>
          <a href="/login">
            <Github className="h-5 w-5" />
            Get Started with GitHub
          </a>
        </Button>
      </section>
    </div>
  );
}
