// Test script to verify EmailJS functionality
import emailjs from '@emailjs/browser';

// EmailJS configuration (same as in your service)
const EMAILJS_SERVICE_ID = 'service_a15iq4h';
const EMAILJS_TEMPLATE_ID_WELCOME = 'template_oef19xj';
const EMAILJS_PUBLIC_KEY = 'jN2G0MW074qCNUZAV';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Test welcome email function
const testWelcomeEmail = async () => {
  try {
    console.log('🧪 Testing welcome email functionality...');
    
    const templateParams = {
      to_email: 'kumbharsrushti.01@gmail.com', // Send test email to yourself
      to_name: 'Srushti (Test)',
      from_email: 'kumbharsrushti.01@gmail.com',
      from_name: 'SplitUp Team',
      subject: 'Welcome to SplitUp! (Test Email)',
    };

    console.log('📧 Template params:', templateParams);
    console.log('🔄 Sending test email...');

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_WELCOME,
      templateParams
    );

    console.log('✅ Test email sent successfully!');
    console.log('📊 Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Test email failed:', error);
    console.error('Error details:', error);
    throw error;
  }
};

// Run the test
testWelcomeEmail()
  .then(() => {
    console.log('🎉 Email test completed successfully!');
    console.log('📬 Check your inbox: kumbharsrushti.01@gmail.com');
  })
  .catch((error) => {
    console.error('💥 Email test failed:', error);
  });
