"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, Users, DollarSign, Clock, CheckCircle, AlertTriangle, 
  Plus, Search, Filter, MoreHorizontal, Eye, Settings, Mail
} from 'lucide-react';
import { OrganizationProvisioningRequest, CustomerOnboardingStatus, BetaApplication } from '@/types/admin';

const SkillOSAdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [organizations, setOrganizations] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [betaApplications, setBetaApplications] = useState([]);
  const [showProvisioningForm, setShowProvisioningForm] = useState(false);

  // Mock data for demonstration
  const mockOrganizations = [
    {
      id: 'org_acme',
      name: 'Acme Corporation',
      domain: 'acme.com',
      status: 'active',
      plan: 'professional',
      seats_used: 45,
      seats_total: 50,
      mrr: 900,
      health_score: 85,
      last_activity: '2 hours ago'
    },
    {
      id: 'org_techcorp',
      name: 'TechCorp Inc',
      domain: 'techcorp.com',
      status: 'setup_in_progress',
      plan: 'enterprise',
      seats_used: 12,
      seats_total: 100,
      mrr: 3500,
      health_score: 65,
      last_activity: '1 day ago'
    }
  ];

  const mockPendingTasks = [
    {
      id: 'task_1',
      type: 'new_customer',
      company: 'Global Dynamics',
      priority: 'high',
      created: '2 hours ago',
      assigned_to: 'Sarah Chen'
    },
    {
      id: 'task_2',
      type: 'beta_approval',
      company: 'StartupXYZ',
      priority: 'medium',
      created: '1 day ago',
      assigned_to: null
    }
  ];

  const OrganizationProvisioningForm = () => {
    const [formData, setFormData] = useState<Partial<OrganizationProvisioningRequest>>({
      subscription_tier: 'professional',
      billing_cycle: 'monthly',
      custom_branding: false,
      sso_integration: false,
      custom_domain: false,
      priority_support: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        const response = await fetch('/api/admin/organizations/provision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Organization provisioned successfully! Activation link: ${result.activation_link}`);
          setShowProvisioningForm(false);
        }
      } catch (error) {
        alert('Failed to provision organization');
      }
    };

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Provision New Organization</CardTitle>
          <CardDescription>Create a new customer organization and send welcome email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Primary Domain *</Label>
                <Input
                  id="domain"
                  placeholder="company.com"
                  value={formData.domain || ''}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Admin Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin_name">Admin Name *</Label>
                <Input
                  id="admin_name"
                  value={formData.admin_name || ''}
                  onChange={(e) => setFormData({...formData, admin_name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin_email">Admin Email *</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={formData.admin_email || ''}
                  onChange={(e) => setFormData({...formData, admin_email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Subscription Details */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Plan Tier *</Label>
                <Select 
                  value={formData.subscription_tier} 
                  onValueChange={(value) => setFormData({...formData, subscription_tier: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter ($10/user/month)</SelectItem>
                    <SelectItem value="professional">Professional ($20/user/month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise ($35/user/month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seats_purchased">Seats Purchased *</Label>
                <Input
                  id="seats_purchased"
                  type="number"
                  value={formData.seats_purchased || ''}
                  onChange={(e) => setFormData({...formData, seats_purchased: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract_value">Contract Value ($) *</Label>
                <Input
                  id="contract_value"
                  type="number"
                  value={formData.contract_value || ''}
                  onChange={(e) => setFormData({...formData, contract_value: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>

            {/* Sales Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sales_rep">Sales Rep *</Label>
                <Input
                  id="sales_rep"
                  value={formData.sales_rep || ''}
                  onChange={(e) => setFormData({...formData, sales_rep: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm_deal_id">CRM Deal ID</Label>
                <Input
                  id="crm_deal_id"
                  value={formData.crm_deal_id || ''}
                  onChange={(e) => setFormData({...formData, crm_deal_id: e.target.value})}
                />
              </div>
            </div>

            {/* Special Requirements */}
            <div className="space-y-4">
              <Label>Special Requirements</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom_branding"
                    checked={formData.custom_branding}
                    onCheckedChange={(checked) => setFormData({...formData, custom_branding: checked as boolean})}
                  />
                  <Label htmlFor="custom_branding">Custom Branding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sso_integration"
                    checked={formData.sso_integration}
                    onCheckedChange={(checked) => setFormData({...formData, sso_integration: checked as boolean})}
                  />
                  <Label htmlFor="sso_integration">SSO Integration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom_domain"
                    checked={formData.custom_domain}
                    onCheckedChange={(checked) => setFormData({...formData, custom_domain: checked as boolean})}
                  />
                  <Label htmlFor="custom_domain">Custom Domain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priority_support"
                    checked={formData.priority_support}
                    onCheckedChange={(checked) => setFormData({...formData, priority_support: checked as boolean})}
                  />
                  <Label htmlFor="priority_support">Priority Support</Label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                Provision Organization & Send Welcome Email
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowProvisioningForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (showProvisioningForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <OrganizationProvisioningForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SkillOS Admin Portal</h1>
            <p className="text-gray-500">Customer organization management</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setShowProvisioningForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
            <TabsTrigger value="beta">Beta Program</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">127</div>
                  <div className="text-sm text-green-600">+12 this month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$45,230</div>
                  <div className="text-sm text-green-600">+18% growth</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Beta Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">23</div>
                  <div className="text-sm text-blue-600">8 pending approval</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Avg. Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">82</div>
                  <div className="text-sm text-yellow-600">3 at risk</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrganizations.map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{org.name}</h4>
                          <p className="text-sm text-gray-500">{org.domain} • {org.plan}</p>
                        </div>
                        <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                          {org.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPendingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{task.company}</h4>
                          <p className="text-sm text-gray-500">{task.type} • {task.created}</p>
                        </div>
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Organizations</CardTitle>
                <CardDescription>Manage all customer accounts and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrganizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{org.name}</h4>
                          <p className="text-sm text-gray-500">{org.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">${org.mrr}/month</p>
                          <p className="text-sm text-gray-500">{org.seats_used}/{org.seats_total} seats</p>
                        </div>
                        <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                          {org.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
        </Tabs>
      </div>
    </div>
  );
};

export default SkillOSAdminPortal;

