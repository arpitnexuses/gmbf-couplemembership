"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const industries = [
  "Accounting & Auditing",
  "Advertising",
  "Agriculture",
  "Architects",
  "Automobiles",
  "Aviation",
  "Banking",
  "Building Contracting",
  "Building Materials",
  "Beauty Parlor",
  "Business Consultant",
  "Business Set-Up Services",
  "Chemicals Trading",
  "Corporate Gifts / Promotion items",
  "Commodities Trading",
  "Design & Fit Out",
  "Education",
  "Engineering Consultants",
  "Engineering Services",
  "Financial Advisory",
  "Facilities Management",
  "Fashion Design",
  "FMCG Products Trading",
  "Food Processing",
  "Foodstuff Trading",
  "Food & Beverages / Restaurants",
  "Freelancer",
  "Garments / Textiles",
  "General Trading",
  "Healthcare",
  "HR Consulting",
  "Homemaker",
  "Hospitality",
  "Industrial Automation",
  "Insurance",
  "Insurance Broker",
  "Investments",
  "IT Consulting – Hardware",
  "IT Consulting – Software & Solutions",
  "Legal",
  "Management Consulting",
  "Manpower Supply",
  "Manufacturing",
  "Marketing / Brand Consulting",
  "Media",
  "Moving & Relocation Services",
  "Oil & Gas Products",
  "Oil & Gas Services",
  "Outsourcing",
  "Precious Metals Trading",
  "Pharmaceuticals",
  "Quality Consulting / Certifications",
  "Recruitment Services",
  "Real Estate Development",
  "Real Estate Broker",
  "Retail",
  "Shipping",
  "Software Development",
  "Sports",
  "Start-up",
  "Student",
  "Trade Finance",
  "Transportation",
  "Training & Development",
  "Travel & Tourism",
  "Telecom",
  "Valuation Services",
  "Other",
]

