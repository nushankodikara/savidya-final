import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-4xl py-12">

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl mb-4">
            Find Your Perfect Glasses / Shades
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop guessing! Upload a photo or use your webcam, and let our AI analyze
            your face shape to recommend the most flattering eyeglass styles.
          </p>
          <Link href="/predict" passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                Easy Upload & Webcam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Use your existing photos or capture a new one instantly with your webcam.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Our advanced algorithm accurately determines your face shape from the image.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M20.4 13.4c.6-.6.6-1.5 0-2.1l-1.4-1.4c-.6-.6-1.5-.6-2.1 0L4 22.5"/><path d="m21.5 5.5-1.4-1.4c-.6-.6-1.5-.6-2.1 0L15.5 6.5"/><path d="M12.5 7.5 7.5 12.5"/><path d="M3 21.5 7.5 17"/><path d="m17 7.5 4.5-4.5"/><path d="M16 16l-1.5 1.5"/><path d="M20.5 11.5 19 13"/><path d="M10 10l-1.5 1.5"/><path d="M7.5 15.5 6 17"/><path d="M2.5 15.5 4 17"/></svg>
                Tailored Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Receive personalized suggestions for glasses styles that complement your features.</p>
            </CardContent>
          </Card>
        </section>

        {/* How it Works Section (Optional) */}
        <section className="text-center mb-12">
           <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-8">
             How It Works
           </h2>
           <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-muted-foreground">
             <div className="flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold">1</span> Provide Image</div>
             <div>➡️</div>
             <div className="flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold">2</span> AI Analysis</div>
             <div>➡️</div>
             <div className="flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold">3</span> Get Recommendations</div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mt-16">
           <Link href="/predict" passHref>
            <Button size="lg" variant="outline">
              Try the Recommender
            </Button>
          </Link>
        </section>

      </div>
    </main>
  );
}
