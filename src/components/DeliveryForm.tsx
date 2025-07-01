import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { saveDeliveryRecord } from '@/utils/supabaseStorage';
import { generatePDF } from '@/utils/pdfGenerator';
import { Camera } from 'lucide-react';
import DocumentUpload from '@/components/DocumentUpload';

const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    bikeNumber: '',
    chassisNumber: '',
    bikeModel: '',
    bikeDetails: '',
    registrationDate: '',
    buyerName: '',
    buyerMobile: '',
    buyerAddress: '',
    sellAmount: '',
    saleDate: new Date().toISOString().split('T')[0],
  });

  const [buyerPhoto, setBuyerPhoto] = useState<string>('');
  const [documents, setDocuments] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBuyerPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.bikeNumber || !formData.buyerName || !formData.sellAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const recordData = {
        bikeNumber: formData.bikeNumber,
        chassisNumber: formData.chassisNumber,
        bikeModel: formData.bikeModel,
        bikeDetails: formData.bikeDetails,
        registrationDate: formData.registrationDate,
        buyerName: formData.buyerName,
        buyerMobile: formData.buyerMobile,
        buyerAddress: formData.buyerAddress,
        sellAmount: parseFloat(formData.sellAmount),
        saleDate: formData.saleDate,
        buyerPhoto,
        documents,
      };

      const result = await saveDeliveryRecord(recordData);
      
      if (result.success) {
        // Generate PDF with the saved record
        const fullRecord = {
          id: result.data.id,
          ...recordData,
          createdAt: new Date().toISOString(),
        };
        
        await generatePDF(fullRecord);
        
        toast({
          title: "Delivery Record Saved",
          description: "Record saved successfully to database and PDF generated!",
        });

        // Reset form
        setFormData({
          bikeNumber: '',
          chassisNumber: '',
          bikeModel: '',
          bikeDetails: '',
          registrationDate: '',
          buyerName: '',
          buyerMobile: '',
          buyerAddress: '',
          sellAmount: '',
          saleDate: new Date().toISOString().split('T')[0],
        });
        setBuyerPhoto('');
        setDocuments({});
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save delivery record.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Error",
        description: "Failed to save delivery record.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New Bike Delivery</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bike Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bike Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bikeNumber">Bike Number *</Label>
                <Input
                  id="bikeNumber"
                  name="bikeNumber"
                  value={formData.bikeNumber}
                  onChange={handleInputChange}
                  placeholder="KA01AB1234"
                  required
                />
              </div>
              <div>
                <Label htmlFor="chassisNumber">Chassis Number</Label>
                <Input
                  id="chassisNumber"
                  name="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={handleInputChange}
                  placeholder="Enter chassis number"
                />
              </div>
              <div>
                <Label htmlFor="bikeModel">Bike Model</Label>
                <Input
                  id="bikeModel"
                  name="bikeModel"
                  value={formData.bikeModel}
                  onChange={handleInputChange}
                  placeholder="Honda Activa, Bajaj Pulsar, etc."
                />
              </div>
              <div>
                <Label htmlFor="registrationDate">Registration Date</Label>
                <Input
                  id="registrationDate"
                  name="registrationDate"
                  type="date"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="sellAmount">Sell Amount *</Label>
                <Input
                  id="sellAmount"
                  name="sellAmount"
                  type="number"
                  value={formData.sellAmount}
                  onChange={handleInputChange}
                  placeholder="85000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="saleDate">Sale Date</Label>
                <Input
                  id="saleDate"
                  name="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bikeDetails">Bike Details</Label>
              <Textarea
                id="bikeDetails"
                name="bikeDetails"
                value={formData.bikeDetails}
                onChange={handleInputChange}
                placeholder="Enter additional bike details, condition, features, modifications, etc."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buyer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerName">Buyer Name *</Label>
                <Input
                  id="buyerName"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  placeholder="Enter buyer's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="buyerMobile">Mobile Number *</Label>
                <Input
                  id="buyerMobile"
                  name="buyerMobile"
                  value={formData.buyerMobile}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="buyerAddress">Address</Label>
              <Textarea
                id="buyerAddress"
                name="buyerAddress"
                value={formData.buyerAddress}
                onChange={handleInputChange}
                placeholder="Enter buyer's address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photo Capture */}
        <Card>
          <CardHeader>
            <CardTitle>Buyer Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePhotoCapture}
                className="flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Capture/Upload Photo</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                capture="user"
              />
              {buyerPhoto && (
                <div className="mt-4">
                  <img
                    src={buyerPhoto}
                    alt="Buyer Photo"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload onDocumentsChange={setDocuments} />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Generate PDF'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;
