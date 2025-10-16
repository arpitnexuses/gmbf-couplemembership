import { NextRequest, NextResponse } from 'next/server';
import { sendMembershipEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const membershipData = {
      // Primary member details
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      dob: formData.get('dob') as string,
      workStatus: formData.get('workStatus') as string,
      address: formData.get('address') as string,
      companyName: formData.get('companyName') as string,
      primaryIndustry: formData.get('primaryIndustry') as string,
      primaryIndustryOther: formData.get('primaryIndustryOther') as string,
      getPlatform: formData.get('getPlatform') as string,
      helpCommunity: formData.get('helpCommunity') as string,
      
      // Spouse details
      spouseFirstName: formData.get('spouseFirstName') as string,
      spouseLastName: formData.get('spouseLastName') as string,
      spousePhone: formData.get('spousePhone') as string,
      spouseEmail: formData.get('spouseEmail') as string,
      spouseDob: formData.get('spouseDob') as string,
      spouseWorkStatus: formData.get('spouseWorkStatus') as string,
      spouseAddress: formData.get('spouseAddress') as string,
      spouseCompanyName: formData.get('spouseCompanyName') as string,
      spousePrimaryIndustry: formData.get('spousePrimaryIndustry') as string,
      spousePrimaryIndustryOther: formData.get('spousePrimaryIndustryOther') as string,
      spouseGetPlatform: formData.get('spouseGetPlatform') as string,
      spouseHelpCommunity: formData.get('spouseHelpCommunity') as string,
    };

    // Handle file attachments
    const attachments: any[] = [];
    
    // Primary member passport photo
    const primaryPassportFile = formData.get('passportUpload') as File;
    if (primaryPassportFile && primaryPassportFile.size > 0) {
      const buffer = Buffer.from(await primaryPassportFile.arrayBuffer());
      attachments.push({
        filename: `primary_member_passport_${primaryPassportFile.name}`,
        content: buffer,
        contentType: primaryPassportFile.type,
      });
    }

    // Spouse passport photo
    const spousePassportFile = formData.get('spousePassportUpload') as File;
    if (spousePassportFile && spousePassportFile.size > 0) {
      const buffer = Buffer.from(await spousePassportFile.arrayBuffer());
      attachments.push({
        filename: `spouse_passport_${spousePassportFile.name}`,
        content: buffer,
        contentType: spousePassportFile.type,
      });
    }

    // Send email
    const emailResult = await sendMembershipEmail(membershipData, attachments);

    if (emailResult.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Membership application submitted successfully!',
          messageId: emailResult.messageId 
        },
        { status: 200 }
      );
    } else {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send application. Please try again.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing membership application:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your application. Please try again.' 
      },
      { status: 500 }
    );
  }
}
