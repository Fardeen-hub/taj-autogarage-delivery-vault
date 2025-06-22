
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { getDeliveryRecords, DeliveryRecord } from '@/utils/storage';
import { generatePDF } from '@/utils/pdfGenerator';
import { Search, Download, FileText } from 'lucide-react';

const SearchRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<DeliveryRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Term Required",
        description: "Please enter a bike number to search.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const records = getDeliveryRecords();
    const found = records.find(record => 
      record.bikeNumber.toLowerCase() === searchTerm.toLowerCase()
    );

    if (found) {
      setSearchResult(found);
      toast({
        title: "Record Found",
        description: "Bike delivery record located successfully.",
      });
    } else {
      setSearchResult(null);
      toast({
        title: "No Record Found",
        description: "No delivery record found for this bike number.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    if (searchResult) {
      try {
        await generatePDF(searchResult);
        toast({
          title: "PDF Generated",
          description: "Invoice PDF has been generated successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate PDF.",
          variant: "destructive",
        });
      }
    }
  };

  const calculateDaysSinceSale = (saleDate: string) => {
    const sale = new Date(saleDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - sale.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Search Records</h1>
      
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search by Bike Number</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter bike number (e.g., KA01AB1234)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bike & Sale Information</CardTitle>
              <Badge className="text-lg px-3 py-1">
                {calculateDaysSinceSale(searchResult.saleDate)} days since sale
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Bike Number:</strong> {searchResult.bikeNumber}</p>
                <p><strong>Model:</strong> {searchResult.bikeModel || 'Not specified'}</p>
                <p><strong>Chassis Number:</strong> {searchResult.chassisNumber || 'Not specified'}</p>
                <p><strong>Registration Date:</strong> {searchResult.registrationDate || 'Not specified'}</p>
              </div>
              <div>
                <p><strong>Sale Date:</strong> {new Date(searchResult.saleDate).toLocaleDateString()}</p>
                <p><strong>Sale Amount:</strong> ₹{searchResult.sellAmount.toLocaleString()}</p>
                <p><strong>Created:</strong> {new Date(searchResult.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Buyer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p><strong>Name:</strong> {searchResult.buyerName}</p>
                  <p><strong>Mobile:</strong> {searchResult.buyerMobile}</p>
                  <p><strong>Address:</strong> {searchResult.buyerAddress || 'Not provided'}</p>
                </div>
                <div className="space-y-4">
                  {searchResult.buyerPhoto && (
                    <div>
                      <p className="font-semibold mb-2">Buyer Photo:</p>
                      <img
                        src={searchResult.buyerPhoto}
                        alt="Buyer"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  {searchResult.signature && (
                    <div>
                      <p className="font-semibold mb-2">Digital Signature:</p>
                      <img
                        src={searchResult.signature}
                        alt="Signature"
                        className="w-48 h-24 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          {Object.keys(searchResult.documents).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(searchResult.documents).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-sm font-medium mb-2 capitalize">
                        {key.replace('_', ' ')}
                      </p>
                      <img
                        src={value}
                        alt={key}
                        className="w-full h-24 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(value, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDownloadPDF} className="mr-4">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchRecords;
