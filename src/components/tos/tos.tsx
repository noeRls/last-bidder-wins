export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <p className="text-sm text-gray-600 mb-6">
        These Terms of Service ("Terms") govern your use of this platform ("Platform") 
        and its associated blockchain smart contracts ("Smart Contracts"). By using 
        the Platform, you agree to these Terms. If you do not agree, you must not use 
        the Platform.
      </p>

      <h2 className="text-xl font-bold mb-4">1. General</h2>
      <p className="text-sm text-gray-600 mb-4">
        The Platform operates autonomously using blockchain-based Smart Contracts. 
        These contracts are open-source and provided "as-is," with no guarantees, warranties, 
        or liability assumed by the creator ("Creator"). The Creator has no control over 
        transactions or funds once the Smart Contracts are deployed to the blockchain.
      </p>

      <h2 className="text-xl font-bold mb-4">2. User Responsibilities</h2>
      <ul className="list-disc text-sm text-gray-600 space-y-2 mb-4 ml-6">
        <li>
          You must ensure that your use of the Platform complies with all applicable laws, regulations, 
          and restrictions in your jurisdiction.
        </li>
        <li>
          You acknowledge that all transactions conducted via the Smart Contracts are 
          final and irreversible.
        </li>
        <li>
          You agree to bear all risks associated with using the Platform, including but not limited 
          to financial loss, errors, or technical failures.
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-4">3. No Warranties or Guarantees</h2>
      <p className="text-sm text-gray-600 mb-4">
        The Platform and Smart Contracts are provided "as-is" and without warranties 
        of any kind, whether express or implied. The Creator disclaims all warranties, 
        including but not limited to warranties of merchantability, fitness for a particular purpose, 
        and non-infringement.
      </p>

      <h2 className="text-xl font-bold mb-4">4. Financial Transactions</h2>
      <p className="text-sm text-gray-600 mb-4">
        All financial transactions conducted on the Platform are managed autonomously 
        by the Smart Contracts. The Creator has no access to or control over funds 
        and assumes no liability for any losses, thefts, or disputes arising from transactions.
      </p>

      <h2 className="text-xl font-bold mb-4">5. Risks</h2>
      <ul className="list-disc text-sm text-gray-600 space-y-2 mb-4 ml-6">
        <li><strong>Blockchain Technology:</strong> The Platform relies on blockchain technology, 
          which may be subject to vulnerabilities, exploits, or unforeseen failures.
        </li>
        <li><strong>Irreversible Transactions:</strong> All transactions are final, and refunds are 
          not possible under any circumstances.
        </li>
        <li><strong>Market Risks:</strong> The value of funds or rewards on the Platform may fluctuate 
          due to market conditions.
        </li>
        <li><strong>Regulatory Risks:</strong> Your jurisdiction may classify the Platform or its 
          services under specific regulatory requirements. You are responsible for ensuring compliance.
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-4">6. Prohibited Uses</h2>
      <ul className="list-disc text-sm text-gray-600 space-y-2 mb-4 ml-6">
        <li>
          You may not use the Platform for illegal activities, including but not limited to money laundering, 
          terrorism financing, or other criminal behavior.
        </li>
        <li>
          The Platform is not intended for use by individuals or entities in jurisdictions where 
          such use is prohibited or restricted.
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-4">7. Open-Source Nature</h2>
      <p className="text-sm text-gray-600 mb-4">
        The Smart Contracts are open source, and the Creator encourages community participation. 
        However, any use, modification, or deployment of the code is at your own risk, 
        and the Creator assumes no liability for any such use.
      </p>

      <h2 className="text-xl font-bold mb-4">8. Limitation of Liability</h2>
      <p className="text-sm text-gray-600 mb-4">
        To the maximum extent permitted by law, the Creator shall not be liable for any damages, 
        including but not limited to direct, indirect, incidental, special, consequential, or punitive damages, 
        arising out of or related to your use of the Platform.
      </p>

      <h2 className="text-xl font-bold mb-4">9. Changes to the Terms</h2>
      <p className="text-sm text-gray-600 mb-4">
        The Creator reserves the right to update these Terms at any time. Continued use of the Platform 
        after any changes constitutes your acceptance of the revised Terms.
      </p>

      <h2 className="text-xl font-bold mb-4">10. Governing Law</h2>
      <p className="text-sm text-gray-600 mb-4">
        These Terms shall be governed by and construed in accordance with the laws of France, 
        without regard to its conflict of law principles. Any disputes arising from these Terms shall 
        be resolved in the courts of France.
      </p>
    </div>
  );
}