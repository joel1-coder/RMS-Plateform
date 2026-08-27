import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ScholarProfileView({ scholar, onBack }) {
  const { user } = useAuth();
  const [assignedScholars, setAssignedScholars] = useState([]);
  const [currentScholar, setCurrentScholar] = useState(scholar);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});

  // Get initial profile mock data populated with scholar-specific values
  const getInitialProfileData = (s) => {
    return {
      subject: s.dept || 'Computer Science',
      name: s.name,
      fathersName: 'John Doe',
      permanentAddress: '123 Main St, City, State, ZIP',
      communicationAddress: '123 Main St, City, State, ZIP',
      sex: 'Male',
      bloodGroup: 'O+',
      dob: '01/01/1995',
      religion: 'Hindu',
      community: 'BC',
      caste: 'Example Caste',
      aadharNumber: '1234 5678 9012',
      mailId: s.email || '',
      
      // Family & Socio Economic Details
      occupation: 'Software Engineer',
      mothersName: 'Jane Doe',
      orphanStatus: 'No',
      guardianName: 'N/A',
      annualIncome: '5,000,00',
      differentlyAbled: 'No',

      // Bank & Institutional Records
      bankName: 'State Bank of India',
      accountNumber: '12345678901',
      ifscCode: 'SBIN0001234',
      courseYear: s.admission || '2023',
      courseJoinedDate: '01/08/2023',
      dateOfAdmission: '15/07/2023',
      
      // Ph.D. Registration Details
      universityRegistrationNo: 'PHD2023CS001',
      registrationSessionYear: '2023-2024',
      broadTitle: s.topic || 'Artificial Intelligence in Healthcare Diagnostics',
      nameOfGuide: user?.name || 'Dr. Priya Kumar',
      guideRefNumber: 'G-2020-123',
      workingStatus: 'Full Time',

      // Educational qualifications
      ugProgramme: 'UG',
      ugSubject: 'B.Sc. Comp Sci',
      ugUniversity: 'Anna University',
      ugRegNo: 'UG12345',
      ugYear: '2019',
      ugClass: 'First',

      pgProgramme: 'PG',
      pgSubject: 'M.Sc. Comp Sci',
      pgUniversity: 'Anna University',
      pgRegNo: 'PG67890',
      pgYear: '2021',
      pgClass: 'First',

      mphilProgramme: 'M.Phil',
      mphilSubject: 'Comp Sci',
      mphilUniversity: 'Bharathidasan University',
      mphilRegNo: 'MP11223',
      mphilYear: '2022',
      mphilClass: 'Distinction',

      // Progress Tracker Metrics
      dcMeetY1: 'Completed', dcMeetY2: '', dcMeetY3: '', dcMeetY4: '', dcMeetY5: '',
      progressY1: 'Yes', progressY2: '', progressY3: '', progressY4: '', progressY5: '',
      feesY1: 'Yes', feesY2: '', feesY3: '', feesY4: '', feesY5: '',
      paymentDateY1: '12/08/2023', paymentDateY2: '', paymentDateY3: '', paymentDateY4: '', paymentDateY5: '',

      synopsisSubmission: 'NO OBJECTION CERTIFICATE'
    };
  };

  // Load supervisor's scholars from localStorage
  useEffect(() => {
    if (!user) return;
    let dbUsers = [];
    try {
      const rawUsers = localStorage.getItem('rms_all_users');
      if (rawUsers) dbUsers = JSON.parse(rawUsers);
    } catch (e) {
      console.error('Failed to parse rms_all_users', e);
    }

    const supervisorName = user.name || '';
    const assigned = dbUsers.filter(
      u => u.role?.toLowerCase() === 'scholar' &&
           u.assignedSupervisor &&
           u.assignedSupervisor.toLowerCase() === supervisorName.toLowerCase()
    );

    let researchProjects = [];
    try {
      const rawResearch = localStorage.getItem('rms_research');
      if (rawResearch) researchProjects = JSON.parse(rawResearch);
    } catch (e) {
      console.error('Failed to parse rms_research', e);
    }

    const enriched = assigned.map(s => {
      const project = researchProjects.find(p => p.scholar.toLowerCase() === s.name.toLowerCase());
      const admissionYear = s.joined ? s.joined.split('-')[0] : '2024';
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        dept: s.dept || 'Computer Science',
        topic: project ? project.topic : 'Research Topic Pending Registration',
        progress: project ? project.progress : 0,
        status: project 
          ? (project.status === 'Completed' ? 'Completed' : (project.progress >= 60 ? 'On Track' : 'Needs Attention'))
          : 'Pending',
        admission: admissionYear,
        lastReview: project ? project.startDate : 'N/A'
      };
    });

    setAssignedScholars(enriched);

    // Sync currentScholar details with loaded data if possible
    const found = enriched.find(s => s.id === currentScholar.id);
    if (found) {
      setCurrentScholar(found);
    }
  }, [user, currentScholar.id]);

  // Load customizable data for this scholar
  useEffect(() => {
    if (!currentScholar) return;
    const stored = localStorage.getItem(`rms_scholar_profile_${currentScholar.id}`);
    if (stored) {
      try {
        setProfileData(JSON.parse(stored));
      } catch (e) {
        setProfileData(getInitialProfileData(currentScholar));
      }
    } else {
      setProfileData(getInitialProfileData(currentScholar));
    }
  }, [currentScholar]);

  const handleSave = () => {
    localStorage.setItem(`rms_scholar_profile_${currentScholar.id}`, JSON.stringify(profileData));
    toast.success('Scholar profile details saved successfully!');
    setIsEditing(false);
  };

  const handleScholarChange = (e) => {
    const selectedId = Number(e.target.value);
    const selected = assignedScholars.find(s => s.id === selectedId);
    if (selected) {
      setCurrentScholar(selected);
      setIsEditing(false);
    }
  };

  return (
    <div className="animate-fade">
      <div className="card" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1e3a8a', paddingBottom: '20px' }}>
          <h2 style={{ color: '#1e3a8a', margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>ST. JOSEPH'S COLLEGE (AUTONOMOUS)</h2>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
            NATIONAL ACCREDITED AT A++ GRADE (4TH CYCLE) BY NAAC<br/>
            College with Potential for Excellence by UGC | Special Heritage Status by UGC<br/>
            TIRUCHIRAPPALLI - 620 002.
          </div>
          <div style={{ 
            background: '#e0e7ff', 
            color: '#1e3a8a', 
            padding: '8px 20px', 
            borderRadius: '20px', 
            display: 'inline-block',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            ADMISSION TO PH.D. FULL-TIME PROGRAMME
          </div>
        </div>

        {/* Basic Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#e2e8f0', border: '1px solid #cbd5e1', marginBottom: '30px' }}>
          <DetailRow label="Subject" name="subject" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Sex" name="sex" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} options={['Male', 'Female', 'Other']} />
          
          <div style={{ display: 'flex', background: '#fff' }}>
            <div style={{ width: '40%', padding: '12px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', fontWeight: '500', fontSize: '13px', color: '#334155' }}>Name</div>
            <div style={{ width: '60%', padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
              <select 
                value={currentScholar.id} 
                onChange={handleScholarChange}
                className="form-control form-select"
                style={{ width: '100%', padding: '4px 8px', fontSize: '13px' }}
              >
                {assignedScholars.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DetailRow label="Blood Group" name="bloodGroup" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />

          <DetailRow label="Father's Name" name="fathersName" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Date of Birth" name="dob" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />

          <DetailRow label="Permanent Address" name="permanentAddress" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} gridRow="span 2" />
          <DetailRow label="Religion" name="religion" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Community" name="community" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />

          <DetailRow label="Communication Address" name="communicationAddress" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} gridRow="span 3" />
          <DetailRow label="Caste" name="caste" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Aadhar Number" name="aadharNumber" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Mail ID" name="mailId" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
        </div>

        {/* Section Title component */}
        <SectionTitle title="FAMILY & SOCIO ECONOMIC DETAILS" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#e2e8f0', border: '1px solid #cbd5e1', marginBottom: '30px' }}>
          <DetailRow label="Occupation" name="occupation" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Guardian Name" name="guardianName" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Mother's Name" name="mothersName" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Annual Income" name="annualIncome" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Orphan Status" name="orphanStatus" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} options={['No', 'Yes']} />
          <DetailRow label="Differently Abled" name="differentlyAbled" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} options={['No', 'Yes']} />
        </div>

        <SectionTitle title="BANK & INSTITUTIONAL RECORDS" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#e2e8f0', border: '1px solid #cbd5e1', marginBottom: '30px' }}>
          <DetailRow label="Bank Name" name="bankName" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Course Year" name="courseYear" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Account Number" name="accountNumber" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Course Joined Date" name="courseJoinedDate" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="IFSC Code" name="ifscCode" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
          <DetailRow label="Date of Admission" name="dateOfAdmission" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
        </div>

        <SectionTitle title="EDUCATIONAL QUALIFICATIONS" />

        <div style={{ marginBottom: '30px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#1e3a8a', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>PROGRAMME</th>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>SUBJECT</th>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>UNIVERSITY</th>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>REG.NO</th>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>YEAR OF PASSING</th>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>CLASS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                <td style={{ padding: '10px 15px', fontWeight: '600' }}>UG</td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.ugSubject || ''} onChange={e => setProfileData({...profileData, ugSubject: e.target.value})} />
                  ) : profileData.ugSubject}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.ugUniversity || ''} onChange={e => setProfileData({...profileData, ugUniversity: e.target.value})} />
                  ) : profileData.ugUniversity}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.ugRegNo || ''} onChange={e => setProfileData({...profileData, ugRegNo: e.target.value})} />
                  ) : profileData.ugRegNo}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.ugYear || ''} onChange={e => setProfileData({...profileData, ugYear: e.target.value})} />
                  ) : profileData.ugYear}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.ugClass || ''} onChange={e => setProfileData({...profileData, ugClass: e.target.value})} />
                  ) : profileData.ugClass}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                <td style={{ padding: '10px 15px', fontWeight: '600' }}>PG</td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.pgSubject || ''} onChange={e => setProfileData({...profileData, pgSubject: e.target.value})} />
                  ) : profileData.pgSubject}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.pgUniversity || ''} onChange={e => setProfileData({...profileData, pgUniversity: e.target.value})} />
                  ) : profileData.pgUniversity}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.pgRegNo || ''} onChange={e => setProfileData({...profileData, pgRegNo: e.target.value})} />
                  ) : profileData.pgRegNo}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.pgYear || ''} onChange={e => setProfileData({...profileData, pgYear: e.target.value})} />
                  ) : profileData.pgYear}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.pgClass || ''} onChange={e => setProfileData({...profileData, pgClass: e.target.value})} />
                  ) : profileData.pgClass}
                </td>
              </tr>
              <tr style={{ background: '#fff' }}>
                <td style={{ padding: '10px 15px', fontWeight: '600' }}>M.Phil</td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.mphilSubject || ''} onChange={e => setProfileData({...profileData, mphilSubject: e.target.value})} />
                  ) : profileData.mphilSubject}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.mphilUniversity || ''} onChange={e => setProfileData({...profileData, mphilUniversity: e.target.value})} />
                  ) : profileData.mphilUniversity}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.mphilRegNo || ''} onChange={e => setProfileData({...profileData, mphilRegNo: e.target.value})} />
                  ) : profileData.mphilRegNo}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.mphilYear || ''} onChange={e => setProfileData({...profileData, mphilYear: e.target.value})} />
                  ) : profileData.mphilYear}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  {isEditing ? (
                    <input className="form-control" style={{ fontSize: '12px', padding: '2px 6px', width: '100%' }} value={profileData.mphilClass || ''} onChange={e => setProfileData({...profileData, mphilClass: e.target.value})} />
                  ) : profileData.mphilClass}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <SectionTitle title="PH.D. REGISTRATION DETAILS" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px', background: '#e2e8f0', border: '1px solid #cbd5e1', marginBottom: '30px' }}>
          <DetailRow label="University / Registration No." name="universityRegistrationNo" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} width="30%" />
          <DetailRow label="Registration Session/Year" name="registrationSessionYear" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} width="30%" />
          <DetailRow label="Broad Title of the Thesis" name="broadTitle" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} width="30%" />
          <DetailRow label="Name of the Guide" name="nameOfGuide" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} width="30%" />
          <DetailRow label="Guide-ship Reference Number" name="guideRefNumber" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} width="30%" />
          <DetailRow label="Working Status" name="workingStatus" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} width="30%" />
        </div>

        <div style={{ background: '#1e3a8a', color: '#fff', padding: '10px 15px', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase' }}>
          PROGRESS MONITORING & FEES TRACKER
        </div>
        <div style={{ marginBottom: '20px', border: '1px solid #cbd5e1', borderTop: 'none', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#334155', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '10px 15px', fontWeight: '600', borderRight: '1px solid #e2e8f0' }}>METRIC</th>
                <th style={{ padding: '10px 15px', fontWeight: '600', background: '#fef9c3', borderRight: '1px solid #e2e8f0' }}>I YEAR</th>
                <th style={{ padding: '10px 15px', fontWeight: '600', borderRight: '1px solid #e2e8f0' }}>II YEAR</th>
                <th style={{ padding: '10px 15px', fontWeight: '600', borderRight: '1px solid #e2e8f0' }}>III YEAR</th>
                <th style={{ padding: '10px 15px', fontWeight: '600', borderRight: '1px solid #e2e8f0' }}>IV YEAR</th>
                <th style={{ padding: '10px 15px', fontWeight: '600' }}>V YEAR</th>
              </tr>
            </thead>
            <tbody>
              <ProgressRow metric="Doctoral Committee Meet" name="dcMeet" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
              <ProgressRow metric="Progress Report Submitted" name="progress" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
              <ProgressRow metric="Fees Paid to College" name="fees" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
              <ProgressRow metric="Date of Payment" name="paymentDate" profileData={profileData} setProfileData={setProfileData} isEditing={isEditing} />
            </tbody>
          </table>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px', width: '70%' }}>
              <span style={{ fontWeight: '600' }}>SYNOPSIS SUBMISSION / NO OBJECTION CERTIFICATE:</span> 
              {isEditing ? (
                <input 
                  value={profileData.synopsisSubmission || ''} 
                  onChange={e => setProfileData({...profileData, synopsisSubmission: e.target.value})}
                  className="form-control"
                  style={{ fontSize: '12px', padding: '4px 8px', flex: 1 }}
                />
              ) : (
                <span>{profileData.synopsisSubmission || '-'}</span>
              )}
            </div>
            <button 
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }} 
              style={{ background: isEditing ? '#1E7D45' : '#174EA6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              {isEditing ? 'SAVE DETAILS' : 'UPDATE DETAILS'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '40px' }}>
          <button style={{ 
            background: '#174EA6', color: '#fff', border: 'none', 
            padding: '12px 24px', borderRadius: '6px', fontSize: '14px', 
            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            DOWNLOAD AS PDF
          </button>
          <button 
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            style={{ 
              background: isEditing ? '#1E7D45' : '#0A2A66', color: '#fff', border: 'none', 
              padding: '12px 24px', borderRadius: '6px', fontSize: '14px', 
              fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
            }}
          >
            {isEditing ? 'SAVE CUSTOM CHANGES' : 'CUSTOMIZE DETAILS'}
          </button>
          <button onClick={onBack} style={{ 
            background: '#e2e8f0', color: '#475569', border: 'none', 
            padding: '12px 24px', borderRadius: '6px', fontSize: '14px', 
            fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            BACK TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}

const SectionTitle = ({ title }) => (
  <div style={{ 
    background: '#f8fafc', 
    color: '#334155', 
    padding: '10px 15px', 
    fontWeight: '700', 
    fontSize: '13px', 
    border: '1px solid #cbd5e1', 
    borderBottom: 'none',
    textTransform: 'uppercase'
  }}>
    {title}
  </div>
);

const DetailRow = ({ label, name, profileData, setProfileData, isEditing, type = 'text', options = null, width = '40%', gridRow }) => {
  const value = profileData[name] || '';
  return (
    <div style={{ display: 'flex', background: '#fff', gridRow: gridRow }}>
      <div style={{ width: width, padding: '12px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', fontWeight: '500', fontSize: '13px', color: '#334155' }}>{label}</div>
      <div style={{ flex: 1, padding: isEditing ? '8px 12px' : '12px', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
        {isEditing ? (
          options ? (
            <select
              value={value}
              onChange={(e) => setProfileData({ ...profileData, [name]: e.target.value })}
              className="form-control form-select"
              style={{ width: '100%', padding: '4px 8px', fontSize: '13px' }}
            >
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => setProfileData({ ...profileData, [name]: e.target.value })}
              className="form-control"
              style={{ width: '100%', padding: '4px 8px', fontSize: '13px' }}
            />
          )
        ) : (
          value || '-'
        )}
      </div>
    </div>
  );
};

const ProgressRow = ({ metric, name, profileData, setProfileData, isEditing }) => {
  const years = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'];
  return (
    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
      <td style={{ padding: '10px 15px', fontWeight: '500', color: '#475569', borderRight: '1px solid #e2e8f0' }}>{metric}</td>
      {years.map(y => {
        const fieldName = `${name}${y}`;
        const val = profileData[fieldName] || '';
        const isY1 = y === 'Y1';
        const bg = isY1 ? '#fef9c3' : 'transparent';
        return (
          <td key={y} style={{ padding: isEditing ? '6px 10px' : '10px 15px', background: bg, borderRight: y !== 'Y5' ? '1px solid #e2e8f0' : 'none' }}>
            {isEditing ? (
              <input
                value={val}
                onChange={e => setProfileData({ ...profileData, [fieldName]: e.target.value })}
                className="form-control"
                style={{ fontSize: '12px', padding: '2px 6px', width: '100%', minWidth: '50px' }}
              />
            ) : val || '-'}
          </td>
        );
      })}
    </tr>
  );
};
