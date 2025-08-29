"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { FormData } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

export default function CreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    address: "",
    status: "FOR_SALE",
    name: "",
    phone: "",
    email: "",
    headshot: "",
    colors: {
      primary: "#000000",
      secondary: "#ffffff", 
      accent: "#ae6937"
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate session ID and store data
    const sessionId = uuidv4();
    localStorage.setItem(`session_${sessionId}`, JSON.stringify({
      id: sessionId,
      formData,
      createdAt: new Date().toISOString()
    }));

    // Redirect to generation page
    router.push(`/generate?session=${sessionId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('colors.')) {
      const colorField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [colorField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium mb-6">
              Step 1 of 3 • Launch Setup
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Launch</span> Your Listing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tell us about your property and branding. We'll generate all your marketing materials in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6 mb-8">
              
              {/* Property Information - Large Card */}
              <Card className="col-span-12 lg:col-span-8 bento-card-accent p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    🏠 <span className="gradient-text">Property Details</span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Let's start with your listing basics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium mb-2 block">Property Address *</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="630 Vaughan Rd, Bloomfield Hills, MI 48304"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      className="bg-background/50 border-border/30 h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium mb-2 block">Listing Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "FOR_SALE" | "RECENTLY_SOLD") => handleInputChange('status', value)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/30 h-12 text-base">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FOR_SALE">For Sale</SelectItem>
                        <SelectItem value="RECENTLY_SOLD">SOLD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Status Preview Card */}
              <Card className="col-span-12 lg:col-span-4 bento-card-mint p-6">
                <CardContent className="p-0 h-full flex flex-col justify-center text-center">
                  <div className="space-y-4">
                    <div className="text-3xl">
                      {formData.status === "FOR_SALE" ? "🏡" : "✅"}
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {formData.status === "FOR_SALE" ? "For Sale" : "Recently Sold"}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Status</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Information - Large Card */}
              <Card className="col-span-12 lg:col-span-7 bento-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    👤 <span className="text-foreground">Agent Information</span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Your professional contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nolan Grout"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="bg-background/50 border-border/30 h-12 text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium mb-2 block">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="248.225.9677"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="bg-background/50 border-border/30 h-12 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="SOLD@NolanGrout.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="bg-background/50 border-border/30 h-12 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="headshot" className="text-sm font-medium mb-2 block">Headshot URL</Label>
                    <Input
                      id="headshot"
                      type="url"
                      placeholder="https://example.com/headshot.jpg"
                      value={formData.headshot}
                      onChange={(e) => handleInputChange('headshot', e.target.value)}
                      className="bg-background/50 border-border/30 h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Optional: Add a URL to your professional headshot
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Preview Card */}
              <Card className="col-span-12 lg:col-span-5 bento-card p-6">
                <CardContent className="p-0 h-full flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📞</span>
                      </div>
                      <h4 className="font-semibold mb-2">Contact Preview</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{formData.name || "Your Name"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{formData.phone || "Your Phone"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-xs">{formData.email || "Your Email"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Colors Card */}
              <Card className="col-span-12 bento-card p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    🎨 <span className="gradient-text-orange">Brand Colors</span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Choose colors that match your personal brand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="primary" className="text-sm font-medium">Primary Color</Label>
                      <div className="flex gap-3 items-center">
                        <Input
                          id="primary"
                          type="color"
                          value={formData.colors.primary}
                          onChange={(e) => handleInputChange('colors.primary', e.target.value)}
                          className="w-14 h-14 p-1 border rounded-lg cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.colors.primary}
                          onChange={(e) => handleInputChange('colors.primary', e.target.value)}
                          className="flex-1 bg-background/50 border-border/30 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="secondary" className="text-sm font-medium">Secondary Color</Label>
                      <div className="flex gap-3 items-center">
                        <Input
                          id="secondary"
                          type="color"
                          value={formData.colors.secondary}
                          onChange={(e) => handleInputChange('colors.secondary', e.target.value)}
                          className="w-14 h-14 p-1 border rounded-lg cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.colors.secondary}
                          onChange={(e) => handleInputChange('colors.secondary', e.target.value)}
                          className="flex-1 bg-background/50 border-border/30 h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="accent" className="text-sm font-medium">Accent Color</Label>
                      <div className="flex gap-3 items-center">
                        <Input
                          id="accent"
                          type="color"
                          value={formData.colors.accent}
                          onChange={(e) => handleInputChange('colors.accent', e.target.value)}
                          className="w-14 h-14 p-1 border rounded-lg cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.colors.accent}
                          onChange={(e) => handleInputChange('colors.accent', e.target.value)}
                          className="flex-1 bg-background/50 border-border/30 h-12"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* CTA Section */}
            <div className="text-center">
              <Card className="bento-card-accent p-8 inline-block">
                <CardContent className="p-0">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="gradient-orange text-white shadow-glow-orange text-lg px-12 py-4 hover-glow"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Launch Content Generation →
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Generate all your marketing materials in under 30 seconds
                  </p>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}