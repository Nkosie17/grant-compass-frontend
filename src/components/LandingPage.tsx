
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, DollarSign, FileText, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-au-purple to-au-purple-dark py-24 text-white">
        <div className="au-container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AU Grant Management System
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Streamline your grant application, management, and reporting process with our comprehensive grant management platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-au-purple hover:bg-white/90">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FileText className="h-8 w-8 text-au-purple" />}
              title="Streamlined Applications"
              description="Easy-to-use application forms with save-as-draft functionality and document uploads."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-au-purple" />}
              title="Financial Tracking"
              description="Comprehensive budget management and financial reporting tools."
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-au-purple" />}
              title="Deadline Management"
              description="Automatic reminders for application deadlines and reporting requirements."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-au-purple" />}
              title="Collaboration Tools"
              description="Work with colleagues on applications and share documents securely."
            />
            <FeatureCard 
              icon={<DollarSign className="h-8 w-8 text-au-purple" />}
              title="Funding Opportunities"
              description="Browse and filter available grant opportunities tailored to your interests."
            />
            <FeatureCard 
              icon={<FileText className="h-8 w-8 text-au-purple" />}
              title="Reporting Templates"
              description="Standardized templates for progress reports, final reports, and financial statements."
            />
          </div>
        </div>
      </section>

      {/* Upcoming Funding Opportunities */}
      <section className="py-16 bg-au-neutral-100">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Funding Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Technology Innovation Fund</CardTitle>
                <CardDescription>Deadline: July 15, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Funding for innovative technology solutions that address societal challenges. Open to faculty members with at least 3 years of research experience.</p>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-semibold text-au-purple">Up to $500,000</p>
              </CardFooter>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle>Sustainable Development Research Grant</CardTitle>
                <CardDescription>Deadline: August 30, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Support for research projects focused on sustainable development goals. Open to all faculty members and research staff.</p>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-semibold text-au-purple">Up to $350,000</p>
              </CardFooter>
            </Card>
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="group">
              <Link to="/opportunities">
                View All Opportunities 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The AU Grant Management System streamlined our entire grant process. We saved countless hours on paperwork and were able to focus on our research."
              author="Dr. Emily Chen"
              role="Associate Professor, Computer Science"
            />
            <TestimonialCard 
              quote="The reporting tools made it so much easier to track our project progress and financial compliance. Highly recommended for all researchers."
              author="Dr. Marcus Johnson"
              role="Professor, Engineering"
            />
            <TestimonialCard 
              quote="As a grant administrator, this system has revolutionized how we process applications and manage funding. The efficiency gains are tremendous."
              author="Sarah Williams"
              role="Director, Research Administration"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-au-purple text-white">
        <div className="au-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the AU research community and take advantage of our comprehensive grant management platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-au-purple hover:bg-white/90">
              <Link to="/register">Create an Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-au-neutral-900 text-white/80">
        <div className="au-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">AU Grant Management</h3>
              <p>Empowering research and innovation through streamlined grant management.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><Link to="/opportunities" className="hover:text-white">Opportunities</Link></li>
                <li><Link to="/help" className="hover:text-white">Help & Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">User Guides</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Policies</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>AU Research Office</li>
                <li>Email: grants@au.edu</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p>© {new Date().getFullYear()} AU Grant Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
}> = ({ quote, author, role }) => {
  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="mb-4 text-4xl text-au-purple">"</div>
        <p className="italic mb-6">{quote}</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandingPage;
