import { useState, useEffect, useRef } from 'react';
import { Menu, X, Zap, Eye, Film, TrendingUp, Github, Twitter, Download, Check, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GetStartedDialog } from '@/components/get-started-dialog';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VideoCardProps {
  title: string;
  videoUrl: string;
  captionsUrl: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transitions = [
    { 
      title: "Squat Flip", 
      videoUrl: "https://videos.pexels.com/video-files/12169639/12169639-hd_1080_1920_30fps.mp4",
      captionsUrl: "https://example.com/captions/squat-flip.vtt"
    },
    { 
      title: "Snow Splash", 
      videoUrl: "https://videos.pexels.com/video-files/8027230/8027230-uhd_1440_2732_25fps.mp4",
      captionsUrl: "https://example.com/captions/snow-splash.vtt"
    },
    { 
      title: "Skater Boy", 
      videoUrl: "https://videos.pexels.com/video-files/30393112/13025095_1080_1920_24fps.mp4",
      captionsUrl: "https://example.com/captions/skater-boy.vtt"
    },
    { 
      title: "2025 So Far", 
      videoUrl: "https://videos.pexels.com/video-files/4920770/4920770-uhd_1440_2732_25fps.mp4",
      captionsUrl: "https://example.com/captions/2025-so-far.vtt"
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for content creators just getting started",
      features: [
        "10 video downloads per month",
        "720p video quality",
        "Basic transitions",
        "Email support",
        "1 user account"
      ]
    },
    {
      name: "Pro",
      price: "$29",
      description: "For professional content creators",
      features: [
        "Unlimited video downloads",
        "4K video quality",
        "Premium transitions",
        "Priority support",
        "3 user accounts",
        "Custom branding",
        "Analytics dashboard"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "8K video quality",
        "Custom transitions",
        "24/7 phone support",
        "Unlimited user accounts",
        "API access",
        "Custom integration",
        "Dedicated account manager"
      ]
    }
  ];

  const VideoCard = ({ title, videoUrl, captionsUrl }: VideoCardProps) => {
    const [downloadStatus, setDownloadStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef(null);

    const handleDownload = async () => {
      try {
        setDownloadStatus('downloading');
        setError(null);
        
        const response = await fetch(videoUrl);
        if (!response.ok) throw new Error('Download failed');
        
        const contentLength = response.headers.get('content-length') ?? '0';
        const total = parseInt(contentLength, 10);
        let loaded = 0;
        
        if (!response.body) throw new Error('No response body');
        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          loaded += value.length;
          setProgress(Math.round((loaded / total) * 100));
        }

        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloadStatus('complete');
      } catch (err) {
        setError('Failed to download video. Please try again.');
        setDownloadStatus('idle');
      }
    };

    return (
      <Card className="relative flex flex-col max-w-sm mx-auto">
        <div className="aspect-[9/16] relative overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            preload="metadata"
            aria-label={`Video: ${title}`}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
            <track 
              kind="captions" 
              src={captionsUrl} 
              srcLang="en" 
              label="English" 
              default 
            />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg">{title}</h3>
          
          {error && (
            <div className="text-red-500 text-sm mb-2" role="alert">
              {error}
            </div>
          )}

          {downloadStatus === 'idle' && (
            <Button 
              onClick={handleDownload}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
              aria-label={`Download ${title}`}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          )}

          {downloadStatus === 'downloading' && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-gray-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </span>
                <span>{progress}%</span>
              </div>
            </div>
          )}

          {downloadStatus === 'complete' && (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              disabled
            >
              <Check className="w-4 h-4" />
              <span>Downloaded</span>
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className={`text-2xl font-bold ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HooksVideo
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center gap-8`}>
              <a 
                href="#features" 
                className={`${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                } transition-colors`}
              >
                Features
              </a>
              <a 
                href="#gallery" 
                className={`${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                } transition-colors`}
              >
                Gallery
              </a>
              <a 
                href="#pricing" 
                className={`${
                  isScrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                } transition-colors`}
              >
                Pricing
              </a>
              <GetStartedDialog>
                <Button className={`${
                  isScrolled 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-white text-primary hover:bg-white/90'
                }`}>
                  Get Started
                </Button>
              </GetStartedDialog>
            </div>

            {/* Mobile Navigation Button */}
            <button 
              className={`md:hidden ${isScrolled ? 'text-gray-900' : 'text-white'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            fixed inset-0 bg-white z-50 transition-transform duration-300 md:hidden
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          aria-hidden={!isMenuOpen}
        >
          <div className="container py-6">
            <div className="flex justify-between items-center mb-8">
              <a href="/" className="text-2xl font-bold text-primary">
                HooksVideo
              </a>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-900">
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-gray-900 hover:text-primary text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#gallery" 
                className="text-gray-900 hover:text-primary text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </a>
              <a 
                href="#pricing" 
                className="text-gray-900 hover:text-primary text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <GetStartedDialog>
                <Button className="bg-primary text-white hover:bg-primary/90 w-full">
                  Get Started
                </Button>
              </GetStartedDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary" 
        id="main-content"
      >
        <div className="container py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
            <h1 className="font-bold text-white">
              Transitional Hooks for Viral Videos
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Make Your Videos Unstoppable with HooksVideo.com! Boost audience retention and go viral!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GetStartedDialog>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Get Started Free
                </Button>
              </GetStartedDialog>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                onClick={() => {
                  document.getElementById('gallery')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="container">
          <h2 className="text-center mb-12 text-gray-900 text-4xl font-bold">
            Why Use Transitional Hooks?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <Zap className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Boost Engagement</h3>
              <p className="text-gray-600">Keep your audience hooked with seamless transitions.</p>
            </Card>
            <Card className="p-6">
              <Eye className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Audience Retention</h3>
              <p className="text-gray-600">Maintain viewer interest throughout your content.</p>
            </Card>
            <Card className="p-6">
              <Film className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Professional Quality</h3>
              <p className="text-gray-600">Create polished, high-quality video content.</p>
            </Card>
            <Card className="p-6">
              <TrendingUp className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Viral Potential</h3>
              <p className="text-gray-600">Increase your chances of creating trending content.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20" id="gallery">
        <div className="container">
          <h2 className="text-center mb-12 text-4xl font-bold text-gray-900">
            Featured Shorts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transitions.map((item, index) => (
              <VideoCard 
                key={index} 
                title={item.title}
                videoUrl={item.videoUrl}
                captionsUrl={item.captionsUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-white">Ready to Transform Your Videos?</h2>
            <p className="text-white/90">
              Join thousands of content creators who are already using HooksVideo to create viral content.
            </p>
            <GetStartedDialog>
              <Button size="lg" className="btn btn-primary bg-white text-primary hover:bg-white/90">
                Start Creating Now
              </Button>
            </GetStartedDialog>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 text-lg">
              Choose the perfect plan for your content creation needs. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative rounded-2xl bg-white p-8 shadow-lg transition-transform hover:scale-105 ${
                  tier.highlighted 
                    ? 'ring-2 ring-primary shadow-xl scale-105 md:scale-110' 
                    : ''
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    tier.highlighted
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-gray-900 hover:bg-gray-800'
                  } text-white font-medium py-3 rounded-lg transition-colors`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600">
              Need a custom plan? <a href="#contact" className="text-primary font-medium">Contact us</a>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white" id="contact">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get in Touch</h2>
            <p className="text-gray-600 text-lg">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input 
                      id="firstName"
                      placeholder="John"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input 
                      id="lastName"
                      placeholder="Doe"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Your message here..."
                    className="w-full h-32"
                  />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Send Message
              </Button>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 lg:pl-12">
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-600">support@hooksvideo.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Office</h4>
                      <p className="text-gray-600">
                        123 Video Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM PST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">HooksVideo</h3>
              <p className="text-gray-400">Making content creation easier.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#gallery" className="text-gray-400 hover:text-white">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://twitter.com" className="text-gray-400 hover:text-white" aria-label="Twitter">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://github.com" className="text-gray-400 hover:text-white" aria-label="GitHub">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HooksVideo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;