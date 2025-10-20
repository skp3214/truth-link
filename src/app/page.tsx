'use client'

import Link from "next/link";
import { MessageSquare, Shield, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full">
              <MessageSquare className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-800 dark:text-yellow-200 mb-6">
            Truth<span className="text-yellow-600">Link</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-yellow-700 dark:text-yellow-300 mb-8 leading-relaxed">
            Connect anonymously. Share honestly. Build genuine relationships through authentic conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg">
                  Get Started Free
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-xl border border-yellow-200 dark:border-yellow-700/50 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              100% Anonymous
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Share your thoughts without revealing your identity. Complete privacy guaranteed.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-xl border border-yellow-200 dark:border-yellow-700/50 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Real Connections
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Build authentic relationships through honest, judgment-free conversations.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-xl border border-yellow-200 dark:border-yellow-700/50 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Instant Messaging
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Send and receive messages instantly. No registration required to send.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-white/60 dark:bg-gray-800/60 p-12 rounded-2xl border border-yellow-200 dark:border-yellow-700/50 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-6">
              Ready to start honest conversations?
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300 mb-8 text-lg">
              Join thousands of users who are already connecting authentically on TruthLink.
            </p>
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-12 py-4 text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-12 py-4 text-lg">
                  Create Your Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-yellow-200 dark:border-yellow-700/50 bg-yellow-50/50 dark:bg-yellow-900/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            © 2024 TruthLink. Connecting hearts through honest conversations.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-yellow-600 dark:text-yellow-400">
            <Link href="/privacy" className="hover:text-yellow-800 dark:hover:text-yellow-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-yellow-800 dark:hover:text-yellow-200">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-yellow-800 dark:hover:text-yellow-200">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
