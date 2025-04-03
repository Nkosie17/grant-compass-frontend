import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, DollarSign, FileText, BarChart3, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#cf2e2e] py-24 text-white">
        <div className="au-container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="max-w-3xl">
              <img 
                src="/lovable-uploads/4af217f9-8ca2-4acc-8ba4-9320b16cf567.png" 
                alt="Africa University" 
                className="h-32 mb-6"
              />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Research Grant Funding
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Unlock funding opportunities for your groundbreaking research at Africa University. Apply today and turn your innovative ideas into reality.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="white" className="bg-black text-white hover:bg-black/90">
                  <Link to="/login">Apply Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                  <Link to="/opportunities">Browse Grants</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Why Apply Section */}
      <section className="py-16">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-4">Why Apply for Research Grants?</h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12 text-au-neutral-600">
            Africa University is committed to supporting innovative research that addresses real-world challenges and contributes to knowledge advancement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<DollarSign className="h-8 w-8 text-[#cf2e2e]" />}
              title="Financial Support"
              description="Secure funding from $5,000 to $500,000 for your research projects across various disciplines."
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-[#cf2e2e]" />}
              title="Collaboration Opportunities"
              description="Connect with fellow researchers and institutions worldwide to expand your research network."
            />
            <FeatureCard 
              icon={<FileText className="h-8 w-8 text-[#cf2e2e]" />}
              title="Publication Support"
              description="Receive assistance for publishing your research in high-impact journals and conferences."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-[#cf2e2e]" />}
              title="Career Advancement"
              description="Enhance your academic profile and reputation through funded research projects."
            />
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-16 bg-au-neutral-100">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Funding Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GrantCard
              title="Climate Change Research Initiative"
              deadline="June 30, 2024"
              amount="$75,000"
              description="Research exploring innovative solutions to mitigate climate change effects in sub-Saharan Africa."
            />
            <GrantCard
              title="Healthcare Innovation Fund"
              deadline="July 15, 2024"
              amount="$120,000"
              description="Supporting research in healthcare delivery systems and medical technology advancements."
            />
            <GrantCard
              title="Agricultural Sustainability Grant"
              deadline="August 10, 2024"
              amount="$90,000"
              description="Funding research on sustainable agricultural practices and food security solutions."
            />
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="group text-[#cf2e2e] border-[#cf2e2e] hover:bg-[#cf2e2e] hover:text-white">
              <Link to="/opportunities">
                View All Opportunities 
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The grant funding I received from AU transformed my research on sustainable water systems. It enabled me to collect field data across three countries and present findings at international conferences."
              author="Dr. Chidi Okonkwo"
              role="Environmental Sciences Department"
            />
            <TestimonialCard 
              quote="As a young researcher, the AU grant program gave me the opportunity to conduct pioneering work in digital health solutions. The support went beyond just funding, providing mentorship and resources."
              author="Dr. Amina Ibrahim"
              role="Computer Science Department"
            />
            <TestimonialCard 
              quote="The research grant enabled our team to develop a new agricultural technique that has been adopted by communities across Zimbabwe. This wouldn't have been possible without Africa University's support."
              author="Prof. Samuel Nkomo"
              role="Agricultural Sciences Department"
            />
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-au-neutral-100">
        <div className="au-container">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ProcessStep
              number="1"
              title="Create Account"
              description="Register using your @africau.edu email to access the grant management system."
            />
            <ProcessStep
              number="2"
              title="Select Opportunity"
              description="Browse available grants and select the one that matches your research focus."
            />
            <ProcessStep
              number="3"
              title="Submit Proposal"
              description="Complete the application form with your research proposal and budget details."
            />
            <ProcessStep
              number="4"
              title="Track Progress"
              description="Monitor your application status and receive notifications on the outcome."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#cf2e2e] text-white">
        <div className="au-container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Fund Your Research?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of Africa University researchers who have successfully secured grants for their innovative work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="white" className="bg-black text-white hover:bg-black/90">
              <Link to="/register">Create Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
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
              <h3 className="font-bold text-lg mb-4">Africa University</h3>
              <p>Empowering research and innovation through comprehensive grant management.</p>
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
                <li><a href="#" className="hover:text-white">Application Guide</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Research Policies</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Research Office</li>
                <li>Email: grants@africau.edu</li>
                <li>Phone: (+263) 771-234-567</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p>© {new Date().getFullYear()} Africa University Research Grant Management. All rights reserved.</p>
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

const GrantCard: React.FC<{
  title: string;
  deadline: string;
  amount: string;
  description: string;
}> = ({ title, deadline, amount, description }) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Deadline: {deadline}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{description}</p>
        <p className="text-lg font-semibold text-[#cf2e2e]">{amount}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-[#cf2e2e] text-[#cf2e2e] hover:bg-[#cf2e2e] hover:text-white">
          <Link to="/login">Apply Now</Link>
        </Button>
      </CardFooter>
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
        <div className="mb-4 text-4xl text-[#cf2e2e]">"</div>
        <p className="italic mb-6">{quote}</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const ProcessStep: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-[#cf2e2e] text-white flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default LandingPage;
