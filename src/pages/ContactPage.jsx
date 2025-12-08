import { motion } from "motion/react";
import { useState } from "react";
import { 
  IconMail, 
  IconMapPin, 
  IconPhone, 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandLinkedin,
  IconSend,
  IconCheck,
  IconAlertCircle,
  IconMessageCircle
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Failed to send message.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    { icon: IconMail, label: "Email", value: "hello@travelplanner.com" },
    { icon: IconPhone, label: "Phone", value: "+1 (555) 123-4567" },
    { icon: IconMapPin, label: "Address", value: "San Francisco, CA" },
  ];

  const socialLinks = [
    { icon: IconBrandTwitter, href: "#", color: "hover:bg-[#1DA1F2] hover:text-white" },
    { icon: IconBrandInstagram, href: "#", color: "hover:bg-[#E4405F] hover:text-white" },
    { icon: IconBrandLinkedin, href: "#", color: "hover:bg-[#0A66C2] hover:text-white" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex items-center py-4">
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
        >
          <div className="grid lg:grid-cols-5">
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-white/10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <IconMessageCircle size={22} />
                  </div>
                  <h2 className="text-xl font-bold">Get in Touch</h2>
                </div>
                <p className="text-white/70 text-sm mb-6">We'll get back to you within 24 hours.</p>

                <div className="space-y-4">
                  {contactDetails.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ${social.color}`}
                      >
                        <social.icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 p-6">
              <h2 className="text-lg font-bold mb-4">Send us a Message</h2>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-sm"
                >
                  <IconCheck className="text-emerald-500" size={18} />
                  <p className="text-emerald-600 dark:text-emerald-400">Message sent successfully!</p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-sm"
                >
                  <IconAlertCircle className="text-red-500" size={18} />
                  <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Tell us more..."
                    className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all duration-300"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <IconSend size={16} />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
