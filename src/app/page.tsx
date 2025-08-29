import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Badge */}
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
              🚀 Launch Listings Faster Than Ever
            </Badge>
          </div>

          {/* Main Hero */}
          <div className="text-center space-y-8 mb-20">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">Listing Launch</span>
              <br />
              <span className="text-foreground">Makes Real Estate</span>
              <br />
              <span className="gradient-text-orange">Marketing Effortless</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Generate professional listing content, social media posts, and marketing materials in seconds. 
              Stop procrastinating, start launching.
            </p>
            <div className="flex gap-4 justify-center items-center mt-12">
              <Link href="/create">
                <Button size="lg" className="gradient-orange text-white shadow-glow-orange text-lg px-10 py-4 hover-glow">
                  Start Creating →
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-muted-foreground/20 text-muted-foreground hover:text-foreground px-8 py-4">
                See Examples
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Section */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 grid-rows-6 gap-6 h-[800px]">
            
            {/* Large Feature Card - Instant Generation */}
            <Card className="col-span-12 md:col-span-6 row-span-3 bento-card-accent p-8 relative overflow-hidden group">
              <CardContent className="p-0 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Lightning Fast Content</h3>
                  <p className="text-lg text-muted-foreground">
                    Generate compelling listing descriptions, social posts, and marketing copy in under 30 seconds.
                  </p>
                </div>
                <div className="mt-8 p-4 bento-card rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Generation Speed</span>
                    <span className="text-xl font-bold text-primary">Under 30s</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-3">
                    <div className="bg-gradient-purple h-3 rounded-full w-[95%] shadow-glow"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="col-span-12 md:col-span-3 row-span-2 bento-card-mint p-6">
              <CardContent className="p-0 h-full flex flex-col justify-center text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold gradient-text">10,000+</div>
                  <div className="text-sm text-muted-foreground">Listings Launched</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-2xl font-bold text-accent">98%</div>
                  <div className="text-xs text-muted-foreground">Agent Satisfaction</div>
                </div>
              </CardContent>
            </Card>

            {/* Time Saver Card */}
            <Card className="col-span-12 md:col-span-3 row-span-2 bento-card p-6">
              <CardContent className="p-0 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-orange/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Save 4+ Hours</h4>
                  <p className="text-sm text-muted-foreground">Per listing on content creation</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Features Card */}
            <Card className="col-span-12 md:col-span-4 row-span-2 bento-card p-6">
              <CardContent className="p-0 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">AI-Powered Writing</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart algorithms that understand real estate language and buyer psychology.
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Property Analysis</Badge>
                  <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">Market Insights</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Multi-format Card */}
            <Card className="col-span-12 md:col-span-5 row-span-2 bento-card p-6">
              <CardContent className="p-0 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">📄</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Multiple Formats</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate content for every platform and purpose in one click.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/30 rounded p-2 text-center">MLS Description</div>
                  <div className="bg-muted/30 rounded p-2 text-center">Social Media</div>
                  <div className="bg-muted/30 rounded p-2 text-center">Email Campaigns</div>
                  <div className="bg-muted/30 rounded p-2 text-center">Flyers & Ads</div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicator */}
            <Card className="col-span-12 md:col-span-3 row-span-1 bento-card p-4">
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">Trusted by Top Agents</div>
                  <div className="text-sm text-muted-foreground">Nationwide</div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bento-card-accent p-12">
            <CardContent className="p-0 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to <span className="gradient-text-orange">Launch</span> Your Next Listing?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of agents who've already saved hundreds of hours with Listing Launch.
              </p>
              <Link href="/create">
                <Button size="lg" className="gradient-orange text-white shadow-glow-orange text-xl px-12 py-6 mt-8">
                  Get Started Now →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
