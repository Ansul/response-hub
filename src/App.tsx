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
  source: string;
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

// Sample current issues data - Last week's real news (September 13-19, 2025)
const sampleIssues: Issue[] = [
  {
    id: 1,
    title: "NATO Condemns Russia's Drone Incursion into Poland",
    category: "Security",
    date: "2025-09-13",
    priority: "high",
    description: "NATO chief labels Russia's drone incursion into Poland as 'absolutely reckless' as tensions escalate between Russia and NATO allies.",
    source: "https://abcnews.go.com/International/poland-airspace-repeatedly-violated-drone-type-objects-amid/story?id=125422386"
  },
  {
    id: 2,
    title: "Israeli Military Orders Gaza Evacuation",
    category: "Security",
    date: "2025-09-14",
    priority: "high",
    description: "Israeli military drops flyers ordering Palestinians to evacuate Gaza Strip ahead of new offensive, escalating Middle East tensions.",
    source: "https://globalnews.ca/video/10756276/global-national-sept-14-2"
  },
  {
    id: 3,
    title: "Massive London Protests and Clashes",
    category: "Political",
    date: "2025-09-14",
    priority: "medium",
    description: "Large-scale protests erupt in London with significant clashes between demonstrators and law enforcement, causing widespread disruption.",
    source: "https://www.abc.net.au/news/2025-09-13/uk-anti-immigration-rally-and-counter-protests/105770802"
  },
  {
    id: 4,
    title: "Baltic Sea WWII Ammunition Environmental Crisis",
    category: "Environment",
    date: "2025-09-15",
    priority: "high",
    description: "Decaying World War II munitions are contaminating the Baltic Sea, posing severe environmental hazards amid rising Russia-NATO tensions.",
    source: "https://abcnews.go.com/International/wireStory/huge-piles-rusty-wwii-ammunition-poisoning-baltic-sea-125580552"
  },
  {
    id: 5,
    title: "Philippines Corruption Scandal in Flood Projects",
    category: "Political",
    date: "2025-09-15",
    priority: "medium",
    description: "Philippine president supports public anger over extensive corruption in flood-control projects while urging peaceful protests.",
    source: "https://abcnews.go.com/International/philippine-president-supports-public-anger-corruption"
  },
  {
    id: 6,
    title: "Europe Climate Deaths Reach 16,469 This Summer",
    category: "Environment",
    date: "2025-09-16",
    priority: "high",
    description: "Study reports climate change contributed to 16,469 deaths in Europe during summer 2025, highlighting urgent climate action needs.",
    source: "https://disasterresiliencenews.com/2025/09/19/today-in-disaster-resilience-19-september-2025"
  },
  {
    id: 7,
    title: "Europe's Extreme Weather Causes €43B in Losses",
    category: "Environment",
    date: "2025-09-17",
    priority: "high",
    description: "Europe's summer of extreme weather resulted in €43 billion in short-term economic losses, devastating communities and infrastructure.",
    source: "https://disasterresiliencenews.com/2025/09/19/today-in-disaster-resilience-19-september-2025"
  },
  {
    id: 8,
    title: "Global Wildfire Paradox Worsens Human Impact",
    category: "Environment",
    date: "2025-09-18",
    priority: "medium",
    description: "Research shows while total wildfire area has declined globally, human impacts have worsened with increased destruction and loss.",
    source: "https://disasterresiliencenews.com/2025/09/19/today-in-disaster-resilience-19-september-2025"
  },
  {
    id: 9,
    title: "Flood Forecasts Need Better Action Systems",
    category: "Environment",
    date: "2025-09-19",
    priority: "medium",
    description: "Experts emphasize need for accurate flood predictions, ground truth data, and effective public warning systems to mitigate disasters.",
    source: "https://disasterresiliencenews.com/2025/09/19/today-in-disaster-resilience-19-september-2025"
  },
  {
    id: 10,
    title: "Sudan Humanitarian Crisis Displaces Millions",
    category: "Humanitarian",
    date: "2025-09-19",
    priority: "high",
    description: "Ongoing conflict in Sudan has displaced millions with 8-9 million facing emergency hunger levels and famine declared in five areas.",
    source: "https://www.crs.org/global-emergency-updates/global-emergency-update-september-2025"
  },
  {
    id: 11,
    title: "Somalia Food Crisis Displaces 100,000",
    category: "Humanitarian",
    date: "2025-09-19",
    priority: "high",
    description: "Renewed fighting in Gedo region displaces nearly 100,000 people, exacerbating existing food crisis with inadequate shelter conditions.",
    source: "https://www.crs.org/global-emergency-updates/global-emergency-update-september-2025"
  },
  {
    id: 12,
    title: "Turkey Political Instability Sparks Mass Protests",
    category: "Political",
    date: "2025-09-19",
    priority: "medium",
    description: "Mass protests erupt in Ankara as government attempts to remove opposition party leader, threatening democratic stability.",
    source: "https://www.foreignexchanges.news/i/173597181/pakistan"
  }
];

