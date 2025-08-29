"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { SessionData } from "@/lib/types";
import { SOCIAL_PLATFORMS as platforms } from "@/lib/types";

interface ApprovalState {
  [key: string]: {
    approved: boolean;
    content: string;
    edited: boolean;
  };
}

function ApproveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [approvalStates, setApprovalStates] = useState<ApprovalState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Initialize approval states
    if (session.webhookResponse) {
      const initialStates: ApprovalState = {};
      session.webhookResponse.deliveryPackage.social_media.captions.forEach((caption, index) => {
        const key = `${caption.platform}-${index}`;
        initialStates[key] = {
          approved: false,
          content: caption.caption,
          edited: false
        };
      });
      setApprovalStates(initialStates);
    }
  }, [searchParams, router]);

  const handleApprove = (key: string) => {
    setApprovalStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        approved: true
      }
    }));
  };

  const handleReject = (key: string) => {
    setApprovalStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        approved: false
      }
    }));
  };

  const handleEdit = (key: string, newContent: string) => {
    setApprovalStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        content: newContent,
        edited: true
      }
    }));
  };

  const handleBulkApprove = () => {
    setApprovalStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], approved: true };
      });
      return updated;
    });
  };

  const handleDownload = async () => {
    setIsSubmitting(true);
    
    // Simulate download preparation
    setTimeout(() => {
      // Create a mock download
      const element = document.createElement('a');
      element.href = sessionData?.webhookResponse?.actions.download.url || '#';
      element.download = `listing-pack-${sessionData?.id}.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setIsSubmitting(false);
      
      // Show success message or redirect
      alert('Download started! Check your downloads folder.');
    }, 2000);
  };

  const handleSendEmail = async () => {
    setIsSubmitting(true);
    
    // Simulate email sending
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Content package sent to ${sessionData?.formData.email}!`);
    }, 1500);
  };

  const getPlatformInfo = (platformName: string) => {
    const platform = platforms.find(p => 
      p.name.toLowerCase().includes(platformName.toLowerCase()) ||
      platformName.toLowerCase().includes(p.name.toLowerCase())
    );
    return platform || { name: platformName, icon: '📱', color: '#666666' };
  };

  const approvedCount = Object.values(approvalStates).filter(state => state.approved).length;
  const totalCount = Object.keys(approvalStates).length;

  if (!sessionData || !sessionData.webhookResponse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  const { webhookResponse } = sessionData;

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium mb-6">
            Step 3 of 3 • Final Review
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Review & Approve</span>
            <br />
            <span className="text-foreground">Your Content</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <span className="font-medium text-foreground">{webhookResponse.summary.property}</span>
            <br />
            <span className="text-accent">{approvedCount}/{totalCount}</span> items approved and ready to launch
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bento-card-accent p-6 shadow-glow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-2xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📦</span>
                <span className="gradient-text">Content Package Summary</span>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30 text-base px-4 py-2">
                {webhookResponse.summary.status}
              </Badge>
            </CardTitle>
            <CardDescription className="text-base mt-2">{webhookResponse.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bento-card p-4 text-center hover-glow">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📱</span>
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{totalCount}</div>
                <div className="text-sm text-muted-foreground">Social Posts</div>
              </Card>
              <Card className="bento-card p-4 text-center hover-glow">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🏠</span>
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">1</div>
                <div className="text-sm text-muted-foreground">Landing Page</div>
              </Card>
              <Card className="bento-card p-4 text-center hover-glow">
                <div className="w-12 h-12 rounded-lg bg-orange/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📧</span>
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{webhookResponse.deliveryPackage.email.templates.length}</div>
                <div className="text-sm text-muted-foreground">Email Template</div>
              </Card>
              <Card className="bento-card p-4 text-center hover-glow">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎥</span>
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{webhookResponse.deliveryPackage.video.concepts.length || 0}</div>
                <div className="text-sm text-muted-foreground">Video Concepts</div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <div className="flex flex-wrap gap-6 mb-12 justify-center">
          <Button 
            onClick={handleBulkApprove} 
            size="lg"
            className="gradient-mint text-black shadow-glow-mint px-8 py-4 text-lg hover-glow"
          >
            ✅ Approve All ({totalCount})
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={isSubmitting}
            size="lg"
            className="gradient-orange text-white shadow-glow-orange px-8 py-4 text-lg hover-glow"
          >
            {isSubmitting ? "⏳ Preparing..." : "📥 Download Package"}
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSubmitting}
            size="lg"
            variant="outline"
            className="bento-card border-primary/30 text-primary hover:gradient-purple hover:text-white px-8 py-4 text-lg shadow-glow transition-all duration-300"
          >
            {isSubmitting ? "⏳ Sending..." : "📧 Email Package"}
          </Button>
        </div>

        {/* Social Media Content Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">
            <span className="gradient-text">Social Media Content</span>
          </h2>
          <div className="grid gap-6">
            {webhookResponse.deliveryPackage.social_media.captions.map((caption, index) => {
              const key = `${caption.platform}-${index}`;
              const platformInfo = getPlatformInfo(caption.platform);
              const state = approvalStates[key] || { approved: false, content: caption.caption, edited: false };
              
              return (
                <Card key={key} className={`transition-all duration-300 ${state.approved ? 'bento-card-mint shadow-glow-mint' : 'bento-card shadow-glow'} p-6`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                          <span className="text-2xl">{platformInfo.icon}</span>
                        </div>
                        <div>
                          <span className="text-xl font-bold gradient-text">{platformInfo.name}</span>
                          <Badge className="ml-3 bg-secondary/20 text-secondary-foreground border-secondary/30">{caption.type}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {state.approved ? (
                          <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2 text-base">Approved ✅</Badge>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleReject(key)}
                              size="sm"
                              className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20 px-4"
                            >
                              ❌ Reject
                            </Button>
                            <Button
                              onClick={() => handleApprove(key)}
                              size="sm"
                              className="gradient-mint text-black shadow-glow-mint hover:scale-105 transition-transform px-4"
                            >
                              ✅ Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      value={state.content}
                      onChange={(e) => handleEdit(key, e.target.value)}
                      className="min-h-[120px] resize-y bg-background/50 border-border/30 text-base"
                      placeholder="Content will appear here..."
                    />
                    {state.edited && (
                      <Badge className="bg-orange/20 text-orange border-orange/30">
                        ✏️ Edited
                      </Badge>
                    )}
                    <div className="p-4 bento-card rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Call to Action</div>
                      <div className="font-medium text-foreground">{caption.cta}</div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
          </div>
        </div>

          {/* Hashtags */}
          <Card className="mt-8 bento-card shadow-glow p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <span className="text-3xl">#</span>
                <span className="gradient-text">Hashtags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {webhookResponse.deliveryPackage.social_media.hashtags.map((hashtag, index) => (
                  <Badge key={index} className="px-4 py-2 text-sm gradient-purple text-white hover:scale-105 transition-transform border-0 shadow-glow">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Template Preview */}
          <Card className="mt-8 bento-card-accent shadow-glow p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold gradient-text flex items-center gap-3">
                <span className="text-3xl">📧</span>
                Email Template
              </CardTitle>
              <CardDescription className="text-base mt-3">
                <strong className="gradient-text-orange">Subject Lines:</strong> {webhookResponse.deliveryPackage.email.subjectLines.join(" • ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bento-card rounded-xl p-6 max-h-96 overflow-y-auto border border-border/20">
                <div dangerouslySetInnerHTML={{ 
                  __html: webhookResponse.deliveryPackage.email.templates[0]?.html || 'Email template will appear here...' 
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Landing Page Preview */}
          <Card className="mt-8 bento-card shadow-glow p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold gradient-text flex items-center gap-3">
                <span className="text-3xl">🏠</span>
                Landing Page
              </CardTitle>
              <CardDescription className="text-base mt-3">
                SEO-optimized landing page with lead capture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bento-card rounded-lg">
                  <strong className="gradient-text text-lg">Title:</strong> 
                  <p className="mt-2 text-base text-foreground">{webhookResponse.deliveryPackage.landing_page.seo.title}</p>
                </div>
                <div className="p-4 bento-card rounded-lg">
                  <strong className="gradient-text text-lg">Description:</strong> 
                  <p className="mt-2 text-base text-foreground">{webhookResponse.deliveryPackage.landing_page.seo.description}</p>
                </div>
                <Button variant="outline" asChild className="bento-card border-primary/30 text-primary hover:gradient-purple hover:text-white transition-all duration-300 px-6 py-3 shadow-glow">
                  <a href={webhookResponse.access.landingPage} target="_blank" rel="noopener noreferrer">
                    👀 Preview Landing Page
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Final Actions */}
          <div className="mt-16 text-center space-y-8">
            <Card className="bento-card-accent p-8 shadow-glow inline-block">
              <CardContent className="p-0">
                {approvedCount === totalCount ? (
                  <div className="space-y-3">
                    <div className="text-4xl">🎉</div>
                    <div className="text-2xl font-bold gradient-text">All content approved!</div>
                    <div className="text-lg text-muted-foreground">Ready to download your complete package</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-4xl">📝</div>
                    <div className="text-2xl font-bold gradient-text">{approvedCount}/{totalCount} items approved</div>
                    <div className="text-lg text-muted-foreground">Review remaining items to continue</div>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                onClick={handleDownload} 
                size="lg"
                disabled={isSubmitting}
                className="px-12 py-4 text-lg gradient-orange text-white shadow-glow-orange hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? "⏳ Processing..." : "📥 Download Complete Package"}
              </Button>
              <Button 
                onClick={handleSendEmail}
                variant="outline" 
                size="lg"
                disabled={isSubmitting}
                className="px-12 py-4 text-lg bento-card border-primary/30 text-primary hover:gradient-purple hover:text-white transition-all duration-300 shadow-glow"
              >
                {isSubmitting ? "⏳ Sending..." : "📧 Email to Client"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold gradient-text">Loading...</h1>
          <p className="text-muted-foreground mt-4 text-lg">Loading your content approval interface</p>
        </div>
      </div>
    </div>
  );
}

export default function ApprovePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ApproveContent />
    </Suspense>
  );
}