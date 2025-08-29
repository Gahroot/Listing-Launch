"use client";

import { useCallback, useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GenerationStep, SessionData } from "@/lib/types";

const GENERATION_STEPS: GenerationStep[] = [
  {
    id: 1,
    title: "Analyzing Property Data",
    description: "Processing property details and market information",
    status: 'pending',
    progress: 0
  },
  {
    id: 2,
    title: "Generating Social Media Content",
    description: "Creating captions and hashtags for all platforms including YouTube",
    status: 'pending',
    progress: 0
  },
  {
    id: 3,
    title: "Creating Video Content",
    description: "Generating video concepts and scripts",
    status: 'pending',
    progress: 0
  },
  {
    id: 4,
    title: "Building Landing Page",
    description: "Creating responsive landing page with lead capture",
    status: 'pending',
    progress: 0
  },
  {
    id: 5,
    title: "Preparing Email Templates",
    description: "Designing email templates and subject lines",
    status: 'pending',
    progress: 0
  },
  {
    id: 6,
    title: "Finalizing Package",
    description: "Compiling all assets and preparing for review",
    status: 'pending',
    progress: 0
  }
];

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [steps, setSteps] = useState<GenerationStep[]>(GENERATION_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const hasStartedGeneration = useRef(false);
  const currentSessionId = useRef<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const startGeneration = useCallback(async (sessionId: string, session: SessionData) => {
    // Prevent multiple concurrent calls with stricter checking
    if (isGenerating || hasStartedGeneration.current) {
      console.log('Generation already in progress, skipping...');
      return;
    }

    // Check if we've already processed this session
    if (currentSessionId.current === sessionId) {
      console.log('Session already processed, skipping...');
      return;
    }

    // Check if session already has webhook response (completed previously)
    if (session.webhookResponse) {
      console.log('Session already has webhook response, redirecting to approve page...');
      router.push(`/approve?session=${sessionId}`);
      return;
    }

    // Create new abort controller for this request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // Mark generation as started immediately
      setIsGenerating(true);
      hasStartedGeneration.current = true;
      currentSessionId.current = sessionId;

      // Reset state
      setError(null);
      setRetryCount(0);

      // Start progress simulation
      simulateProgress();

      // Call the webhook with abort controller
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          propertyData: {
            address: session.formData.address,
            status: session.formData.status
          },
          agentData: {
            name: session.formData.name,
            phone: session.formData.phone,
            email: session.formData.email,
            headshot: session.formData.headshot,
            colors: session.formData.colors
          }
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to start generation process');
      }

      const result = await response.json();
      
      // Save the result and redirect
      const updatedSession = {
        ...session,
        webhookResponse: result
      };
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(updatedSession));
      
      // Complete all steps and redirect
      completeAllSteps();
      setTimeout(() => {
        router.push(`/approve?session=${sessionId}`);
      }, 2000);

    } catch (error) {
      // Don't show error if request was aborted (intentional cancellation)
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted (duplicate prevention)');
        return;
      }
      
      console.error('Generation failed:', error);
      setError('Content generation failed. Please try again.');
      
      // Reset flags on error
      setIsGenerating(false);
      hasStartedGeneration.current = false;
      currentSessionId.current = null;
      
      // Clean up abort controller
      abortControllerRef.current = null;
      
      // Reset progress on error
      setSteps(prev => prev.map(step => ({
        ...step,
        status: step.id <= currentStep ? 'error' : 'pending',
        progress: step.id <= currentStep ? 100 : 0
      })));
    }
  }, [router, currentStep, isGenerating]);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (!sessionId) {
      router.push('/create');
      return;
    }

    const savedSession = localStorage.getItem(`session_${sessionId}`);
    if (!savedSession) {
      router.push('/create');
      return;
    }

    const session: SessionData = JSON.parse(savedSession);
    setSessionData(session);

    // Only start generation if we haven't started for this specific session yet
    // and we're not currently generating anything
    if (!isGenerating && 
        !hasStartedGeneration.current && 
        currentSessionId.current !== sessionId) {
      console.log(`Starting generation for session: ${sessionId}`);
      startGeneration(sessionId, session);
    }
  }, [searchParams, router, startGeneration, isGenerating]);

  // Cleanup effect to abort any ongoing requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const simulateProgress = () => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= GENERATION_STEPS.length) {
        clearInterval(interval);
        return;
      }

      setSteps(prev => prev.map((step, index) => {
        if (index === stepIndex) {
          return { ...step, status: 'in_progress', progress: 50 };
        } else if (index < stepIndex) {
          return { ...step, status: 'completed', progress: 100 };
        }
        return step;
      }));

      setCurrentStep(stepIndex);
      setOverallProgress(((stepIndex + 0.5) / GENERATION_STEPS.length) * 100);

      setTimeout(() => {
        setSteps(prev => prev.map((step, index) => {
          if (index === stepIndex) {
            return { ...step, status: 'completed', progress: 100 };
          }
          return step;
        }));
        setOverallProgress(((stepIndex + 1) / GENERATION_STEPS.length) * 100);
      }, 2000);

      stepIndex++;
    }, 3000);
  };

  const completeAllSteps = () => {
    setSteps(prev => prev.map(step => ({
      ...step,
      status: 'completed',
      progress: 100
    })));
    setOverallProgress(100);
  };

  const handleRetry = () => {
    if (sessionData && retryCount < 3) {
      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // Reset all flags and state for retry
      setIsGenerating(false);
      hasStartedGeneration.current = false;
      currentSessionId.current = null;
      
      setRetryCount(prev => prev + 1);
      setSteps(GENERATION_STEPS.map(step => ({ ...step, status: 'pending', progress: 0 })));
      setCurrentStep(0);
      setOverallProgress(0);
      
      startGeneration(sessionData.id, sessionData);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '🔄';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-primary';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  if (!sessionData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Step 2 of 3
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Generating Your Content</h1>
          <p className="text-muted-foreground">
            Creating marketing materials for {sessionData.formData.address}
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="text-2xl">{Math.round(overallProgress)}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Attempt {retryCount + 1} of 3
                    </p>
                  </div>
                </div>
                {retryCount < 3 && (
                  <Button onClick={handleRetry} variant="outline" size="sm">
                    Retry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generation Steps */}
        <div className="grid gap-4">
          {steps.map((step) => (
            <Card 
              key={step.id}
              className={`transition-all duration-300 ${
                step.status === 'in_progress' ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getStatusColor(step.status)}`}>
                      {step.status === 'in_progress' ? (
                        <div className="animate-spin">🔄</div>
                      ) : (
                        getStepIcon(step.status)
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                    {step.status === 'in_progress' ? 'Processing' : 
                     step.status === 'completed' ? 'Complete' :
                     step.status === 'error' ? 'Error' : 'Pending'}
                  </Badge>
                </div>
                {step.status !== 'pending' && (
                  <Progress value={step.progress} className="h-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📦 What You&rsquo;ll Get
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Social Media Content</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• YouTube video descriptions & tags</li>
                  <li>• Facebook posts & carousels</li>
                  <li>• Instagram feed posts & Reels</li>
                  <li>• LinkedIn professional posts</li>
                  <li>• X (Twitter) threads</li>
                  <li>• TikTok vertical videos</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Marketing Assets</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Responsive landing page</li>
                  <li>• Lead capture forms</li>
                  <li>• Email templates</li>
                  <li>• Subject line variations</li>
                  <li>• Video concepts & scripts</li>
                  <li>• Downloadable asset package</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
        <p className="text-muted-foreground mt-2">Preparing your content generation</p>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GenerateContent />
    </Suspense>
  );
}