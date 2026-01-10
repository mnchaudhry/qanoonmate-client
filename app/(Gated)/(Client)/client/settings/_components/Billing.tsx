import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateClientSettings } from '@/store/reducers/clientSettingsSlice'
import { SubsectionHeader } from './sections/SubsectionHeader'

const Billing = () => {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { selectedSettings } = useSelector((state: RootState) => state.clientSettings)

  //////////////////////////////////////////////// STATE /////////////////////////////////////////////////
  const [loading, setLoading] = useState(false)

  //////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////
  useEffect(() => {
    if (selectedSettings?.billing?.paymentMethod) {
    }
  }, [selectedSettings?.billing?.paymentMethod])

  //////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////
  const handleSubmit = () => {
    setLoading(true)
    dispatch(updateClientSettings({
      billing: {}
    }))
      .finally(() => setLoading(false))
  }

  //////////////////////////////////////////////// RENDER /////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <CreditCard className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Billing & Payments</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your payment methods and billing information</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <SubsectionHeader
              title="Payment Methods"
              description="Manage your payment options"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">No payment methods added yet.</p>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} disabled={loading} size="lg">
                {loading ? 'Updating...' : 'Add Payment Method'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Billing