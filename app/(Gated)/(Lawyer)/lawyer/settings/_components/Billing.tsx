import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Banknote, Receipt, FileText, Download, Upload, HelpCircle, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateBilling } from '@/store/reducers/lawyerSettingsSlice';
import { PaymentMethod } from '@/lib/enums';
import toast from 'react-hot-toast';

const MOCK_PLANS = [
  { name: 'Basic', price: 0, benefits: ['Limited consultations', 'Basic support'], renewal: 'N/A' },
  { name: 'Pro', price: 2000, benefits: ['Unlimited consultations', 'Priority support', 'Payouts enabled'], renewal: '2024-12-01' },
]
const MOCK_TRANSACTIONS = [
  { id: 'INV-001', date: '2024-01-10', amount: 2000, status: 'Paid', method: 'Stripe', type: 'Subscription' },
  { id: 'INV-002', date: '2024-02-10', amount: 2000, status: 'Paid', method: 'Stripe', type: 'Subscription' },
]
const MOCK_PAYOUTS = [
  { id: 'PAYOUT-001', date: '2024-02-15', amount: 5000, status: 'Completed', method: 'Bank', schedule: 'Monthly' },
]
const MOCK_PAYMENT_METHODS = [
  { id: 'pm_1', brand: 'Visa', last4: '4242', exp: '12/26' },
]
const MOCK_TAX_DOCS = [
  { name: '2023-Form-1099.pdf', url: '#' },
]

const Billing = () => {
  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSettings } = useSelector((state: RootState) => state.lawyerSettings);
  const [selectedPlan, setSelectedPlan] = useState('Pro')
  const [paymentMethod, setPaymentMethod] = useState(selectedSettings?.billing?.paymentMethod || PaymentMethod.STRIPE);
  const [supportMsg, setSupportMsg] = useState('')
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setLoading(true);
    setSuccess(false);
    dispatch(updateBilling({ paymentMethod: method }))
      .then(() => { setSuccess(true); toast.success('Payment method updated!'); })
      .finally(() => setLoading(false));
  }
  const handleSupport = () => {
    // Placeholder for support ticket
    setSupportMsg('')
    alert('Support ticket submitted!')
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl "><CreditCard className="h-5 w-5 text-primary" /> Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-10">
        {/* Subscription Plan */}
        <div>
          <div className="font-semibold mb-2">Subscription Plan</div>
          <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-bold text-lg">{selectedPlan}</div>
              <div className="text-sm text-muted-foreground">Renewal: {MOCK_PLANS.find(p => p.name === selectedPlan)?.renewal}</div>
              <ul className="list-disc pl-5 mt-2 text-sm">
                {MOCK_PLANS.find(p => p.name === selectedPlan)?.benefits.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOCK_PLANS.map(p => <SelectItem key={p.name} value={p.name}>{p.name} ({p.price === 0 ? 'Free' : 'Rs ' + p.price})</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline">Upgrade</Button>
              <Button size="sm" variant="outline">Downgrade</Button>
            </div>
          </div>
        </div>
        {/* Payment Method */}
        <section className="space-y-2 border-b pb-6 py-0 ">
          <div className="font-semibold mb-2">Payment Method</div>
          <div className="flex gap-4 items-center">
            <Select value={paymentMethod} onValueChange={v => handlePaymentMethodChange(v as PaymentMethod)} disabled={loading}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Select payment method" /></SelectTrigger>
              <SelectContent>
                {Object.values(PaymentMethod).map(pm => (
                  <SelectItem key={pm} value={pm}>{pm.charAt(0).toUpperCase() + pm.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {success && <span className="text-green-600 text-sm">Updated!</span>}
          </div>
        </section>
        {/* Payment Methods (mock display only) */}
        <div>
          <div className="font-semibold mb-2">Saved Cards (Mock)</div>
          <div className="space-y-2">
            {MOCK_PAYMENT_METHODS.map(pm => (
              <div key={pm.id} className="flex items-center gap-4 border rounded p-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>{pm.brand} •••• {pm.last4} (exp {pm.exp})</span>
                <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
        {/* Transaction History (mock) */}
        <div>
          <div className="font-semibold mb-2">Transaction History</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Method</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="border-b">
                    <td className="p-2">{tx.id}</td>
                    <td className="p-2">{tx.date}</td>
                    <td className="p-2">Rs {tx.amount}</td>
                    <td className="p-2">{tx.status}</td>
                    <td className="p-2">{tx.method}</td>
                    <td className="p-2">{tx.type}</td>
                    <td className="p-2"><Button size="sm" variant="ghost"><Receipt className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />Export PDF</Button>
              <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-1" />Export CSV</Button>
            </div>
          </div>
        </div>
        {/* Payout Settings (mock) */}
        <div>
          <div className="font-semibold mb-2">Payout Settings</div>
          <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-medium">Bank Account / Stripe Connect</div>
              <div className="text-sm text-muted-foreground">Account: ****1234 (HBL)</div>
              <div className="text-sm text-muted-foreground">Payout Schedule: Monthly</div>
            </div>
            <div>
              <Button size="sm" variant="outline"><Banknote className="h-4 w-4 mr-1" />Update Details</Button>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-semibold mb-1">Recent Payouts</div>
            <table className="min-w-full text-sm border rounded">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Method</th>
                  <th className="p-2 text-left">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYOUTS.map(p => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.date}</td>
                    <td className="p-2">Rs {p.amount}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2">{p.method}</td>
                    <td className="p-2">{p.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Tax & Compliance Docs (mock) */}
        <div>
          <div className="font-semibold mb-2">Tax & Compliance Docs</div>
          <div className="flex flex-wrap gap-4 items-center">
            {MOCK_TAX_DOCS.map(doc => (
              <a key={doc.name} href={doc.url} className="flex items-center gap-2 text-primary underline"><FileText className="h-4 w-4" />{doc.name}</a>
            ))}
            <Button size="sm" variant="outline"><Upload className="h-4 w-4 mr-1" />Upload Tax Doc</Button>
          </div>
        </div>
        {/* Billing Support */}
        <div>
          <div className="font-semibold mb-2">Billing Support</div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input placeholder="Describe your billing issue..." value={supportMsg} onChange={e => setSupportMsg(e.target.value)} className="flex-1" />
            <Button size="sm" variant="outline" onClick={handleSupport}><HelpCircle className="h-4 w-4 mr-1" />Contact Support</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Billing