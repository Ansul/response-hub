import React, { useState, useEffect } from 'react';
import './App.css';
import { apiService, ImpactedPerson, NewsItem, Issue } from './services/api';

// Types are now imported from services/api.ts
// Local Issue interface for compatibility with existing data
interface LocalIssue {
  id: number;
  title: string;
  category: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

// Convert between LocalIssue and API Issue formats
const convertLocalToApiIssue = (localIssue: LocalIssue): Issue => ({
  id: localIssue.id,
  title: localIssue.title,
  description: localIssue.description,
  category: localIssue.category,
  priority: localIssue.priority as 'low' | 'medium' | 'high' | 'critical',
  status: 'open',
  reportedBy: 'System',
  reportedAt: localIssue.date
});

const convertApiToLocalIssue = (apiIssue: Issue): LocalIssue => ({
  id: apiIssue.id,
  title: apiIssue.title,
  description: apiIssue.description,
  category: apiIssue.category,
  priority: apiIssue.priority as 'high' | 'medium' | 'low',
  date: apiIssue.reportedAt
});

// Sample current issues data
const sampleIssues: LocalIssue[] = [
  {
    id: 1,
    title: "Climate Change Action Summit",
    category: "Environment",
    date: "2024-01-15",
    priority: "high",
    description: "Global leaders gather to discuss urgent climate action measures and carbon reduction targets for 2024."
  },
  {
    id: 2,
    title: "Cybersecurity Threats on Rise",
    category: "Technology",
    date: "2024-01-14",
    priority: "medium",
    description: "New report shows 40% increase in ransomware attacks targeting small businesses and healthcare systems."
  },
  {
    id: 3,
    title: "Housing Crisis Solutions",
    category: "Economy",
    date: "2024-01-13",
    priority: "high",
    description: "Local governments implementing new policies to address affordable housing shortages in major cities."
  },
  {
    id: 4,
    title: "Healthcare Worker Shortage",
    category: "Healthcare",
    date: "2024-01-12",
    priority: "high",
    description: "Hospitals report critical staffing levels as healthcare workers face burnout and seek alternative careers."
  },
  {
    id: 5,
    title: "AI Ethics Guidelines Released",
    category: "Technology",
    date: "2024-01-11",
    priority: "medium",
    description: "Tech industry consortium publishes comprehensive guidelines for ethical AI development and deployment."
  },
  {
    id: 6,
    title: "Global Supply Chain Disruptions",
    category: "Economy",
    date: "2024-01-10",
    priority: "medium",
    description: "Manufacturing delays continue to impact consumer goods availability worldwide due to logistics challenges."
  }
];

// Latest News Data
const latestNews: NewsItem[] = [
  {
    id: 1,
    title: "Major Airport Delays Due to Weather Conditions",
    summary: "Severe weather across multiple regions causing significant flight delays and cancellations affecting thousands of passengers.",
    timestamp: "2024-01-20T10:30:00Z",
    category: "Transportation",
    source: "Aviation Authority"
  },
  {
    id: 2,
    title: "Cybersecurity Alert: Travel Document System Compromised",
    summary: "Security breach detected in travel document verification system. Immediate action required to protect passenger data.",
    timestamp: "2024-01-20T09:15:00Z",
    category: "Security",
    source: "Cyber Security Center"
  },
  {
    id: 3,
    title: "New Immigration Policy Implementation",
    summary: "Updated immigration procedures now in effect. All travelers must comply with new documentation requirements.",
    timestamp: "2024-01-20T08:45:00Z",
    category: "Policy",
    source: "Immigration Services"
  },
  {
    id: 4,
    title: "Airport Infrastructure Upgrade Complete",
    summary: "Terminal 3 modernization project completed ahead of schedule, improving passenger experience and capacity.",
    timestamp: "2024-01-19T16:20:00Z",
    category: "Infrastructure",
    source: "Airport Authority"
  }
];

// Impacted Persons Data
const impactedPersons: ImpactedPerson[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    reason: "Flight cancellation due to weather",
    airport: "JFK International",
    status: "pending",
    dateReported: "2024-01-20"
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    reason: "Document verification delay",
    airport: "LAX International",
    status: "escalated",
    dateReported: "2024-01-20"
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    reason: "Baggage handling issue",
    airport: "Heathrow Airport",
    status: "resolved",
    dateReported: "2024-01-19"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    reason: "Immigration processing delay",
    airport: "Toronto Pearson",
    status: "pending",
    dateReported: "2024-01-20"
  },
  {
    id: 5,
    name: "Chen Wei",
    email: "chen.wei@email.com",
    reason: "Security screening delay",
    airport: "Beijing Capital",
    status: "pending",
    dateReported: "2024-01-20"
  },
  {
    id: 6,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    reason: "Gate change notification failure",
    airport: "Frankfurt Airport",
    status: "resolved",
    dateReported: "2024-01-19"
  },
  {
    id: 7,
    name: "David Brown",
    email: "david.brown@email.com",
    reason: "Check-in system malfunction",
    airport: "Dubai International",
    status: "escalated",
    dateReported: "2024-01-20"
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    reason: "Visa processing error",
    airport: "Sydney Kingsford Smith",
    status: "pending",
    dateReported: "2024-01-20"
  },
  {
    id: 9,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    reason: "Flight overbooking",
    airport: "Singapore Changi",
    status: "resolved",
    dateReported: "2024-01-19"
  },
  {
    id: 10,
    name: "Anna Petrov",
    email: "anna.petrov@email.com",
    reason: "Customs clearance delay",
    airport: "Moscow Sheremetyevo",
    status: "pending",
    dateReported: "2024-01-20"
  }
];

