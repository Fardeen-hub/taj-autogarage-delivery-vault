
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentsChange: (documents: {[key: string]: string}) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentsChange }) => {
  const [documents, setDocuments] = useState<{[key: string]: string}>({});

  const documentTypes = [
    { key: 'insurance', label: 'Insurance Document', required: true },
    { key: 'form29_30', label: 'Form 29/30', required: true },
    { key: 'aadhar', label: 'Aadhar Card', required: true },
    { key: 'bank_passbook', label: 'Bank Passbook Photo', required: true },
    { key: 'other_id', label: 'Other Govt ID', required: false },
  ];

  const handleFileUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const updatedDocuments = { ...documents, [key]: result };
        setDocuments(updatedDocuments);
        onDocumentsChange(updatedDocuments);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Upload required documents. Accepted formats: JPG, PNG, PDF
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => (
          <div key={docType.key} className="space-y-2">
            <Label className="flex items-center space-x-2">
              <span>{docType.label}</span>
              {docType.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
            </Label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {documents[docType.key] ? (
                <div className="space-y-2">
                  <Badge variant="secondary">Document Uploaded</Badge>
                  <div>
                    <img
                      src={documents[docType.key]}
                      alt={docType.label}
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(docType.key, e)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUpload;
