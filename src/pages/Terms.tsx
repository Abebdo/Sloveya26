export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-600">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>
      
      <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Solveya ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
          <p>Solveya provides AI-powered analysis of text messages to identify potential scams. The Platform is for informational purposes only. Solveya does not provide legal or financial advice and does not guarantee 100% accuracy in its detection.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">3. Disclaimer of Warranties</h2>
          <p>The service is provided "as is" and "as available". We do not warrant that the results will be error-free. You should always verify suspicious messages through official channels (e.g., calling your bank directly).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">4. User Conduct</h2>
          <p>You agree not to use the Platform to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Reverse engineer the AI models.</li>
            <li>Use the API for malicious purposes or spam generation.</li>
            <li>Submit illegal content or content that violates the rights of others.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">5. Limitation of Liability</h2>
          <p>Solveya shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service, including but not limited to financial loss due to scams.</p>
        </section>
      </div>
    </div>
  );
};