// Latest News Data
const latestNews: NewsItem[] = [
  {
    id: 1,
    title: "Chicago ICE facility protests turn violent",
    summary: "Dem mayor, anti-ICE protesters hit with tear gas, pepper balls during clash with federal agents outside Chicago facility",
    timestamp: "2025-09-19T10:30:00Z",
    category: "Security",
    source: "https://nypost.com/2025/09/19/us-news/anti-ice-protesters-arrested-during-clash-with-federal-agents-outside-chicago-facility/"
  },
  {
    id: 2,
    title: "Gen-Z Led Protests Toppled Nepal Government",
    summary: "Generation Z protesters have toppled the government of Nepal, forcing the resignation of Prime Minister Sher Bahadur Deuba.",
    timestamp: "2025-09-20T09:15:00Z",
    category: "Security",
    source: "https://www.npr.org/2025/09/20/nx-s1-5545760/nepal-protests-gen-z"
  },
  {
    id: 3,
    title: "H1B Sticker Shock: New $100,000 Fee Could End Tech's Foreign Worker Rush",
    summary: "Potential policy will be in effect as of 21st Sep midnight. Big tech. has communicated employees to come back.",
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

// Default fallback news items - September 19, 2025 crisis updates
const defaultBannerNews = [
  "⚔️ BREAKING: Trump announces efforts to regain Bagram air base in Afghanistan - Taliban rejects foreign military presence",
  "🚨 URGENT: Venezuela mobilizes 2,500 soldiers to La Orchila Island - U.S. military actions kill 14, UN condemns executions",
  "🏥 CRISIS: CDC restricts MMRV vaccine for children under 4 - Febrile seizure risk sparks public health debate",
  "🚨 EMERGENCY: Senate rejects stopgap measures - Government shutdown looms, federal operations at risk",
  "⚔️ ALERT: Draft legislation grants Trump extensive powers to combat drug cartels - Terrorist designation and targeting powers",
  "🏥 URGENT: States form vaccine bloc - New York, Maine, Maryland, Massachusetts, Pennsylvania, New Jersey coordinate COVID response",
  "🚨 BREAKING: Hundreds of thousands protest in France - Labor unions strike against Macron austerity measures",
  "🌍 CRISIS: Indonesia climate activists demand halt to coal plants - Net-zero emissions by 2050, Jakarta protests escalate",
  "📉 URGENT: TikTok deal negotiated between Trump and Xi - Data security and ownership concerns remain unresolved",
  "🚨 ALERT: Civil rights groups warn of intensified immigration enforcement - Potential violations of civil liberties"
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
            <div className="news-source">
              Source: <a href={news.source} target="_blank" rel="noopener noreferrer" className="news-link">Read more</a>
            </div>
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
  
  // Load data from localStorage or use empty array (read-only)
  const [persons] = useState<ImpactedPerson[]>(() => {
    try {
      const savedData = localStorage.getItem('impactedPersons');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Only return data if it's not empty, otherwise return empty array
        return parsedData.length > 0 ? parsedData : [];
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return []; // Always start with empty array
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

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all impacted persons data? This action cannot be undone.')) {
      try {
        localStorage.removeItem('impactedPersons');
        // Force reload to show empty state
        window.location.reload();
      } catch (error) {
        console.error('Error clearing data:', error);
      }
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
                  onClick={handleClearData}
                  className="clear-btn"
                  title="Clear all data"
                >
                  🗑️ Clear All
                </button>
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
        <span className="banner-label">LATEST UPDATES</span>
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
      <div className="bulletin-source">
        <a 
          href={issue.source} 
          target="_blank" 
          rel="noopener noreferrer"
          className="source-link"
        >
          📰 Read more
        </a>
      </div>
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

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This will remove all localStorage data including issues, news, and impacted persons. This action cannot be undone.')) {
      try {
        localStorage.removeItem('currentIssues');
        localStorage.removeItem('latestNews');
        localStorage.removeItem('impactedPersons');
        alert('All data cleared successfully! The page will reload to show fresh data.');
        window.location.reload();
      } catch (error) {
        console.error('Error clearing all data:', error);
        alert('Error clearing data. Please try again.');
      }
    }
  };

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
            <div className="header-content">
              <div className="header-text">
                <h2>Current Bulletin</h2>
                <p>Stay informed with the latest updates</p>
              </div>
              <button 
                onClick={handleClearAllData}
                className="clear-all-data-btn"
                title="Clear all localStorage data"
              >
                🗑️ Clear All Data
              </button>
            </div>
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
            <span>Showing {filteredIssues.length} of {issues.length} bulletins</span>
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
