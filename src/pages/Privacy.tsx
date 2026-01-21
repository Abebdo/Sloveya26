export const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-600">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. Information Collection</h2>
          <p>We collect information you provide directly to us when you use our analyzer. This includes the text messages you submit for analysis. We also collect standard usage data (IP address, browser type) for security and analytics.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">2. How We Use Information</h2>
          <p>We use the data to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Provide the scam detection service.</li>
            <li>Improve our AI models (anonymized data only).</li>
            <li>Monitor for abuse of the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">3. Data Retention</h2>
          <p>Messages submitted for analysis are processed in real-time. We do not permanently store the content of your submissions unless you explicitly opt-in to help train our models. Transient logs are deleted after 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">4. Third-Party Services</h2>
          <p>We use Cloudflare for hosting and edge computing. Their privacy policy applies to the data processed through their infrastructure.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">5. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@solveya.ai.</p>
        </section>
      </div>
    </div>
  );
};