function IndustrySelect({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0">
        <SelectValue placeholder="Select Industry" />
      </SelectTrigger>
      <SelectContent>
        {industries.map((industry) => (
          <SelectItem key={industry} value={industry}>
            {industry}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function MembershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [formKey, setFormKey] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = (formData: FormData) => {
    const errors: string[] = []
    
    // Required fields for primary member
    const primaryFields = [
      'firstName', 'lastName', 'phone', 'email', 'dob', 'workStatus', 
      'address', 'companyName', 'primaryIndustry', 'getPlatform', 'helpCommunity'
    ]
    
    // Required fields for spouse
    const spouseFields = [
      'spouseFirstName', 'spouseLastName', 'spousePhone', 'spouseEmail', 
      'spouseDob', 'spouseWorkStatus', 'spouseAddress', 'spouseCompanyName', 
      'spousePrimaryIndustry', 'spouseGetPlatform', 'spouseHelpCommunity'
    ]
    
    // Check primary member fields
    primaryFields.forEach(field => {
      const value = formData.get(field) as string
      if (!value || value.trim() === '') {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
        errors.push(`Primary member ${fieldName} is required`)
      }
    })
    
    // Check spouse fields
    spouseFields.forEach(field => {
      const value = formData.get(field) as string
      if (!value || value.trim() === '') {
        const fieldName = field.replace('spouse', '').charAt(0).toLowerCase() + field.replace('spouse', '').slice(1)
        const displayName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')
        errors.push(`Spouse ${displayName} is required`)
      }
    })
    
    // Check file uploads
    const primaryPhoto = formData.get('passportUpload') as File
    const spousePhoto = formData.get('spousePassportUpload') as File
    
    if (!primaryPhoto || primaryPhoto.size === 0) {
      errors.push('Primary member passport photo is required')
    }
    
    if (!spousePhoto || spousePhoto.size === 0) {
      errors.push('Spouse passport photo is required')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    setSubmitMessage('')
    setValidationErrors([])

    try {
      const formData = new FormData(form)
      
      // Validate form before submission
      const errors = validateForm(formData)
      if (errors.length > 0) {
        setValidationErrors(errors)
        setIsSubmitting(false)
        return
      }
      
      const response = await fetch('/api/submit-membership', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setSubmitMessage('Application submitted successfully! We will contact you soon.')
        // Reset form
        form.reset()
        // Remount the form to clear internal component state
        setFormKey((k) => k + 1)
        setValidationErrors([])
      } else {
        setSubmitMessage(result.message || 'Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-semibold mb-2">Please fill in all required fields:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {submitMessage && (
        <div className={`mb-4 text-center ${
          submitMessage.includes('successfully') 
            ? 'bg-green-100 text-green-800 border border-green-200 p-3 rounded' 
            : 'text-red-700'
        }`}>
          {submitMessage}
        </div>
      )}
      
      <CoupleMembershipForm 
        key={formKey} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
      />
    </div>
  )
}

function CoupleMembershipForm({
  onSubmit,
  isSubmitting,
  validationErrors,
  setValidationErrors,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isSubmitting: boolean
  validationErrors: string[]
  setValidationErrors: (errors: string[]) => void
}) {
  const [formData, setFormData] = useState({
    // Primary member
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    workStatus: '',
    address: '',
    companyName: '',
    primaryIndustry: '',
    primaryIndustryOther: '',
    getPlatform: '',
    helpCommunity: '',
    // Spouse
    spouseFirstName: '',
    spouseLastName: '',
    spousePhone: '',
    spouseEmail: '',
    spouseDob: '',
    spouseWorkStatus: '',
    spouseAddress: '',
    spouseCompanyName: '',
    spousePrimaryIndustry: '',
    spousePrimaryIndustryOther: '',
    spouseGetPlatform: '',
    spouseHelpCommunity: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }
  const [primaryPhotoName, setPrimaryPhotoName] = useState('')
  const [spousePhotoName, setSpousePhotoName] = useState('')
  // Reset internal state when the component remounts (formKey changes)
  useEffect(() => {
    setPrimaryPhotoName('')
    setSpousePhotoName('')
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      dob: '',
      workStatus: '',
      address: '',
      companyName: '',
      primaryIndustry: '',
      primaryIndustryOther: '',
      getPlatform: '',
      helpCommunity: '',
      spouseFirstName: '',
      spouseLastName: '',
      spousePhone: '',
      spouseEmail: '',
      spouseDob: '',
      spouseWorkStatus: '',
      spouseAddress: '',
      spouseCompanyName: '',
      spousePrimaryIndustry: '',
      spousePrimaryIndustryOther: '',
      spouseGetPlatform: '',
      spouseHelpCommunity: '',
    })
  }, [])
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 space-y-8">
      {/* Primary Member Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-600 text-sm">
              First Name
            </Label>
            <Input 
              id="firstName" 
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-600 text-sm">
              Last Name
            </Label>
            <Input 
              id="lastName" 
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-600 text-sm">
              Phone
            </Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600 text-sm">
              Email
            </Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-gray-600 text-sm">
              DOB
            </Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              placeholder="dd / mm / yyyy"
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workStatus" className="text-gray-600 text-sm">
              Work Status
            </Label>
            <Select value={formData.workStatus} onValueChange={(value) => handleInputChange('workStatus', value)}>
              <SelectTrigger className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0">
                <SelectValue placeholder="Select Work Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="workStatus" value={formData.workStatus} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-600 text-sm">
              Address
            </Label>
            <Input 
              id="address" 
              name="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-600 text-sm">
              Company Name
            </Label>
            <Input 
              id="companyName" 
              name="companyName"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryIndustry" className="text-gray-600 text-sm">
              Your Primary Industry
            </Label>
            <IndustrySelect 
              id="primaryIndustry" 
              value={formData.primaryIndustry}
              onChange={(value) => handleInputChange('primaryIndustry', value)}
            />
            <input type="hidden" name="primaryIndustry" value={formData.primaryIndustry} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryIndustryOther" className="text-gray-600 text-sm">
            Primary Industry (If other than listed above)
          </Label>
          <Input
            id="primaryIndustryOther"
            name="primaryIndustryOther"
            value={formData.primaryIndustryOther}
            onChange={(e) => handleInputChange('primaryIndustryOther', e.target.value)}
            placeholder="Type Industry Here"
            className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="passportUpload" className="text-gray-600 text-sm">
              {"Upload – Passport Size Photos"}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="passportUpload"
                name="passportUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setPrimaryPhotoName(e.target.files?.[0]?.name || '')
                  if (validationErrors.length > 0) {
                    setValidationErrors([])
                  }
                }}
              />
              <label
                htmlFor="passportUpload"
                className="cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200"
              >
                Browse...
              </label>
              {primaryPhotoName ? (
                <span className="text-sm text-green-700">
                  Image selected: {primaryPhotoName}
                </span>
              ) : (
                <span className="text-sm text-gray-600">No files selected.</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="getPlatform" className="text-gray-600 text-sm">
              What would you like to get from this Platform
            </Label>
            <Textarea
              id="getPlatform"
              name="getPlatform"
              value={formData.getPlatform}
              onChange={(e) => handleInputChange('getPlatform', e.target.value)}
              rows={4}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="helpCommunity" className="text-gray-600 text-sm">
              How would you like to help the GMBF Global community
            </Label>
            <Textarea
              id="helpCommunity"
              name="helpCommunity"
              value={formData.helpCommunity}
              onChange={(e) => handleInputChange('helpCommunity', e.target.value)}
              rows={4}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Spouse Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Spouse Details</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spouseFirstName" className="text-gray-600 text-sm">
              First Name
            </Label>
            <Input 
              id="spouseFirstName" 
              name="spouseFirstName"
              value={formData.spouseFirstName}
              onChange={(e) => handleInputChange('spouseFirstName', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouseLastName" className="text-gray-600 text-sm">
              Last Name
            </Label>
            <Input 
              id="spouseLastName" 
              name="spouseLastName"
              value={formData.spouseLastName}
              onChange={(e) => handleInputChange('spouseLastName', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spousePhone" className="text-gray-600 text-sm">
              Phone
            </Label>
            <Input
              id="spousePhone"
              name="spousePhone"
              type="tel"
              value={formData.spousePhone}
              onChange={(e) => handleInputChange('spousePhone', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouseEmail" className="text-gray-600 text-sm">
              Email
            </Label>
            <Input
              id="spouseEmail"
              name="spouseEmail"
              type="email"
              value={formData.spouseEmail}
              onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spouseDob" className="text-gray-600 text-sm">
              DOB
            </Label>
            <Input
              id="spouseDob"
              name="spouseDob"
              type="date"
              value={formData.spouseDob}
              onChange={(e) => handleInputChange('spouseDob', e.target.value)}
              placeholder="dd / mm / yyyy"
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouseWorkStatus" className="text-gray-600 text-sm">
              Select Work Status
            </Label>
            <Select value={formData.spouseWorkStatus} onValueChange={(value) => handleInputChange('spouseWorkStatus', value)}>
              <SelectTrigger className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0">
                <SelectValue placeholder="Select Work Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="spouseWorkStatus" value={formData.spouseWorkStatus} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouseAddress" className="text-gray-600 text-sm">
              Address
            </Label>
            <Input 
              id="spouseAddress" 
              name="spouseAddress"
              value={formData.spouseAddress}
              onChange={(e) => handleInputChange('spouseAddress', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spouseCompanyName" className="text-gray-600 text-sm">
              Company Name
            </Label>
            <Input 
              id="spouseCompanyName" 
              name="spouseCompanyName"
              value={formData.spouseCompanyName}
              onChange={(e) => handleInputChange('spouseCompanyName', e.target.value)}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spousePrimaryIndustry" className="text-gray-600 text-sm">
              Your Primary Industry
            </Label>
            <IndustrySelect 
              id="spousePrimaryIndustry" 
              value={formData.spousePrimaryIndustry}
              onChange={(value) => handleInputChange('spousePrimaryIndustry', value)}
            />
            <input type="hidden" name="spousePrimaryIndustry" value={formData.spousePrimaryIndustry} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spousePrimaryIndustryOther" className="text-gray-600 text-sm">
            Primary Industry (If other than listed above)
          </Label>
          <Input
            id="spousePrimaryIndustryOther"
            name="spousePrimaryIndustryOther"
            value={formData.spousePrimaryIndustryOther}
            onChange={(e) => handleInputChange('spousePrimaryIndustryOther', e.target.value)}
            placeholder="Type Industry Here"
            className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spousePassportUpload" className="text-gray-600 text-sm">
              {"Upload – Passport Size Photos"}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="spousePassportUpload"
                name="spousePassportUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setSpousePhotoName(e.target.files?.[0]?.name || '')
                  if (validationErrors.length > 0) {
                    setValidationErrors([])
                  }
                }}
              />
              <label
                htmlFor="spousePassportUpload"
                className="cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200"
              >
                Browse...
              </label>
              {spousePhotoName ? (
                <span className="text-sm text-green-700">
                  Image selected: {spousePhotoName}
                </span>
              ) : (
                <span className="text-sm text-gray-600">No files selected.</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spouseGetPlatform" className="text-gray-600 text-sm">
              What would you like to get from this Platform
            </Label>
            <Textarea
              id="spouseGetPlatform"
              name="spouseGetPlatform"
              value={formData.spouseGetPlatform}
              onChange={(e) => handleInputChange('spouseGetPlatform', e.target.value)}
              rows={4}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouseHelpCommunity" className="text-gray-600 text-sm">
              How would you like to help the GMBF Global community
            </Label>
            <Textarea
              id="spouseHelpCommunity"
              name="spouseHelpCommunity"
              value={formData.spouseHelpCommunity}
              onChange={(e) => handleInputChange('spouseHelpCommunity', e.target.value)}
              rows={4}
              className="bg-gray-100 border-gray-300 focus:border-gray-400 focus:ring-0 resize-none"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#5fce7d] hover:bg-[#4fb86a] text-white py-6 text-lg font-normal rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}
