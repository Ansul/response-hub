import React, { useState, useEffect } from 'react';
import './App.css';

// Types
interface Issue {
  id: number;
  title: string;
  category: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  timestamp: string;
  category: string;
  source: string;
}

interface ImpactedPerson {
  id: number;
  name: string;
  email: string;
  reason: string;
  airport: string;
  status: 'pending' | 'resolved' | 'escalated';
  dateReported: string;
}

// Sample current issues data
const sampleIssues: Issue[] = [
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
    title: "Chicago ICE facility protests turn violent",
    summary: "Dem mayor, anti-ICE protesters hit with tear gas, pepper balls during clash with federal agents outside Chicago facility",
    timestamp: "2024-01-20T10:30:00Z",
    category: "Security",
    source: "https://nypost.com/2025/09/19/us-news/anti-ice-protesters-arrested-during-clash-with-federal-agents-outside-chicago-facility/"
  },
  {
    id: 2,
    title: "Gen-Z Led Protests Toppled Nepal Government",
    summary: "Generation Z protesters have toppled the government of Nepal, forcing the resignation of Prime Minister Sher Bahadur Deuba.",
    timestamp: "2024-01-20T09:15:00Z",
    category: "Security",
    source: "https://www.npr.org/2025/09/19/1385604595/nepal-protests-prime-minister-sher-bahadur-deuba-resigns"
  },
  {
    id: 3,
    title: "H1B Sticker Shock: New $100,000 Fee Could End Tech's Foreign Worker Rush",
    summary: "Potential policy will be in effect as of 21st Sep midnight. Big tech. has communicated employees to come back",
    timestamp: "2025-09-20T08:45:00Z",
    category: "Policy",
    source: "https://www.whitehouse.gov/presidential-actions/2025/09/restriction-on-entry-of-certain-nonimmigrant-workers"
  }
];

// Impacted Persons Data
const impactedPersons: ImpactedPerson[] = [
  // {
  //   id: 1,
  //   name: "John Smith",
  //   email: "john.smith@email.com",
  //   reason: "Flight cancellation due to weather",
  //   airport: "JFK International",
  //   status: "pending",
  //   dateReported: "2024-01-20"
  // },
  // {
  //   id: 2,
  //   name: "Maria Garcia",
  //   email: "maria.garcia@email.com",
  //   reason: "Document verification delay",
  //   airport: "LAX International",
  //   status: "escalated",
  //   dateReported: "2024-01-20"
  // },
  // {
  //   id: 3,
  //   name: "Ahmed Hassan",
  //   email: "ahmed.hassan@email.com",
  //   reason: "Baggage handling issue",
  //   airport: "Heathrow Airport",
  //   status: "resolved",
  //   dateReported: "2024-01-19"
  // },
  // {
  //   id: 4,
  //   name: "Sarah Johnson",
  //   email: "sarah.johnson@email.com",
  //   reason: "Immigration processing delay",
  //   airport: "Toronto Pearson",
  //   status: "pending",
  //   dateReported: "2024-01-20"
  // },
  // {
  //   id: 5,
  //   name: "Chen Wei",
  //   email: "chen.wei@email.com",
  //   reason: "Security screening delay",
  //   airport: "Beijing Capital",
  //   status: "pending",
  //   dateReported: "2024-01-20"
  // },
  // {
  //   id: 6,
  //   name: "Emma Wilson",
  //   email: "emma.wilson@email.com",
  //   reason: "Gate change notification failure",
  //   airport: "Frankfurt Airport",
  //   status: "resolved",
  //   dateReported: "2024-01-19"
  // },
  // {
  //   id: 7,
  //   name: "David Brown",
  //   email: "david.brown@email.com",
  //   reason: "Check-in system malfunction",
  //   airport: "Dubai International",
  //   status: "escalated",
  //   dateReported: "2024-01-20"
  // },
  // {
  //   id: 8,
  //   name: "Lisa Anderson",
  //   email: "lisa.anderson@email.com",
  //   reason: "Visa processing error",
  //   airport: "Sydney Kingsford Smith",
  //   status: "pending",
  //   dateReported: "2024-01-20"
  // },
  // {
  //   id: 9,
  //   name: "Michael Chen",
  //   email: "michael.chen@email.com",
  //   reason: "Flight overbooking",
  //   airport: "Singapore Changi",
  //   status: "resolved",
  //   dateReported: "2024-01-19"
  // },
  // {
  //   id: 10,
  //   name: "Anna Petrov",
  //   email: "anna.petrov@email.com",
  //   reason: "Customs clearance delay",
  //   airport: "Moscow Sheremetyevo",
  //   status: "pending",
  //   dateReported: "2024-01-20"
  // }
];

// Default fallback news items
const defaultBannerNews = [
  "🔴 BREAKING: Major weather delays affecting multiple airports worldwide - Flight cancellations expected throughout the day",
  "📈 TRAVEL: New immigration policies now in effect across all terminals - Passengers advised to arrive 3 hours early for international flights",
  "🚨 SECURITY: Enhanced security measures implemented at all checkpoints - Additional screening procedures may cause longer wait times",
  "🏥 HEALTH: Updated health screening requirements for international travel - Mandatory health declarations required for all passengers",
  "🌍 GLOBAL: International cooperation increases on travel security protocols - New collaborative measures enhance passenger safety worldwide"
];

