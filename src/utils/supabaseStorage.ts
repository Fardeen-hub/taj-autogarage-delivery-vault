
import { supabase } from '@/integrations/supabase/client';

export interface DeliveryRecord {
  id: string;
  bikeNumber: string;
  chassisNumber: string;
  bikeModel: string;
  bikeDetails: string;
  registrationDate: string;
  buyerName: string;
  buyerMobile: string;
  buyerAddress: string;
  sellAmount: number;
  saleDate: string;
  buyerPhoto: string;
  documents: {[key: string]: string};
  createdAt: string;
  userId?: string;
}

export const saveDeliveryRecord = async (record: Omit<DeliveryRecord, 'id' | 'createdAt' | 'userId'>): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('delivery_records' as any)
      .insert([
        {
          bike_number: record.bikeNumber,
          chassis_number: record.chassisNumber,
          bike_model: record.bikeModel,
          bike_details: record.bikeDetails,
          registration_date: record.registrationDate || null,
          buyer_name: record.buyerName,
          buyer_mobile: record.buyerMobile,
          buyer_address: record.buyerAddress,
          sell_amount: record.sellAmount,
          sale_date: record.saleDate,
          buyer_photo: record.buyerPhoto,
          documents: record.documents,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving delivery record:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error saving delivery record:', error);
    return { success: false, error: 'Failed to save record' };
  }
};

export const getDeliveryRecords = async (): Promise<DeliveryRecord[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('delivery_records' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching delivery records:', error);
      return [];
    }

    if (!data) return [];

    // Transform database records to match our interface
    return data.map((record: any) => ({
      id: record.id,
      bikeNumber: record.bike_number,
      chassisNumber: record.chassis_number || '',
      bikeModel: record.bike_model || '',
      bikeDetails: record.bike_details || '',
      registrationDate: record.registration_date || '',
      buyerName: record.buyer_name,
      buyerMobile: record.buyer_mobile,
      buyerAddress: record.buyer_address || '',
      sellAmount: record.sell_amount,
      saleDate: record.sale_date,
      buyerPhoto: record.buyer_photo || '',
      documents: record.documents as {[key: string]: string} || {},
      createdAt: record.created_at,
      userId: record.user_id
    }));
  } catch (error) {
    console.error('Error fetching delivery records:', error);
    return [];
  }
};

export const deleteDeliveryRecord = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('delivery_records' as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting delivery record:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting delivery record:', error);
    return { success: false, error: 'Failed to delete record' };
  }
};
