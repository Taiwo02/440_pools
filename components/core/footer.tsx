import React from 'react';
import {
  RiGlobalLine,
  RiThumbUpFill,
  RiMailFill,
  RiLayoutGridFill
} from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="bg-(--bg-surface) pt-16 pb-12 px-6 md:px-12 lg:px-24 border-t border-gray-100">
      <div className="mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-(--primary) p-2 rounded-lg flex items-center justify-center">
                <RiLayoutGridFill className="text-white text-xl" />
              </div>
              <span className="font-bold text-xl tracking-tight text-(--text-primary)">GLOBALSOURCE</span>
            </div>
            <p className="text-(--text-muted) text-[14px] leading-relaxed mb-6 max-w-60">
              The leading B2B marketplace for global trade and wholesale bulk purchasing.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<RiGlobalLine size={20} />} />
              <SocialIcon icon={<RiThumbUpFill size={20} />} />
              <SocialIcon icon={<RiMailFill size={20} />} />
            </div>
          </div>

          {/* Links Sections */}
          <FooterColumn
            title="Trade Platform"
            links={['All Categories', 'Group Buying', 'Ready to Ship', 'Post an RFQ']}
          />
          <FooterColumn
            title="For Suppliers"
            links={['Sell on GlobalSource', 'Verified Factories', 'Learning Center', 'Partnerships']}
          />
          <FooterColumn
            title="Support"
            links={['Help Center', 'Trade Assurance', 'Safety & Security', 'Logistics Tracking']}
          />

          {/* Newsletter Section */}
          <div className="flex flex-col">
            <h4 className="font-bold text-(--text-primary) text-[11px] uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-tighter mb-4">
              Global Sourcing Insights
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-(--border-muted) rounded-xl py-3 px-4 text-sm outline-none focus:border-(--primary) transition-all bg-(--bg-surface) shadow-sm placeholder:text-(--text-muted)"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
            © 2024 GLOBALSOURCE B2B NETWORK. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {['Privacy Policy', 'Terms of Use', 'Legal Note'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] hover:text-slate-800 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Internal Helper: Column
const FooterColumn = ({ title, links }: { title: string, links: string[] }) => (
  <div className="flex flex-col">
    <h4 className="font-bold text-[#1a2b3c] text-[11px] uppercase tracking-widest mb-6">{title}</h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="text-[14px] text-slate-500 font-semibold hover:text-[#ff7a00] transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Internal Helper: Social Icon
const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-white hover:text-[#ff7a00] hover:shadow-md transition-all border border-transparent hover:border-slate-100">
    {icon}
  </a>
);

export default Footer;