const bannerNews = [
  "🔴 BREAKING: Major weather delays affecting multiple airports worldwide",
  "📈 TRAVEL: New immigration policies now in effect across all terminals",
  "🚨 SECURITY: Enhanced security measures implemented at all checkpoints",
  "🏥 HEALTH: Updated health screening requirements for international travel",
  "🌍 GLOBAL: International cooperation increases on travel security protocols"
];

// Latest News Component
const LatestNews: React.FC = () => {
  // Load news data from localStorage or use default data
  const [newsData, setNewsData] = useState<NewsItem[]>(() => {
    try {
      const savedData = localStorage.getItem('latestNews');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading news data from localStorage:', error);
    }
    return latestNews;
  });

  // Save news data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('latestNews', JSON.stringify(newsData));
    } catch (error) {
      console.error('Error saving news data to localStorage:', error);
    }
  }, [newsData]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="latest-news-section">
      <div className="news-header">
        <h2>Latest News & Updates</h2>
        <span className="news-count">{newsData.length} updates</span>
      </div>
      <div className="news-grid">
        {newsData.map(news => (
          <div key={news.id} className="news-card">
            <div className="news-card-header">
              <span className="news-category">{news.category}</span>
              <span className="news-timestamp">{formatTimestamp(news.timestamp)}</span>
            </div>
            <h3 className="news-title">{news.title}</h3>
            <p className="news-summary">{news.summary}</p>
            <div className="news-source">Source: {news.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Impacted Persons Table Component
const ImpactedPersonsTable: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedPerson, setEditedPerson] = useState<ImpactedPerson | null>(null);
  const [persons, setPersons] = useState<ImpactedPerson[]>(impactedPersons);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [excelUrl, setExcelUrl] = useState<string>('');

  // Load data from server on component mount
  useEffect(() => {
    const loadDataFromServer = async () => {
      try {
        setSyncStatus('syncing');
        const response = await apiService.getImpactedPersons();
        if (response.success && response.data) {
          setPersons(response.data);
        }
        setSyncStatus('success');
      } catch (error) {
        console.error('Error loading data from server:', error);
        setSyncStatus('error');
        
        // Fallback to localStorage
        try {
          const savedData = localStorage.getItem('impactedPersons');
          if (savedData) {
            setPersons(JSON.parse(savedData));
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    };

    if (isOnline) {
      loadDataFromServer();
    }
  }, [isOnline]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync data to server when persons change
  useEffect(() => {
    const syncToServer = async () => {
      if (!isOnline) return;
      
      try {
        setSyncStatus('syncing');
        await apiService.syncImpactedPersons(persons);
        setSyncStatus('success');
      } catch (error) {
        console.error('Error syncing to server:', error);
        setSyncStatus('error');
      }
    };

    // Debounce sync to avoid too many requests
    const timeoutId = setTimeout(syncToServer, 1000);
    return () => clearTimeout(timeoutId);
  }, [persons, isOnline]);

  // Save to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('impactedPersons', JSON.stringify(persons));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [persons]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#ff8800';
      case 'resolved': return '#44aa44';
      case 'escalated': return '#ff4444';
      default: return '#666';
    }
  };

  const handleEdit = (person: ImpactedPerson) => {
    setEditingId(person.id);
    setEditedPerson({ ...person });
  };

  const handleSave = async () => {
    if (editedPerson) {
      try {
        if (isOnline) {
          const response = await apiService.updateImpactedPerson(editedPerson.id, editedPerson);
          if (response.success) {
            setPersons(prev => prev.map(person => 
              person.id === editedPerson.id ? editedPerson : person
            ));
          } else {
            throw new Error(response.error || 'Failed to update person');
          }
        } else {
          // Offline mode - update locally
          setPersons(prev => prev.map(person => 
            person.id === editedPerson.id ? editedPerson : person
          ));
        }
        setEditingId(null);
        setEditedPerson(null);
      } catch (error) {
        console.error('Error saving person:', error);
        alert('Error saving person. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPerson(null);
  };

  const handleInputChange = (field: keyof ImpactedPerson, value: string) => {
    if (editedPerson) {
      setEditedPerson({ ...editedPerson, [field]: value });
    }
  };

  const handleAddNew = async () => {
    try {
      const newId = Date.now(); // Use timestamp for unique ID
      const newPerson: ImpactedPerson = {
        id: newId,
        name: '',
        email: '',
        reason: '',
        airport: '',
        status: 'pending',
        dateReported: new Date().toISOString().split('T')[0]
      };

      if (isOnline) {
        const response = await apiService.createImpactedPerson(newPerson);
        if (response.success && response.data) {
          setPersons(prev => [...prev, response.data!]);
          setEditingId(response.data.id);
          setEditedPerson({ ...response.data });
        } else {
          throw new Error(response.error || 'Failed to create person');
        }
      } else {
        // Offline mode - add locally
        setPersons(prev => [...prev, newPerson]);
        setEditingId(newId);
        setEditedPerson({ ...newPerson });
      }
    } catch (error) {
      console.error('Error adding person:', error);
      alert('Error adding person. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        if (isOnline) {
          const response = await apiService.deleteImpactedPerson(id);
          if (response.success) {
            setPersons(prev => prev.filter(person => person.id !== id));
            if (editingId === id) {
              setEditingId(null);
              setEditedPerson(null);
            }
          } else {
            throw new Error(response.error || 'Failed to delete person');
          }
        } else {
          // Offline mode - delete locally
          setPersons(prev => prev.filter(person => person.id !== id));
          if (editingId === id) {
            setEditingId(null);
            setEditedPerson(null);
          }
        }
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Error deleting person. Please try again.');
      }
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('impactedPersons');
      setPersons(impactedPersons);
    }
  };

  const handleExportData = async () => {
    try {
      if (isOnline) {
        // Get Excel file URL from server
        const response = await apiService.getExcelFileUrl();
        if (response.success && response.data?.url) {
          // Open Excel file in new tab
          window.open(response.data.url, '_blank');
        } else {
          throw new Error('Failed to get Excel file URL');
        }
      } else {
        // Offline mode - export as JSON
        const dataStr = JSON.stringify(persons, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `impacted-persons-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const filteredPersons = persons.filter(person => {
    const statusMatch = filterStatus === 'all' || person.status === filterStatus;
    const searchMatch = searchTerm === '' || 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="impacted-persons-section">
      <div className="table-header">
        <div className="table-title-section">
          <h2>Impacted Persons Registry</h2>
          <div className="header-actions">
            <button 
              onClick={handleAddNew}
              className="add-new-btn"
              title="Add new person"
            >
              + Add New
            </button>
            <button 
              onClick={handleExportData}
              className="export-btn"
              title="Export data to JSON file"
            >
              📥 Export
            </button>
            <button 
              onClick={handleClearAllData}
              className="clear-btn"
              title="Clear all data"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, airport, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table className="impacted-persons-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Reason</th>
              <th>Airport</th>
              <th>Status</th>
              <th>Date Reported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersons.map(person => (
              <tr key={person.id}>
                <td className="name-cell">
                  {editingId === person.id ? (
                    <input
                      type="text"
                      value={editedPerson?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    person.name
                  )}
                </td>
                <td className="email-cell">
                  {editingId === person.id ? (
                    <input
                      type="email"
                      value={editedPerson?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    person.email
                  )}
                </td>
                <td className="reason-cell">
                  {editingId === person.id ? (
                    <input
                      type="text"
                      value={editedPerson?.reason || ''}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    person.reason
                  )}
                </td>
                <td className="airport-cell">
                  {editingId === person.id ? (
                    <input
                      type="text"
                      value={editedPerson?.airport || ''}
                      onChange={(e) => handleInputChange('airport', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    person.airport
                  )}
                </td>
                <td className="status-cell">
                  {editingId === person.id ? (
                    <select
                      value={editedPerson?.status || 'pending'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="edit-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="escalated">Escalated</option>
                    </select>
                  ) : (
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(person.status) }}
                    >
                      {person.status.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="date-cell">{person.dateReported}</td>
                <td className="actions-cell">
                  {editingId === person.id ? (
                    <div className="action-buttons">
                      <button 
                        onClick={handleSave}
                        className="save-btn"
                        title="Save changes"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="cancel-btn"
                        title="Cancel editing"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(person)}
                        className="edit-btn"
                        title="Edit record"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(person.id)}
                        className="delete-btn"
                        title="Delete record"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPersons.length === 0 && (
          <div className="no-results">
            No persons found matching your criteria.
          </div>
        )}
      </div>
      <div className="table-footer">
        <div className="footer-left">
          <span>Showing {filteredPersons.length} of {persons.length} records</span>
          <div className="sync-info">
            <span className={`sync-status ${syncStatus}`}>
              {syncStatus === 'syncing' && '🔄 Syncing...'}
              {syncStatus === 'success' && '✅ Synced to server'}
              {syncStatus === 'error' && '❌ Sync failed'}
              {syncStatus === 'idle' && '💾 Ready to sync'}
            </span>
            <span className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🌐 Online' : '📴 Offline'}
            </span>
          </div>
        </div>
        <div className="footer-right">
          <small>
            {isOnline ? 'Changes sync to server & S3' : 'Changes saved locally'}
          </small>
        </div>
      </div>
    </div>
  );
};

// Running Banner Component
const RunningBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % bannerNews.length
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="banner-container">
      <div className="banner-content">
        <span className="banner-label">LATEST UPDATE</span>
        <div className="banner-text">
          {bannerNews[currentIndex]}
        </div>
      </div>
    </div>
  );
};

// Bulletin Item Component
interface BulletinItemProps {
  issue: LocalIssue;
}

const BulletinItem: React.FC<BulletinItemProps> = ({ issue }) => {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ff8800';
      case 'low': return '#44aa44';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bulletin-item">
      <div className="bulletin-header">
        <div className="bulletin-title-row">
          <h3 className="bulletin-title">{issue.title}</h3>
          <span 
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(issue.priority) }}
          >
            {issue.priority.toUpperCase()}
          </span>
        </div>
        <div className="bulletin-meta">
          <span className="category">{issue.category}</span>
          <span className="date">{formatDate(issue.date)}</span>
        </div>
      </div>
      <p className="bulletin-description">{issue.description}</p>
    </div>
  );
};

// Filter Component
interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedPriority: string;
  onPriorityChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  selectedPriority, 
  onPriorityChange 
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Category:</label>
        <select value={selectedCategory} onChange={onCategoryChange}>
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Priority:</label>
        <select value={selectedPriority} onChange={onPriorityChange}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  // State management
  const [issues, setIssues] = useState<LocalIssue[]>(sampleIssues);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Load data from server on component mount
  useEffect(() => {
    const loadDataFromServer = async () => {
      try {
        setSyncStatus('syncing');
        
        // Load issues data
        const issuesResponse = await apiService.getIssues();
        if (issuesResponse.success && issuesResponse.data) {
          const localIssues = issuesResponse.data.map(convertApiToLocalIssue);
          setIssues(localIssues);
        }
        
        setLastSync(new Date());
        setSyncStatus('success');
      } catch (error) {
        console.error('Error loading data from server:', error);
        setSyncStatus('error');
        
        // Fallback to localStorage
        try {
          const savedData = localStorage.getItem('currentIssues');
          if (savedData) {
            setIssues(JSON.parse(savedData));
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
        }
      }
    };

    if (isOnline) {
      loadDataFromServer();
    }
  }, [isOnline]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('idle');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync data to server when issues change
  useEffect(() => {
    const syncToServer = async () => {
      if (!isOnline) return;
      
      try {
        setSyncStatus('syncing');
        const apiIssues = issues.map(convertLocalToApiIssue);
        await apiService.syncIssues(apiIssues);
        setLastSync(new Date());
        setSyncStatus('success');
      } catch (error) {
        console.error('Error syncing to server:', error);
        setSyncStatus('error');
      }
    };

    // Debounce sync to avoid too many requests
    const timeoutId = setTimeout(syncToServer, 1000);
    return () => clearTimeout(timeoutId);
  }, [issues, isOnline]);

  // Save to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('currentIssues', JSON.stringify(issues));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [issues]);

  // Handle scroll events for banner shrinking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // Start shrinking after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const categories = Array.from(new Set(issues.map(issue => issue.category)));
  
  const filteredIssues = issues.filter(issue => {
    const categoryMatch = selectedCategory === 'all' || issue.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || issue.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  return (
    <div className="app">
      <div className={`top-banner-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo-section">
          <img 
            src="/logo.jpg" 
            alt="Response Hub Logo" 
            className="logo-image"
            onError={(e) => {
              // Fallback to CSS logo if image fails to load
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
          <div className="logo-fallback" style={{ display: 'none' }}>
            <div className="logo-icon">
              <div className="logo-circle">
                <span className="logo-exclamation">!</span>
              </div>
            </div>
            <div className="logo-text">
              <div className="logo-response">RESPONSE</div>
              <div className="logo-hub">HUB</div>
            </div>
            <div className="logo-network">
              <div className="network-node"></div>
              <div className="network-node"></div>
              <div className="network-node"></div>
              <div className="network-node"></div>
            </div>
          </div>
        </div>
      <RunningBanner />
      </div>
      
      <div className="container">

        {/* Latest News Section */}
        <LatestNews />

        {/* Impacted Persons Table */}
        <ImpactedPersonsTable />

        {/* Issues Bulletin Section */}
        <div className="issues-section">
          <div className="section-header">
            <h2>Current Issues Bulletin</h2>
            <p>Stay informed with the latest updates on critical issues</p>
          </div>

        <FilterBar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(e) => setSelectedCategory(e.target.value)}
          selectedPriority={selectedPriority}
          onPriorityChange={(e) => setSelectedPriority(e.target.value)}
        />

        <div className="bulletin-board">
          <div className="bulletin-stats">
            <span>Showing {filteredIssues.length} of {issues.length} issues</span>
          </div>
          
          <div className="bulletin-list">
            {filteredIssues.map(issue => (
              <BulletinItem key={issue.id} issue={issue} />
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
