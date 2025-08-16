'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Calendar, Shield, FileText, Eye, MessageSquare, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import EditUserModal from './EditUserModal'
import DangerZoneModal from './DangerZoneModal'

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose }) => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const { currentUser } = useSelector((state: RootState) => state.user)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [activeTab, setActiveTab] = useState<'messages' | 'personal' | 'activity' | 'cases'>('personal')

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////// DERIVED VARIABLES /////////////////////////////////////////////////////////////
  const displayName = `${currentUser?.firstname || ''} ${currentUser?.lastname || ''}`.trim() || currentUser?.username || currentUser?.email || 'Unknown User'

  const displayEmail = currentUser?.email || 'No email provided'
  const displayPhone = currentUser?.phone || 'N/A'
  const displayLocation = currentUser?.location ? [currentUser.location.city, currentUser.location.province].filter(Boolean).join(', ') : 'N/A'
  const displayJoined = currentUser?.createdAt || 'N/A'
  const displayLastLogin = currentUser?.updatedAt || 'N/A'
  const displayVerification = currentUser?.identityVerified ? 'Verified' : 'Not Verified'

  const statusLabel = String(currentUser?.accountStatus || 'active')
  const roleLabel = (currentUser?.role ? String(currentUser.role) : 'user')
  const totalCases = 0
  const casesWon = 0
  const activeCases = 0

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'cases', label: 'Cases', icon: Shield },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  ////////////////////////////////////////////////////////// RENDERS /////////////////////////////////////////////////////////////
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl font-bold">{displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{displayName}</h3>
          <p className="text-muted-foreground">{displayEmail}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="bg-background text-muted-foreground border-border">{statusLabel}</Badge>
            <Badge className="bg-primary/10 text-primary border-transparent">{roleLabel}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground">{displayEmail}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground">{displayPhone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-foreground">{displayLocation}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="text-foreground">{displayJoined}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="text-foreground">{displayLastLogin}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Verification</p>
              <p className="text-foreground">{displayVerification}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Release Channel</p>
              <p className="text-foreground">{String((currentUser as any)?.releaseChannel || 'public')}</p>
            </div>
          </div>
        </div>
      </div>

      {currentUser?.bio && (
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground mb-2">About</h4>
          <p className="text-muted-foreground">{currentUser.bio}</p>
        </div>
      )}
    </div>
  )

  const renderActivity = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground">Total Cases</h4>
          <p className="text-2xl font-bold text-primary">{totalCases}</p>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground">Cases Won</h4>
          <p className="text-2xl font-bold text-primary">{casesWon}</p>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground">Active Cases</h4>
          <p className="text-2xl font-bold text-primary">{activeCases}</p>
        </div>
      </div>

      <div className="bg-surface rounded-lg p-4 border border-border">
        <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  Case analysis completed for {`"Case #${index + 1}"`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {index + 1} hour{index !== 0 ? 's' : ''} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCases = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">User Cases</h4>
        <Button variant="link" className="text-sm p-0 h-auto">View All Cases</Button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-foreground">
                  Case #{index + 1}
                </h5>
                <p className="text-sm text-muted-foreground">
                  Criminal Law - Theft Case
                </p>
              </div>
              <Badge variant="outline" className="bg-background text-muted-foreground border-border">{index === 0 ? 'Completed' : index === 1 ? 'In Progress' : 'Pending'}</Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Created: {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Messages & Support</h4>
        <Button variant="link" className="text-sm p-0 h-auto">Send Message</Button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-border rounded-lg p-4 bg-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium">{index === 0 ? 'S' : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h5 className="font-medium text-foreground">
                    {index === 0 ? 'Support Request' : 'User Message'}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? 'Technical issue with case upload' : 'Question about case analysis'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {index + 1}h ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">User Details</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'messages' | 'personal' | 'activity' | 'cases')}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <ScrollArea className="max-h-[60vh] mt-4">
            <TabsContent value="personal">{renderPersonalInfo()}</TabsContent>
            <TabsContent value="activity">{renderActivity()}</TabsContent>
            <TabsContent value="cases">{renderCases()}</TabsContent>
            <TabsContent value="messages">{renderMessages()}</TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <EditUserButton />
          <DangerZoneButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserDetailsModal

function EditUserButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit User</Button>
      <EditUserModal open={open} onOpenChange={setOpen} />
    </>
  )
}

function DangerZoneButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Danger Zone</Button>
      <DangerZoneModal open={open} onOpenChange={setOpen} />
    </>
  )
}
