import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { updateClientSettings } from '@/store/reducers/clientSettingsSlice'

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl ">
          <CreditCard className="h-5 w-5 text-primary" />
          Billing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={loading}>
            Update Billing
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Billing