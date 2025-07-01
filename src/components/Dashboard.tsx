import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { getDeliveryRecords, DeliveryRecord } from '@/utils/supabaseStorage';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [records, setRecords] = useState<DeliveryRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DeliveryRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadRecords = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const allRecords = await getDeliveryRecords();
        setRecords(allRecords);
        setFilteredRecords(allRecords);
      } catch (error) {
        console.error('Error loading records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = records.filter(record => 
        record.saleDate.startsWith(selectedDate)
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [selectedDate, records]);

  const todayRecords = records.filter(record => 
    record.saleDate.startsWith(new Date().toISOString().split('T')[0])
  );

  const totalSales = filteredRecords.reduce((sum, record) => sum + record.sellAmount, 0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/delivery-form">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + New Delivery
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{records.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayRecords.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Filtered Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{filteredRecords.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sales Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedDate('')}
            >
              Clear Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No delivery records found.</p>
          ) : (
            <div className="space-y-4">
              {filteredRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-lg">{record.bikeNumber}</h3>
                          <p className="text-gray-600">{record.buyerName}</p>
                        </div>
                        <Badge variant="secondary">
                          {record.bikeModel}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Sale Date: {new Date(record.saleDate).toLocaleDateString()} | 
                        Amount: ₹{record.sellAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="mb-2">
                        {Math.floor((Date.now() - new Date(record.saleDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
