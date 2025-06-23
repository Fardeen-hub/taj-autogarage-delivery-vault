
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const RCRenewalNotification = () => {
  const [bikeNumber, setBikeNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendWhatsAppNotification } = useAuth();

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bikeNumber || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please enter both bike number and customer phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await sendWhatsAppNotification(customerPhone, bikeNumber);
      
      if (success) {
        toast({
          title: "Notification Sent",
          description: `WhatsApp notification sent to customer for bike ${bikeNumber}`,
        });
        setBikeNumber('');
        setCustomerPhone('');
      } else {
        toast({
          title: "Failed to Send",
          description: "Could not send WhatsApp notification. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">RC Card Renewal Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter bike number"
              value={bikeNumber}
              onChange={(e) => setBikeNumber(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Enter customer phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send RC Renewal Notification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RCRenewalNotification;
