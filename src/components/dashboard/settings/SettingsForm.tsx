'use client'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSettings } from '@/hooks/useSettings'
import SettingsSkeleton from './SettingsSkeleton'
import { currencyOptions } from '@/lib/branding/currency'

interface Settings {
  businessName: string
  businessEmail: string
  currency: string
  businessFunding: number
  notificationsEnabled: boolean
  emailNotifications: boolean
}

export function SettingsForm() {
  const {
    settingsData,
    settingsLoading,
    updateSettingsMutation,
    settingsUpdating,
    showFunding,
    setShowFunding,
    setSettingsData
  } = useSettings()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettingsMutation(settingsData)
  }

  if (settingsLoading) {
    return <SettingsSkeleton />
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={settingsData.businessName}
              onChange={(e) => setSettingsData({
                ...settingsData,
                businessName: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input
              id="businessEmail"
              type="email"
              value={settingsData.businessEmail}
              onChange={(e) => setSettingsData({
                ...settingsData,
                businessEmail: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={settingsData.currency}
              onValueChange={(value) => setSettingsData({
                ...settingsData,
                currency: value
              })}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Business Funding */}
      <Card>
        <CardHeader>
          <CardTitle>Business Funding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="businessFunding">Current Funding</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowFunding(!showFunding)}
              >
                {showFunding ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="businessFunding"
                type={showFunding ? "number" : "password"}
                min="0"
                step="0.01"
                value={settingsData.businessFunding}
                onChange={(e) => setSettingsData({
                  ...settingsData,
                  businessFunding: parseFloat(e.target.value)
                })}
                className="pl-7"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about important updates
              </p>
            </div>
            <Switch
              checked={settingsData.notificationsEnabled}
              onCheckedChange={(checked) => setSettingsData({
                ...settingsData,
                notificationsEnabled: checked
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about orders and expenses
              </p>
            </div>
            <Switch
              checked={settingsData.emailNotifications}
              onCheckedChange={(checked) => settingsData.emailNotifications = checked}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={settingsUpdating}>
          {settingsUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}

