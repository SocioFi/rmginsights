import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Linkedin, 
  Facebook, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  Loader2,
  ExternalLink 
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    subtitle: string;
    summary: string;
    url: string;
    category: string;
  };
  userRole: string | null;
}

export function SocialShareModal({ isOpen, onClose, article, userRole }: SocialShareModalProps) {
  const [activeTab, setActiveTab] = useState('linkedin');
  const [linkedinPost, setLinkedinPost] = useState('');
  const [facebookPost, setFacebookPost] = useState('');
  const [blogPost, setBlogPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const generatePost = async (platform: 'linkedin' | 'facebook' | 'blog') => {
    setIsGenerating(true);
    
    // Simulate AI generation with role-specific content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const roleContext = userRole || 'Industry Professional';
    
    let generatedContent = '';
    
    if (platform === 'linkedin') {
      generatedContent = `🚀 ${article.title}

${article.subtitle}

As a ${roleContext} in Bangladesh's RMG sector, this development is particularly significant for our industry. Here's why this matters:

✅ This innovation addresses critical challenges we face daily in production planning and quality management
✅ The technology promises to enhance collaboration between manufacturers and international buyers
✅ Early adopters are already seeing measurable improvements in efficiency and delivery timelines

This represents a pivotal moment for Bangladesh's garment industry as we embrace AI-driven transformation to remain competitive in the global market.

What are your thoughts on AI integration in the RMG sector? How is your organization preparing for this digital shift?

#RMGIndustry #BangladeshGarments #AIInManufacturing #SupplyChain #TextileInnovation #FabricXAI

Read the full article: ${article.url}`;
    } else if (platform === 'facebook') {
      generatedContent = `🔥 Game-Changing News for Bangladesh's Garment Industry! 🇧🇩

${article.title}

${article.subtitle}

This is a must-read for everyone in the RMG sector! 👇

As a ${roleContext}, I'm excited about how this innovation will transform our daily operations. The potential impact on productivity and quality management is incredible.

Key Takeaways:
• Revolutionary AI technology specifically designed for our industry
• Proven results in efficiency and delivery accuracy
• Enhanced buyer-supplier collaboration
• Competitive advantage for Bangladesh in global markets

This is the future of garment manufacturing, and it's happening RIGHT NOW in Bangladesh! 🚀

Tag someone in the RMG industry who needs to see this! 👥

Read full details here: ${article.url}

#BangladeshRMG #GarmentIndustry #AITechnology #Innovation #TextileNews #Manufacturing`;
    } else if (platform === 'blog') {
      generatedContent = `# ${article.title}

## A ${roleContext}'s Perspective

${article.subtitle}

### Introduction

The Ready-Made Garments industry in Bangladesh is witnessing a technological revolution that promises to reshape how we operate. ${article.summary}

### Why This Matters to Our Industry

As a ${roleContext}, I've experienced firsthand the challenges of:
- Managing complex production schedules across multiple lines
- Ensuring consistent quality while meeting tight deadlines
- Coordinating with international buyers across different time zones
- Adapting to rapidly changing market demands

This new development addresses these pain points directly.

### Impact on Daily Operations

The introduction of advanced AI systems in our sector represents more than just technological advancement—it's about solving real problems that affect our bottom line and competitiveness in the global market.

**Key Benefits:**

1. **Enhanced Efficiency**: Streamlined workflows and reduced bottlenecks
2. **Better Forecasting**: Predictive analytics for demand and capacity planning
3. **Quality Assurance**: AI-powered inspection and defect detection
4. **Improved Collaboration**: Real-time communication tools for buyer-supplier coordination

### Looking Ahead

For Bangladesh's RMG industry to maintain its position as a global leader, embracing technological innovation isn't optional—it's essential. This development marks a significant step forward in our industry's digital transformation journey.

### Conclusion

The future of garment manufacturing is intelligent, connected, and data-driven. As industry professionals, our role is to adapt, learn, and leverage these tools to drive growth and competitiveness.

---

*What are your thoughts on AI adoption in the RMG sector? Share your perspectives in the comments below.*

**Source**: ${article.category} | Read original article: ${article.url}

---

*Written from the perspective of a ${roleContext} in Bangladesh's Ready-Made Garments industry*`;
    }
    
    if (platform === 'linkedin') setLinkedinPost(generatedContent);
    if (platform === 'facebook') setFacebookPost(generatedContent);
    if (platform === 'blog') setBlogPost(generatedContent);
    
    setIsGenerating(false);
  };

  const copyToClipboard = async (content: string, platform: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedTab(platform);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const shareToSocial = (platform: 'linkedin' | 'facebook') => {
    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[840px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] dark:from-[#182336] dark:to-[#101725] border-2 border-[#101725] dark:border-[#EAB308] rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl text-[#101725] dark:text-[#F9FAFB] flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAB308]" />
            <span className="hidden sm:inline">Generate Social Media Posts</span>
            <span className="sm:hidden">Generate Posts</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#6F83A7] dark:text-[#9BA5B7] mt-2">
            AI-powered content for: <Badge className="ml-1 sm:ml-2 bg-[#57ACAF] text-white text-xs">{userRole || 'Professional'}</Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full bg-white/50 dark:bg-[#101725]/50">
            <TabsTrigger 
              value="linkedin" 
              className="flex items-center gap-2 data-[state=active]:bg-[#0A66C2] data-[state=active]:text-white"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger 
              value="facebook" 
              className="flex items-center gap-2 data-[state=active]:bg-[#1877F2] data-[state=active]:text-white"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </TabsTrigger>
            <TabsTrigger 
              value="blog" 
              className="flex items-center gap-2 data-[state=active]:bg-[#6F83A7] data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              Blog Post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="linkedin" className="mt-4 space-y-4">
            {!linkedinPost ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] mb-2">
                  <Linkedin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-[#101725] dark:text-[#F9FAFB]" style={{ fontFamily: 'Georgia, serif' }}>
                  LinkedIn Professional Post
                </h3>
                <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] max-w-md mx-auto">
                  Generate a professional LinkedIn post with industry insights, hashtags, and engagement prompts tailored to your role as {userRole || 'an Industry Professional'}.
                </p>
                <Button
                  onClick={() => generatePost('linkedin')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#0A66C2] to-[#004182] hover:from-[#004182] hover:to-[#0A66C2] text-white uppercase tracking-wider text-sm px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate LinkedIn Post
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={linkedinPost}
                  onChange={(e) => setLinkedinPost(e.target.value)}
                  className="min-h-[350px] bg-white dark:bg-[#101725] border-2 border-[#E5E7EB] dark:border-[#6F83A7]/40 text-[#101725] dark:text-[#E5E7EB] resize-none"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(linkedinPost, 'linkedin')}
                    variant="outline"
                    className="flex-1 border-2 border-[#6F83A7] dark:border-[#EAB308]"
                  >
                    {copiedTab === 'linkedin' ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => shareToSocial('linkedin')}
                    className="flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Post to LinkedIn
                  </Button>
                  <Button
                    onClick={() => setLinkedinPost('')}
                    variant="ghost"
                    className="text-[#6F83A7] dark:text-[#9BA5B7]"
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="facebook" className="mt-4 space-y-4">
            {!facebookPost ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#1877F2] to-[#0C5FCD] mb-2">
                  <Facebook className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-[#101725] dark:text-[#F9FAFB]" style={{ fontFamily: 'Georgia, serif' }}>
                  Facebook Engaging Post
                </h3>
                <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] max-w-md mx-auto">
                  Create an engaging Facebook post with emojis, call-to-actions, and shareable content optimized for social engagement.
                </p>
                <Button
                  onClick={() => generatePost('facebook')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#1877F2] to-[#0C5FCD] hover:from-[#0C5FCD] hover:to-[#1877F2] text-white uppercase tracking-wider text-sm px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Facebook Post
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={facebookPost}
                  onChange={(e) => setFacebookPost(e.target.value)}
                  className="min-h-[350px] bg-white dark:bg-[#101725] border-2 border-[#E5E7EB] dark:border-[#6F83A7]/40 text-[#101725] dark:text-[#E5E7EB] resize-none"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(facebookPost, 'facebook')}
                    variant="outline"
                    className="flex-1 border-2 border-[#6F83A7] dark:border-[#EAB308]"
                  >
                    {copiedTab === 'facebook' ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => shareToSocial('facebook')}
                    className="flex-1 bg-[#1877F2] hover:bg-[#0C5FCD] text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Post to Facebook
                  </Button>
                  <Button
                    onClick={() => setFacebookPost('')}
                    variant="ghost"
                    className="text-[#6F83A7] dark:text-[#9BA5B7]"
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="blog" className="mt-4 space-y-4">
            {!blogPost ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#6F83A7] to-[#57ACAF] mb-2">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-[#101725] dark:text-[#F9FAFB]" style={{ fontFamily: 'Georgia, serif' }}>
                  Professional Blog Article
                </h3>
                <p className="text-sm text-[#6F83A7] dark:text-[#9BA5B7] max-w-md mx-auto">
                  Generate a comprehensive blog post with markdown formatting, industry analysis, and professional insights from your {userRole || 'Industry Professional'} perspective.
                </p>
                <Button
                  onClick={() => generatePost('blog')}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#6F83A7] to-[#57ACAF] hover:from-[#57ACAF] hover:to-[#6F83A7] text-white uppercase tracking-wider text-sm px-8"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Blog Post
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={blogPost}
                  onChange={(e) => setBlogPost(e.target.value)}
                  className="min-h-[350px] bg-white dark:bg-[#101725] border-2 border-[#E5E7EB] dark:border-[#6F83A7]/40 text-[#101725] dark:text-[#E5E7EB] resize-none font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(blogPost, 'blog')}
                    variant="outline"
                    className="flex-1 border-2 border-[#6F83A7] dark:border-[#EAB308]"
                  >
                    {copiedTab === 'blog' ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setBlogPost('')}
                    variant="ghost"
                    className="text-[#6F83A7] dark:text-[#9BA5B7]"
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-[#6F83A7] dark:text-[#9BA5B7] text-center">
                  Tip: This content uses Markdown formatting. Paste it into your blog platform's markdown editor.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
