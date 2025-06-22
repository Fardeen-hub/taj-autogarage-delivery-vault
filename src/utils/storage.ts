
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
  signature: string;
  documents: {[key: string]: string};
  createdAt: string;
}

const STORAGE_KEY = 'tajAutogarageRecords';

export const saveDeliveryRecord = (record: DeliveryRecord): void => {
  try {
    const existingRecords = getDeliveryRecords();
    const updatedRecords = [...existingRecords, record];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Error saving delivery record:', error);
    throw new Error('Failed to save delivery record');
  }
};

export const getDeliveryRecords = (): DeliveryRecord[] => {
  try {
    const records = localStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error retrieving delivery records:', error);
    return [];
  }
};

export const getDeliveryRecordById = (id: string): DeliveryRecord | null => {
  const records = getDeliveryRecords();
  return records.find(record => record.id === id) || null;
};

export const getDeliveryRecordByBikeNumber = (bikeNumber: string): DeliveryRecord | null => {
  const records = getDeliveryRecords();
  return records.find(record => record.bikeNumber.toLowerCase() === bikeNumber.toLowerCase()) || null;
};

export const updateDeliveryRecord = (id: string, updates: Partial<DeliveryRecord>): boolean => {
  try {
    const records = getDeliveryRecords();
    const index = records.findIndex(record => record.id === id);
    
    if (index === -1) return false;
    
    records[index] = { ...records[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Error updating delivery record:', error);
    return false;
  }
};

export const deleteDeliveryRecord = (id: string): boolean => {
  try {
    const records = getDeliveryRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error('Error deleting delivery record:', error);
    return false;
  }
};
