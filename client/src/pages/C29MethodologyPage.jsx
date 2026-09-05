import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  MapPin,
  Camera,
  AlertCircle,
  HelpCircle,
  Users,
  ShieldAlert,
  Edit3,
  Save,
  CheckCircle2,
  Table,
  Layers,
  Sparkles,
  Info,
  Upload,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { projectApi } from '../services/api.js';
import { DemoBadge } from '../components/DemoBadge.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function C29MethodologyPage() {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingNumbers, setIsEditingNumbers] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoFileName, setPhotoFileName] = useState(null);
  const [photoUploadedAt, setPhotoUploadedAt] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const [fieldNumbers, setFieldNumbers] = useState({
    vehicleCount: '[ACTUAL VALUE]',
    averageWaitingTime: '[ACTUAL VALUE]',
    peakCongestionDuration: '[ACTUAL VALUE]',
    location: 'College Main Gate',
    observationDuration: '[Replace with actual observation duration]'
  });

  const { addToast } = useToast();

  const fetchProjectData = async () => {
    try {
      const res = await projectApi.getMethodology();
      if (res.success && res.data) {
        setProjectData(res.data);
        if (res.data.fieldObservation?.photoUrl) {
          setPhotoUrl(res.data.fieldObservation.photoUrl);
          setPhotoFileName(res.data.fieldObservation.photoFileName || 'field_photo.jpg');
          setPhotoUploadedAt(res.data.fieldObservation.photoUploadedAt || null);
        }
        if (res.data.fieldNumbers) {
          setFieldNumbers({
            vehicleCount: res.data.fieldNumbers.vehicleCount || '[ACTUAL VALUE]',
            averageWaitingTime: res.data.fieldNumbers.averageWaitingTime || '[ACTUAL VALUE]',
            peakCongestionDuration: res.data.fieldNumbers.peakCongestionDuration || '[ACTUAL VALUE]',
            location: res.data.fieldObservation?.location || 'College Main Gate',
            observationDuration: res.data.fieldObservation?.observationDuration || '[Replace with actual observation duration]'
          });
        }
      }
    } catch (err) {
      console.error('Failed to load project methodology:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleSaveFieldNumbers = async () => {
    try {
      const res = await projectApi.updateFieldNumbers(fieldNumbers);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Field Numbers Saved',
          message: 'Observation metrics updated for presentation.'
        });
        setIsEditingNumbers(false);
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message
      });
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // File validation: Ensure it's an image
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const isImage = file.type.startsWith('image/') || validMimeTypes.includes(file.type.toLowerCase());
    
    if (!isImage) {
      setUploadError('Invalid file format. Please select an image file (JPG, PNG, WEBP, or GIF).');
      addToast({
        type: 'error',
        title: 'Invalid File Selected',
        message: 'Only image files (JPG, PNG, WEBP, GIF) are allowed.'
      });
      return;
    }

    // File size validation: Limit to 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10 MB. Please select a smaller image.');
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Maximum allowed image size is 10 MB.'
      });
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const res = await projectApi.uploadPhoto({
          photoUrl: base64Data,
          photoFileName: file.name,
          photoUploadedAt: new Date().toISOString()
        });

        if (res.success) {
          setPhotoUrl(base64Data);
          setPhotoFileName(file.name);
          setPhotoUploadedAt(new Date().toISOString());
          addToast({
            type: 'success',
            title: 'Field Photo Uploaded',
            message: 'Photograph stored and ready for project presentation.'
          });
        }
      } catch (err) {
        setUploadError('Failed to save photo to backend database.');
        addToast({
          type: 'error',
          title: 'Upload Failed',
          message: err.message || 'Could not save photograph'
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadError('Error reading file from disk.');
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove the field observation photo?')) {
      return;
    }

    setIsUploading(true);
    try {
      const res = await projectApi.deletePhoto();
      if (res.success) {
        setPhotoUrl(null);
        setPhotoFileName(null);
        setPhotoUploadedAt(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        addToast({
          type: 'info',
          title: 'Photo Removed',
          message: 'Field observation photograph cleared.'
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Remove Failed',
        message: err.message || 'Could not delete photo'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  if (loading && !projectData) {
    return <LoadingSpinner text="Compiling C29 Academic Project Dossier..." size={36} />;
  }

  const {
    fiveWhys = [],
    stakeholders = [],
    existingSolutions = [],
    proposedSolutionComparison = [],
    responsibleAiPrinciples = []
  } = projectData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif,image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        style={{ display: 'none' }}
      />

      {/* Page Title & Context */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>C29 Project & Research Methodology</h1>
            <DemoBadge size="xs" text="ACADEMIC SPECIFICATION" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
            AI Immersion Capstone • Problem Framing, Root Cause Analysis, 5 Whys, and Responsible AI Governance
          </p>
        </div>
      </div>

      {/* Presentation Roadmap Quick Links */}
      <div
        style={{
          padding: '12px 20px',
          borderRadius: '14px',
          background: 'var(--cyan-bg)',
          border: '1px solid var(--cyan-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--cyan-500)',
          flexWrap: 'wrap'
        }}
      >
        <span>Presentation Flow:</span>
        <strong>Field Observation</strong> →
        <strong>Problem Statement</strong> →
        <strong>5 Whys Root Cause</strong> →
        <strong>Stakeholders</strong> →
        <strong>Field Numbers</strong> →
        <strong>Existing Solutions</strong> →
        <strong>Proposed AI Solution</strong> →
        <strong>Responsible AI</strong>
      </div>

      {/* 1. Field Observation Section */}
      <div className="glass-card" style={{ padding: '28px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={22} color="var(--cyan-500)" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>1. Field Observation</h2>
          </div>
          <span className="badge badge-demo">STUDENT FIELD DATA</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-pill)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Location</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 0 0' }}>
                  {fieldNumbers.location}
                </p>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-pill)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Observation Duration</span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cyan-500)', margin: '4px 0 0 0' }}>
                  {fieldNumbers.observationDuration}
                </p>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-pill)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Observed Issue</span>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  Traffic congestion during peak arrival and departure periods. Long vehicular queues block pedestrians and incoming emergency corridors.
                </p>
              </div>
            </div>
          </div>

          {/* Field Photograph Upload / Display Component */}
          {photoUrl ? (
            <div
              style={{
                borderRadius: '16px',
                border: '1.5px solid var(--cyan-border)',
                background: 'var(--bg-card-solid)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-card)',
                minHeight: '260px'
              }}
            >
              <div>
                {/* Uploaded Image Preview */}
                <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
                  <img
                    src={photoUrl}
                    alt="Uploaded Field Observation"
                    style={{
                      width: '100%',
                      maxHeight: '280px',
                      objectFit: 'cover',
                      display: 'block',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  />
                </div>

                {/* Upload Success Banner */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'var(--emerald-bg)',
                    border: '1px solid var(--emerald-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '12.5px', color: 'var(--emerald-400)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} />
                    Field photograph uploaded successfully
                  </span>
                  {photoFileName && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {photoFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Change Photo / Remove Photo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 14px', fontSize: '12.5px' }}
                >
                  <RefreshCw size={14} className={isUploading ? 'radar-spinner' : ''} />
                  Change Photo
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                  className="btn-rose"
                  style={{ flex: 1, padding: '8px 14px', fontSize: '12.5px' }}
                >
                  <Trash2 size={14} />
                  Remove Photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderRadius: '16px',
                border: `2px dashed ${isDragging ? 'var(--cyan-500)' : 'var(--cyan-border)'}`,
                background: isDragging ? 'var(--cyan-bg)' : 'var(--bg-pill)',
                padding: '36px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '220px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isDragging ? '0 0 25px var(--cyan-glow)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--cyan-500)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--cyan-glow)';
              }}
              onMouseLeave={(e) => {
                if (!isDragging) {
                  e.currentTarget.style.borderColor = 'var(--cyan-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isUploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Loader2 size={38} className="radar-spinner" color="var(--cyan-500)" />
                  <span style={{ fontSize: '13px', color: 'var(--cyan-500)', fontFamily: 'var(--font-mono)' }}>
                    Uploading & validating photograph...
                  </span>
                </div>
              ) : (
                <>
                  <Camera size={44} color="var(--cyan-500)" style={{ marginBottom: '14px', opacity: 0.85 }} />
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    INSERT YOUR OWN FIELD PHOTOGRAPH HERE
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '340px', marginBottom: '14px' }}>
                    Click or drag & drop to upload your field photograph (JPG, JPEG, PNG, WEBP — Max 10MB)
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 20px', fontSize: '12.5px' }}
                  >
                    <Upload size={14} />
                    Upload Field Photo
                  </button>

                  {uploadError && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--rose-bg)',
                        border: '1px solid var(--rose-border)',
                        color: 'var(--rose-400)',
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <AlertTriangle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Problem Statement & Root Cause */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          border: '1px solid var(--rose-border)',
          background: 'var(--rose-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <AlertCircle size={22} color="var(--rose-400)" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            2. Real-World Problem Statement
          </h2>
        </div>

        <blockquote
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            paddingLeft: '18px',
            borderLeft: '4px solid var(--rose-400)',
            margin: '0 0 20px 0'
          }}
        >
          “Students, staff, and visitors entering and leaving the college face traffic congestion at the college gate, especially during peak hours. Manual traffic management makes it difficult to continuously monitor vehicle flow and identify growing congestion, resulting in increased waiting time and crowding.”
        </blockquote>

        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--rose-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <strong style={{ color: 'var(--rose-400)', fontSize: '13.5px' }}>ROOT CAUSE:</strong>
          <span style={{ color: 'var(--text-main)', fontSize: '13.5px', fontWeight: 600 }}>
            Lack of continuous traffic monitoring and automated congestion prediction.
          </span>
        </div>
      </div>

      {/* 3. Interactive Five Whys Section */}
      <div className="glass-card" style={{ padding: '28px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <HelpCircle size={22} color="var(--cyan-500)" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>3. Five Whys Root Cause Analysis</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fiveWhys.map((w, index) => {
            if (w.rootCauseTitle) {
              return (
                <div
                  key={index}
                  style={{
                    marginTop: '8px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'var(--cyan-bg)',
                    border: '1px solid var(--cyan-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Sparkles size={20} color="var(--cyan-500)" />
                  <div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan-500)', fontWeight: 800 }}>
                      FINAL ROOT CAUSE VERIFICATION
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                      {w.rootCauseSummary}
                    </h4>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'var(--bg-pill)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--cyan-500)',
                    background: 'var(--cyan-bg)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--cyan-border)'
                  }}
                >
                  WHY {w.step}?
                </span>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                    {w.question}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                    → {w.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Stakeholder Map */}
      <div className="glass-card" style={{ padding: '28px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Users size={22} color="var(--emerald-400)" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>4. Stakeholder Impact Matrix</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {stakeholders.map((s, i) => (
            <div
              key={i}
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'var(--bg-pill)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--emerald-400)', fontWeight: 800 }}>
                  {s.priority}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 8px 0' }}>
                  {s.role}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {s.impact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Three Field Numbers (Editable for Presentation) */}
      <div className="glass-card" style={{ padding: '28px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>5. Three Core Field Numbers</h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Replace these placeholders with actual field-observed values. Never invent field data.
            </p>
          </div>

          <button
            onClick={() => {
              if (isEditingNumbers) handleSaveFieldNumbers();
              else setIsEditingNumbers(true);
            }}
            className={isEditingNumbers ? 'btn-emerald' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            {isEditingNumbers ? <Save size={14} /> : <Edit3 size={14} />}
            {isEditingNumbers ? 'Save Field Values' : 'Edit Presentation Values'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--cyan-500)', background: 'var(--bg-pill)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>1. Vehicle Count</span>
            {isEditingNumbers ? (
              <input
                type="text"
                value={fieldNumbers.vehicleCount}
                onChange={(e) => setFieldNumbers({ ...fieldNumbers, vehicleCount: e.target.value })}
                className="form-input"
                style={{ marginTop: '8px', fontSize: '14px' }}
              />
            ) : (
              <h3 className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                {fieldNumbers.vehicleCount}
              </h3>
            )}
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Peak window count</p>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--amber-400)', background: 'var(--bg-pill)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>2. Average Waiting Time</span>
            {isEditingNumbers ? (
              <input
                type="text"
                value={fieldNumbers.averageWaitingTime}
                onChange={(e) => setFieldNumbers({ ...fieldNumbers, averageWaitingTime: e.target.value })}
                className="form-input"
                style={{ marginTop: '8px', fontSize: '14px' }}
              />
            ) : (
              <h3 className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                {fieldNumbers.averageWaitingTime}
              </h3>
            )}
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Recorded gate delay</p>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--rose-400)', background: 'var(--bg-pill)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>3. Peak Congestion Duration</span>
            {isEditingNumbers ? (
              <input
                type="text"
                value={fieldNumbers.peakCongestionDuration}
                onChange={(e) => setFieldNumbers({ ...fieldNumbers, peakCongestionDuration: e.target.value })}
                className="form-input"
                style={{ marginTop: '8px', fontSize: '14px' }}
              />
            ) : (
              <h3 className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                {fieldNumbers.peakCongestionDuration}
              </h3>
            )}
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>Duration of bottleneck</p>
          </div>
        </div>
      </div>

      {/* 6. Existing Solutions vs SmartGate AI Comparison Table */}
      <div className="glass-card" style={{ padding: '28px', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Table size={22} color="var(--cyan-500)" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>6. Existing Solutions vs. Proposed SmartGate AI</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px', fontWeight: 700 }}>Approach</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Detection Layer</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Real-Time Intelligence</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Prediction Capability</th>
                <th style={{ padding: '14px', fontWeight: 700 }}>Limitation / Outcome</th>
              </tr>
            </thead>
            <tbody>
              {proposedSolutionComparison.map((row, idx) => {
                const isProposed = row.approach.includes('SmartGate');
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isProposed ? 'var(--cyan-bg)' : 'transparent',
                      fontWeight: isProposed ? 700 : 400
                    }}
                  >
                    <td style={{ padding: '14px', color: isProposed ? 'var(--cyan-500)' : 'var(--text-main)' }}>
                      {row.approach}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{row.detection}</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{row.intelligence}</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{row.prediction}</td>
                    <td style={{ padding: '14px', color: isProposed ? 'var(--emerald-400)' : 'var(--text-muted)' }}>{row.limitation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Responsible AI Section */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          border: '1px solid var(--emerald-border)',
          background: 'var(--emerald-bg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <ShieldAlert size={22} color="var(--emerald-400)" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>7. Responsible AI & Ethics Principles</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {responsibleAiPrinciples.map((prin, pIdx) => (
            <div
              key={pIdx}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--emerald-border)'
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--emerald-400)', marginBottom: '6px' }}>
                ✓ {prin.title}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {prin.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