// Latest News Component
const LatestNews: React.FC = () => {

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
        <span className="news-count">{latestNews.length} updates</span>
      </div>
      <div className="news-grid">
        {latestNews.map(news => (
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
  
  // Load data from localStorage or use default data (read-only)
  const [persons] = useState<ImpactedPerson[]>(() => {
    try {
      const savedData = localStorage.getItem('impactedPersons');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return impactedPersons;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#ff8800';
      case 'resolved': return '#44aa44';
      case 'escalated': return '#ff4444';
      default: return '#666';
    }
  };




  const handleExportData = () => {
    try {
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
              <h2>Impacted Registry</h2>
              <div className="header-actions">
                <button 
                  onClick={handleExportData}
                  className="export-btn"
                  title="Export data to JSON file"
                >
                  📥 Export
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
            </tr>
          </thead>
          <tbody>
            {filteredPersons.map(person => (
              <tr key={person.id}>
                <td className="name-cell">{person.name}</td>
                <td className="email-cell">{person.email}</td>
                <td className="reason-cell">{person.reason}</td>
                <td className="airport-cell">{person.airport}</td>
                <td className="status-cell">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(person.status) }}
                  >
                    {person.status.toUpperCase()}
                  </span>
                </td>
                <td className="date-cell">{person.dateReported}</td>
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
        </div>
        <div className="footer-right">
          <small>Data here can have upto 24 hours of delay for any changes to be reflected</small>
        </div>
      </div>
    </div>
  );
};

// Running Banner Component
const RunningBanner: React.FC = () => {
  const [bannerNews, setBannerNews] = useState<string[]>(defaultBannerNews);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCrisisNews = async () => {
      try {
        setIsLoading(true);
        
        // Using NewsAPI for crisis-related news
        // Note: In production, you would need to add your API key
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=crisis OR emergency OR disaster OR conflict OR war OR pandemic&sortBy=publishedAt&pageSize=10&language=en&apiKey=demo'
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            const crisisNews = data.articles
              .filter((article: any) => 
                article.title && 
                article.description && 
                !article.title.includes('undefined')
              )
              .slice(0, 8)
              .map((article: any, index: number) => {
                const emoji = getCrisisEmoji(article.title);
                return `${emoji} ${article.title} - ${article.description?.substring(0, 100)}...`;
              });
            
            if (crisisNews.length > 0) {
              setBannerNews(crisisNews);
            }
          }
        }
      } catch (error) {
        console.log('Using fallback news data due to API error:', error);
        // Keep using default news if API fails
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch news immediately
    fetchCrisisNews();
    
    // Refresh news every 30 minutes
    const interval = setInterval(fetchCrisisNews, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getCrisisEmoji = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('war') || lowerTitle.includes('conflict') || lowerTitle.includes('military')) {
      return '⚔️';
    } else if (lowerTitle.includes('earthquake') || lowerTitle.includes('flood') || lowerTitle.includes('hurricane') || lowerTitle.includes('storm')) {
      return '🌪️';
    } else if (lowerTitle.includes('fire') || lowerTitle.includes('wildfire')) {
      return '🔥';
    } else if (lowerTitle.includes('pandemic') || lowerTitle.includes('virus') || lowerTitle.includes('health')) {
      return '🏥';
    } else if (lowerTitle.includes('economic') || lowerTitle.includes('financial') || lowerTitle.includes('recession')) {
      return '📉';
    } else if (lowerTitle.includes('terror') || lowerTitle.includes('attack') || lowerTitle.includes('bomb')) {
      return '🚨';
    } else if (lowerTitle.includes('climate') || lowerTitle.includes('environment') || lowerTitle.includes('global warming')) {
      return '🌍';
    } else if (lowerTitle.includes('refugee') || lowerTitle.includes('migration') || lowerTitle.includes('displacement')) {
      return '🏃';
    } else {
      return '🔴';
    }
  };

  return (
    <div className="banner-container">
      <div className="banner-content">
        <span className="banner-label">GLOBAL CRISIS ALERTS</span>
        <div className="banner-text">
          {isLoading ? (
            <div className="scrolling-text">
              <span className="news-item">🔄 Loading latest crisis updates from around the world...</span>
            </div>
          ) : (
            <div className="scrolling-text">
              {bannerNews.map((news, index) => (
                <span key={index} className="news-item">
                  {news}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {bannerNews.map((news, index) => (
                <span key={`duplicate-${index}`} className="news-item">
                  {news}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Bulletin Item Component
interface BulletinItemProps {
  issue: Issue;
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
  // Load issues data from localStorage or use default data
  const [issues] = useState<Issue[]>(() => {
    try {
      const savedData = localStorage.getItem('currentIssues');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading issues data from localStorage:', error);
    }
    return sampleIssues;
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);


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
            <h2>Current Bulletin</h2>
            <p>Stay informed with the latest updates</p>
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
