import nodemailer from 'nodemailer';

interface MembershipFormData {
  // Primary member details
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  workStatus: string;
  address: string;
  companyName: string;
  primaryIndustry: string;
  primaryIndustryOther?: string;
  getPlatform: string;
  helpCommunity: string;
  
  // Spouse details
  spouseFirstName: string;
  spouseLastName: string;
  spousePhone: string;
  spouseEmail: string;
  spouseDob: string;
  spouseWorkStatus: string;
  spouseAddress: string;
  spouseCompanyName: string;
  spousePrimaryIndustry: string;
  spousePrimaryIndustryOther?: string;
  spouseGetPlatform: string;
  spouseHelpCommunity: string;
}

export async function sendMembershipEmail(formData: MembershipFormData, attachments: any[] = []) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const recipients = process.env.MEMBERSHIP_EMAIL?.split(',').map(email => email.trim()) || [];
  const additionalRecipients = process.env.ADDITIONAL_RECIPIENTS?.split(',').map(email => email.trim()).filter(Boolean) || [];
  const allRecipients = [...recipients, ...additionalRecipients];

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 0;">
      <!-- Header with gradient -->
      <div style="background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%); padding: 30px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">GMBF Global</h1>
        <h2 style="color: white; margin: 5px 0 0 0; font-size: 18px; font-weight: normal;">New Membership Application Received</h2>
      </div>

      <!-- Success message box -->
      <div style="background-color: #dbeafe; padding: 15px 20px; margin: 0; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
        <div style="color: #3b82f6; font-size: 16px;">📅</div>
        <div style="color: #1e40af; font-size: 14px;">Application submitted on ${formattedDate} at ${formattedTime}</div>
      </div>

      <!-- Email attachments notification -->
      <div style="background-color: #dbeafe; padding: 15px 20px; margin: 10px 0; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
        <div style="color: #3b82f6; font-size: 16px;">📎</div>
        <div style="color: #1e40af; font-size: 14px;">Email Attachments: Passport photos have been attached to this email for your review.</div>
      </div>

      <!-- Primary Member Information Section -->
      <div style="background-color: white; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
          <div style="color: #3b82f6; font-size: 20px;">👤</div>
          <h3 style="color: #1f2937; margin: 0; font-size: 20px; font-weight: 600;">Primary Member Information</h3>
        </div>
        <div style="height: 3px; background-color: #10b981; margin-bottom: 20px;"></div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Full Name</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.firstName} ${formData.lastName}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Email Address</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #3b82f6; font-size: 14px;"><a href="mailto:${formData.email}" style="color: #3b82f6; text-decoration: none;">${formData.email}</a></div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Phone Number</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.phone}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Date of Birth</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.dob}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Work Status</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.workStatus}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Address</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.address}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Company Name</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.companyName}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Primary Industry</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.primaryIndustry}</div>
          </div>
          ${formData.primaryIndustryOther ? `
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Other Industry</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.primaryIndustryOther}</div>
          </div>
          ` : ''}
          <div style="grid-column: 1 / -1;">
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">What they want from the Platform</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.getPlatform}</div>
          </div>
          <div style="grid-column: 1 / -1;">
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">How they want to help the GMBF Global community</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.helpCommunity}</div>
          </div>
        </div>
      </div>

      <!-- Spouse Details Section -->
      <div style="background-color: white; padding: 20px; border-top: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
          <div style="color: #3b82f6; font-size: 20px;">👤</div>
          <h3 style="color: #1f2937; margin: 0; font-size: 20px; font-weight: 600;">Spouse Details</h3>
        </div>
        <div style="height: 3px; background-color: #10b981; margin-bottom: 20px;"></div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Full Name</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseFirstName} ${formData.spouseLastName}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Email Address</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #3b82f6; font-size: 14px;"><a href="mailto:${formData.spouseEmail}" style="color: #3b82f6; text-decoration: none;">${formData.spouseEmail}</a></div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Phone Number</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spousePhone}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Date of Birth</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseDob}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Work Status</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseWorkStatus}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Address</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseAddress}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Company Name</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseCompanyName}</div>
          </div>
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Primary Industry</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spousePrimaryIndustry}</div>
          </div>
          ${formData.spousePrimaryIndustryOther ? `
          <div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Other Industry</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spousePrimaryIndustryOther}</div>
          </div>
          ` : ''}
          <div style="grid-column: 1 / -1;">
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">What they want from the Platform</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseGetPlatform}</div>
          </div>
          <div style="grid-column: 1 / -1;">
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">How they want to help the GMBF Global community</div>
            <div style="background-color: #f3f4f6; padding: 10px; border-radius: 6px; color: #1f2937; font-size: 14px;">${formData.spouseHelpCommunity}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: allRecipients.join(', '),
    subject: 'GMBF Global - Couple Membership Application Confirmation',
    html: htmlContent,
    attachments: attachments,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
}
