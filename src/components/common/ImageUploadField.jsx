import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const ImageUploadField = ({ 
  label = 'Product Image', 
  value = '', 
  onChange, 
  required = true,
  recommendedSize = '500x500 px or JPG/PNG/WebP'
}) => {
  const [mode, setMode] = useState('upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState(value && value.startsWith('http') ? value : '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Convert file to Base64 data URL for instant client-side preview & upload
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      
      // Update UI immediately with base64 preview
      if (onChange) {
        onChange(base64Data);
      }

      // Also attempt upload to backend static uploads folder
      try {
        const uploadedUrl = await api.upload.directImage(base64Data, file.name);
        if (uploadedUrl && onChange) {
          onChange(uploadedUrl);
        }
      } catch (err) {
        console.warn('Using base64 image data:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    if (onChange) {
      onChange(val);
    }
  };

  const handleClear = (e) => {
    if (e) e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUrlInput('');
    if (onChange) {
      onChange('');
    }
  };

  const triggerFilePicker = (e) => {
    if (e) e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
        
        {/* Toggle between Upload file and Paste URL */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              border: 'none',
              background: mode === 'upload' ? '#ffffff' : 'transparent',
              color: mode === 'upload' ? '#10843e' : '#64748b',
              fontWeight: mode === 'upload' ? '700' : '500',
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: mode === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <UploadCloud size={12} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              border: 'none',
              background: mode === 'url' ? '#ffffff' : 'transparent',
              color: mode === 'url' ? '#10843e' : '#64748b',
              fontWeight: mode === 'url' ? '700' : '500',
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: mode === 'url' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <LinkIcon size={12} /> Image URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div style={{ marginBottom: '10px' }}>
          <input
            type="url"
            placeholder="Paste image link (e.g. https://...)"
            value={value || urlInput}
            onChange={handleUrlChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      )}

      {/* Upload Zone when NO image is selected */}
      {!value ? (
        <div 
          onClick={triggerFilePicker}
          style={{
            border: '2px dashed #94a3b8',
            borderRadius: '12px',
            padding: '22px 16px',
            textAlign: 'center',
            background: '#f8fafc',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10843e';
            e.currentTarget.style.background = '#f0fdf4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#94a3b8';
            e.currentTarget.style.background = '#f8fafc';
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10843e'
          }}>
            <UploadCloud size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#10843e' }}>
              {uploading ? 'Processing image...' : 'Click to browse & upload direct image from computer'}
            </span>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0' }}>
              Supports PNG, JPG, JPEG, WEBP ({recommendedSize})
            </p>
          </div>
        </div>
      ) : (
        /* Image Preview Box when image IS selected */
        <div style={{
          position: 'relative',
          borderRadius: '14px',
          border: '1.5px solid #86efac',
          padding: '12px 14px',
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 4px 12px rgba(16, 132, 62, 0.08)'
        }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={value} 
              alt="Product Preview" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80';
              }}
              style={{
                width: '74px',
                height: '74px',
                objectFit: 'contain',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                padding: '4px'
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#15803d' }}>
              <Check size={16} /> New Image Ready
            </div>
            <p style={{ fontSize: '11px', color: '#166534', margin: '2px 0 6px' }}>
              {value.startsWith('data:') ? 'Local file loaded and ready to save' : 'Image URL linked and previewing live'}
            </p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={triggerFilePicker}
                style={{
                  background: '#ffffff',
                  border: '1px solid #86efac',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: '#15803d',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <RefreshCw size={12} /> Change / Replace Image
              </button>
            </div>
          </div>

          {/* Remove / Clear Image Button */}
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Remove Image"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
